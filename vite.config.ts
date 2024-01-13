import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";
// import basicSsl from "@vitejs/plugin-basic-ssl";
const date = Date.now();
const dateGroup = date;

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    splitVendorChunkPlugin(),
    viteCompression(),
    // basicSsl(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(".", "src") }],
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    manifest: false,
    minify: "terser",
    terserOptions: {
      compress: {
        unused: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ["lodash"],
        },
        chunkFileNames: `cache/${dateGroup}/chunks/[hash].${dateGroup}.js`,
        entryFileNames: `cache/${dateGroup}/chunks/[name].js`,
        assetFileNames: `cache/${dateGroup}/assets/[hash].${dateGroup}.[ext]`,
      },
    },
  },
});
