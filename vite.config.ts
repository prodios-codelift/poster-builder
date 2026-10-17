import { defineConfig, lazyPlugins } from 'vite-plus'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { slideSourcePlugin } from './src/linkedin-carousels/vite-plugin-slide-source'

const config = defineConfig({
  fmt: { semi: false, singleQuote: true, trailingComma: 'all', ignorePatterns: ['.agents/**'] },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error', 'no-console': 'error' },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['.agents/**'],
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(() => [
    slideSourcePlugin(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ]),
})

export default config
