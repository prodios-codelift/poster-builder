import { useEffect, useSyncExternalStore } from 'react'

import {
  ASSET_API,
  ASSETS_CHANGED_EVENT,
  type AssetEntry,
  type AssetUsage,
  normalizeAssetName,
  renamedCopy,
} from './asset-files'

export class AssetRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body: Record<string, unknown>,
  ) {
    super(message)
  }
}

function assetUrl(name: string): string {
  return `${ASSET_API}/${encodeURIComponent(name)}`
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(input, init)
  } catch {
    throw new AssetRequestError(0, 'Could not reach the dev server', {})
  }
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
  if (!response.ok) {
    const message =
      typeof body.error === 'string' ? body.error : `Request failed (${response.status})`
    throw new AssetRequestError(response.status, message, body)
  }
  return body as T
}

export function errorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback
}

// ---------------------------------------------------------------------------
// Shared store: one list for every mounted manager, picker and swap layer.

type AssetLibraryState = {
  assets: AssetEntry[]
  loaded: boolean
  error: string | null
}

const SERVER_STATE: AssetLibraryState = { assets: [], loaded: false, error: null }

let state: AssetLibraryState = SERVER_STATE
const listeners = new Set<() => void>()
let inflight: Promise<void> | null = null
let queued = false
let refreshTimer: ReturnType<typeof setTimeout> | undefined

function setState(next: AssetLibraryState): void {
  state = next
  for (const listener of listeners) listener()
}

/** Re-list the folder. Overlapping calls collapse into one follow-up request. */
export function refreshAssets(): Promise<void> {
  if (!import.meta.env.DEV) return Promise.resolve()
  if (inflight) {
    queued = true
    return inflight
  }
  inflight = (async () => {
    try {
      const { assets } = await request<{ assets: AssetEntry[] }>(ASSET_API)
      setState({ assets, loaded: true, error: null })
    } catch (cause) {
      setState({ ...state, loaded: true, error: errorMessage(cause, 'Failed to load assets') })
    } finally {
      inflight = null
      if (queued) {
        queued = false
        void refreshAssets()
      }
    }
  })()
  return inflight
}

function scheduleRefresh(): void {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => void refreshAssets(), 150)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  const hot = import.meta.hot
  if (listeners.size === 1) {
    void refreshAssets()
    // New files in assets/, and source edits that change "used by".
    hot?.on(ASSETS_CHANGED_EVENT, scheduleRefresh)
    hot?.on('vite:afterUpdate', scheduleRefresh)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      hot?.off(ASSETS_CHANGED_EVENT, scheduleRefresh)
      hot?.off('vite:afterUpdate', scheduleRefresh)
    }
  }
}

export type AssetLibrary = AssetLibraryState & {
  /** False in production builds: the `/__assets` API only exists under `vp dev`. */
  available: boolean
}

export function useAssetLibrary(): AssetLibrary {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  )
  // Refresh when a new consumer mounts after the folder changed while nothing listened.
  useEffect(() => {
    if (import.meta.env.DEV && state.loaded) scheduleRefresh()
  }, [])
  return { ...snapshot, available: import.meta.env.DEV }
}

export function getAssets(): AssetEntry[] {
  return state.assets
}

// ---------------------------------------------------------------------------
// Mutations. Each one re-lists so every consumer sees the result.

export async function uploadAsset(
  file: File,
  { name = file.name, overwrite = false }: { name?: string; overwrite?: boolean } = {},
): Promise<string> {
  const target = normalizeAssetName(name)
  const query = overwrite ? '?overwrite=1' : ''
  const result = await request<{ name: string }>(`${assetUrl(target)}${query}`, {
    method: 'POST',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file,
  })
  await refreshAssets()
  return result.name
}

/** Upload under the file's own name, or the first free `name-N.ext` if taken. */
export async function uploadWithAutoRename(file: File): Promise<string> {
  const name = normalizeAssetName(file.name)
  try {
    return await uploadAsset(file, { name })
  } catch (cause) {
    if (!(cause instanceof AssetRequestError) || cause.status !== 409) throw cause
    await refreshAssets()
    return uploadAsset(file, {
      name: renamedCopy(
        name,
        getAssets().map((a) => a.name),
      ),
    })
  }
}

export async function renameAsset(
  name: string,
  next: string,
): Promise<{ name: string; updatedFiles: string[] }> {
  try {
    return await request<{ name: string; updatedFiles: string[] }>(assetUrl(name), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: next }),
    })
  } finally {
    await refreshAssets()
  }
}

export async function deleteAsset(name: string): Promise<void> {
  try {
    await request(assetUrl(name), { method: 'DELETE' })
  } finally {
    await refreshAssets()
  }
}

export function usagesOf(cause: unknown): AssetUsage[] {
  if (!(cause instanceof AssetRequestError)) return []
  const usages = cause.body.usages
  return Array.isArray(usages) ? (usages as AssetUsage[]) : []
}
