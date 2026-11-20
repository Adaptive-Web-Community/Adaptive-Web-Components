import { defineConfig } from "vite";
import svg from "vite-plugin-svgo";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
    root: "./src/ui",
    // The components and the plugin each have a copy of fast-element 3 in the install, and the elements of one copy aren't the elements of the
    // other (a template of one doesn't render a directive of the other). The plugin's is the one in the bundle.
    resolve: {
        dedupe: ["@microsoft/fast-element"],
    },
    // Turn off all plugins, effectively just using the inlining capability.
    // Many icon libraries, like Fluent System Icons, are already optimized and the defaults can have negative consequences.
    plugins: [svg({ plugins: [] }), viteSingleFile()],
    build: {
        target: "esnext",
        outDir: "../../dist",
    },
});
