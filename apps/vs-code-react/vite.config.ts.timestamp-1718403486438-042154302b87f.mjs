// vite.config.ts
import { defineConfig } from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/vite@5.2.6_@types+node@20.12.7_less@4.2.0_terser@5.30.2/node_modules/vite/dist/node/index.js";
import react from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.10_@types+node@20.12.7_less@4.2.0_terser@5.30.2_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { NodeGlobalsPolyfillPlugin } from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/@esbuild-plugins+node-globals-polyfill@0.2.3_esbuild@0.20.2/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import nodePolyfills from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/rollup-plugin-polyfill-node@0.13.0_rollup@4.16.4/node_modules/rollup-plugin-polyfill-node/dist/index.js";
import { nodePolyfills as np } from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/vite-plugin-node-polyfills@0.21.0_rollup@4.16.4_vite@5.2.6_@types+node@20.12.7_less@4.2.0_terser@5.30.2_/node_modules/vite-plugin-node-polyfills/dist/index.js";
import mkcert from "file:///Users/carloscastrotrejo/Documents/static/LogicAppsUX/node_modules/.pnpm/vite-plugin-mkcert@1.17.5_vite@5.2.10_@types+node@20.12.7_less@4.2.0_terser@5.30.2_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var vite_config_default = defineConfig({
  root: "./src",
  base: "./",
  resolve: {
    alias: [
      {
        find: "~reactflow",
        replacement: "reactflow"
      }
    ]
  },
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true
    }),
    np(),
    mkcert()
  ],
  define: {
    global: "globalThis",
    "process.env": {}
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FybG9zY2FzdHJvdHJlam8vRG9jdW1lbnRzL3N0YXRpYy9Mb2dpY0FwcHNVWC9hcHBzL3ZzLWNvZGUtcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYXJsb3NjYXN0cm90cmVqby9Eb2N1bWVudHMvc3RhdGljL0xvZ2ljQXBwc1VYL2FwcHMvdnMtY29kZS1yZWFjdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FybG9zY2FzdHJvdHJlam8vRG9jdW1lbnRzL3N0YXRpYy9Mb2dpY0FwcHNVWC9hcHBzL3ZzLWNvZGUtcmVhY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBOb2RlR2xvYmFsc1BvbHlmaWxsUGx1Z2luIH0gZnJvbSAnQGVzYnVpbGQtcGx1Z2lucy9ub2RlLWdsb2JhbHMtcG9seWZpbGwnO1xuaW1wb3J0IG5vZGVQb2x5ZmlsbHMgZnJvbSAncm9sbHVwLXBsdWdpbi1wb2x5ZmlsbC1ub2RlJztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgYXMgbnAgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiAnLi9zcmMnLFxuICBiYXNlOiAnLi8nLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogJ35yZWFjdGZsb3cnLFxuICAgICAgICByZXBsYWNlbWVudDogJ3JlYWN0ZmxvdycsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIE5vZGVHbG9iYWxzUG9seWZpbGxQbHVnaW4oe1xuICAgICAgcHJvY2VzczogdHJ1ZSxcbiAgICAgIGJ1ZmZlcjogdHJ1ZSxcbiAgICB9KSxcbiAgICBucCgpLFxuICAgIG1rY2VydCgpLFxuICBdLFxuICBkZWZpbmU6IHtcbiAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICAncHJvY2Vzcy5lbnYnOiB7fSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbbm9kZVBvbHlmaWxscygpXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBZLFNBQVMsb0JBQW9CO0FBQ3ZhLE9BQU8sV0FBVztBQUNsQixTQUFTLGlDQUFpQztBQUMxQyxPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGlCQUFpQixVQUFVO0FBQ3BDLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sMEJBQTBCO0FBQUEsTUFDeEIsU0FBUztBQUFBLE1BQ1QsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUFBLElBQ0QsR0FBRztBQUFBLElBQ0gsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixTQUFTLENBQUMsY0FBYyxDQUFDO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
