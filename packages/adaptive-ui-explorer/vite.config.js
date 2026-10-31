import { defineConfig } from "vite";

// The components and the explorer each have a copy of fast-element 3 in the install, since the root has the version of the Figma plugin,
// and the elements of one copy aren't the elements of the other (a template of one doesn't render a directive of the other). The explorer's
// is the one in the bundle. This can go when the plugin is on fast-element 3 and the root has a single copy.
export default defineConfig({
    resolve: {
        dedupe: ["@microsoft/fast-element"],
    },
});
