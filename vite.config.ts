import { fileURLToPath } from 'node:url'

import { defineConfig, lazyPlugins } from 'vite-plus'
import type { ServerOptions } from 'vite-plus'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { assetLibraryPlugin } from './src/asset-library/vite-plugin-asset-library'
import { slideSourcePlugin } from './src/linkedin-carousels/vite-plugin-slide-source'

// `DEV_ORIGINS` (comma-separated hosts, e.g. `abc.vercel.run`) opens the dev
// server to remote hosts such as a Vercel Sandbox. Whoever starts the server
// passes it in the process env, as with next-shadcn-starter's next.config.ts.
const devOrigins = (process.env.DEV_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim().replace(/^https?:\/\//, ''))
  .filter(Boolean)

const devServer: ServerOptions | undefined =
  devOrigins.length > 0
    ? {
        host: true,
        allowedHosts: devOrigins,
        cors: { origin: devOrigins.map((host) => `https://${host}`) },
        // Remote hosts serve the app over HTTPS on 443 (the sandbox proxy).
        hmr: { protocol: 'wss', clientPort: 443 },
      }
    : undefined

const config = defineConfig({
  fmt: { semi: false, singleQuote: true, trailingComma: 'all', ignorePatterns: ['.agents/**'] },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error', 'no-console': 'error' },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['.agents/**'],
  },
  resolve: {
    tsconfigPaths: true,
    // Global asset library: `import logo from '@assets/logo.svg'`.
    alias: { '@assets': fileURLToPath(new URL('./assets', import.meta.url)) },
  },
  server: devServer,
  plugins: lazyPlugins(() => [
    slideSourcePlugin(),
    assetLibraryPlugin(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ]),
})

export default config
