import { defineConfig } from "vite";
import svg from 'vite-plugin-svgo'

export default defineConfig({
	// Turn off all plugins, effectively just using the inlining capability.
	// Many icon libraries, like Fluent System Icons, are already optimized and the defaults can have negative consequences.
	plugins: [svg({plugins:[]})]
});
