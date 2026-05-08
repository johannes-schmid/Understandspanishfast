import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

const ROUTES = [
  '/',
  '/level-test',
  '/words/most-common-spanish-words',
  '/blog',
  '/blog/the-power-of-the-first-100-words',
  '/blog/cracking-the-1500',
  '/blog/how-many-spanish-words-to-be-fluent',
]

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: ROUTES,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        maxConcurrentRoutes: 4,
      },
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html.replace(
          /<script defer="defer"/g,
          '<script defer'
        )
        return renderedRoute
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
