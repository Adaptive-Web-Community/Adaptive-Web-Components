import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            external: ["@adaptive-web/adaptive-web-components/button"]
        }
    },
    plugins: [nodeResolve(), react()]
})
