/**
 * Builds a Vercel Sandbox snapshot of poster-builder with dependencies
 * installed, laid out like prodios-autopilot's starters: the repo lives in
 * `/vercel/sandbox/poster-builder`.
 *
 *   vp run sandbox:snapshot   # clone, upload local pnpm files, pnpm install, snapshot
 *
 * Progress goes to stderr; stdout gets only the snapshot id.
 *
 * Auth comes from `VERCEL_OIDC_TOKEN` (`vercel link && vercel env pull .env.local`)
 * or from `VERCEL_TOKEN` + `VERCEL_TEAM_ID` + `VERCEL_PROJECT_ID`. See `.env.example`.
 *
 * A snapshot keeps the filesystem only. A sandbox restored from it starts the
 * dev server itself, passing its own host as `DEV_ORIGINS`:
 *
 *   sh -c 'pnpm dev >> /tmp/dev-server.log 2>&1'  (cwd CODE_DIR, env DEV_ORIGINS=<host>)
 */
import { readFile } from 'node:fs/promises'

import { Sandbox } from '@vercel/sandbox'

const REPO_URL = process.env.REPO_URL || 'https://github.com/prodios-codelift/poster-builder'
const GIT_REVISION = process.env.GIT_REVISION || 'main'
const PNPM_VERSION = process.env.PNPM_VERSION || '10.34.7'
const CODE_DIR = '/vercel/sandbox/poster-builder'
const VCPUS = Number(process.env.SANDBOX_VCPUS || 4)
// Days of non-use before the snapshot expires; 0 (the default) never expires.
const EXPIRATION_DAYS = Number(process.env.SNAPSHOT_EXPIRATION_DAYS || 0)

// The clone only has what's pushed, so these local files overwrite the
// cloned ones. The install then matches your local lockfile even before the
// pnpm switch reaches GIT_REVISION.
const PACKAGE_FILES = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml']
const REPO_ROOT = new URL('../', import.meta.url)

const log = (message: string) => process.stderr.write(`\n▸ ${message}\n`)

function credentials() {
  const { VERCEL_TOKEN: token, VERCEL_TEAM_ID: teamId, VERCEL_PROJECT_ID: projectId } = process.env
  if (!token) return {} // fall back to VERCEL_OIDC_TOKEN
  if (!teamId || !projectId) {
    throw new Error('VERCEL_TOKEN also needs VERCEL_TEAM_ID and VERCEL_PROJECT_ID')
  }
  return { token, teamId, projectId }
}

async function run(
  sandbox: Sandbox,
  cmd: string,
  args: string[],
  opts: { cwd?: string; sudo?: boolean } = {},
) {
  process.stderr.write(`$ ${cmd} ${args.join(' ')}\n`)
  const result = await sandbox.runCommand({
    cmd,
    args,
    cwd: CODE_DIR,
    ...opts,
    stdout: process.stderr,
    stderr: process.stderr,
  })
  if (result.exitCode !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${result.exitCode}`)
}

async function main() {
  log('Creating sandbox')
  const sandbox = await Sandbox.create({
    ...credentials(),
    image: 'vercel/sandbox/universal:latest',
    resources: { vcpus: VCPUS },
    timeout: 15 * 60 * 1000,
  })
  process.stderr.write(`sandbox ${sandbox.name}\n`)

  try {
    log(`Cloning ${REPO_URL}#${GIT_REVISION} into ${CODE_DIR}`)
    // The universal image has no /vercel/sandbox, and /vercel is root-owned:
    // create the dir as root, then hand it to the default user for the clone.
    await run(
      sandbox,
      'sh',
      ['-c', 'sudo mkdir -p "$1" && sudo chown "$(id -u):$(id -g)" "$1"', 'sh', CODE_DIR],
      { cwd: '/' },
    )
    await run(
      sandbox,
      'git',
      ['clone', '--depth', '1', '--branch', GIT_REVISION, REPO_URL, CODE_DIR],
      { cwd: '/' },
    )

    log(`Uploading ${PACKAGE_FILES.join(', ')}`)
    await sandbox.writeFiles(
      await Promise.all(
        PACKAGE_FILES.map(async (file) => ({
          path: `${CODE_DIR}/${file}`,
          content: await readFile(new URL(file, REPO_ROOT)),
        })),
      ),
    )
    await run(sandbox, 'rm', ['-f', 'bun.lock'])

    log(`Installing pnpm@${PNPM_VERSION}`)
    // Outside the repo, so npm doesn't trip over the project's devEngines.
    await run(sandbox, 'npm', ['install', '-g', `pnpm@${PNPM_VERSION}`], { cwd: '/', sudo: true })

    log('Installing dependencies')
    await run(sandbox, 'pnpm', ['install', '--frozen-lockfile'])

    log('Taking snapshot (this stops the sandbox)')
    const snapshot = await sandbox.snapshot({ expiration: EXPIRATION_DAYS * 24 * 60 * 60 * 1000 })

    process.stdout.write(`${snapshot.snapshotId}\n`)
  } catch (error) {
    await sandbox.stop().catch(() => {})
    throw error
  }
}

main().catch((error) => {
  process.stderr.write(`\n✖ ${error instanceof Error ? error.message : error}\n`)
  process.exit(1)
})
