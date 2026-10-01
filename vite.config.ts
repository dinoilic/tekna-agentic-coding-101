import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const AIC_USER_AGENT = 'tekna-agentic-coding-101 workshop app'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/aic-iiif': {
        target: 'https://www.artic.edu',
        changeOrigin: true,
        rewrite: (requestPath) =>
          requestPath.replace(/^\/aic-iiif/, '/iiif/2'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyRequest) => {
            proxyRequest.setHeader('AIC-User-Agent', AIC_USER_AGENT)
          })
        },
      },
    },
  },
})
