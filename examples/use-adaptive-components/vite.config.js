import { defineConfig } from "vite";
import svgo from 'rollup-plugin-svgo'

export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [svgo()]
		}
	}
})