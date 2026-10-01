import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// artic.edu rejects IIIF image requests sent from localhost (see src/lib/api.ts),
// so `/iiif` is proxied to artic.edu with an allowed Referer header.
const iiifProxy = {
  target: "https://www.artic.edu",
  changeOrigin: true,
  headers: {
    Referer: "https://www.artic.edu/",
  },
  configure: (proxy: {
    on: (event: string, cb: (proxyReq: { setHeader: (k: string, v: string) => void }) => void) => void;
  }) => {
    proxy.on("proxyReq", (proxyReq) => {
      proxyReq.setHeader("Referer", "https://www.artic.edu/");
    });
  },
};

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
      "/iiif": iiifProxy,
    },
  },
  preview: {
    proxy: {
      "/iiif": iiifProxy,
    },
  },
})
