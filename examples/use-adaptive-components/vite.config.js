import { defineConfig } from "vite";
import svg from 'vite-plugin-svgo'

export default defineConfig({
	plugins: [svg()]
})