import { setCustomElementsManifest } from "@storybook/web-components-vite";
import manifest from "../dist/custom-elements.json";
import { AdaptiveDesignSystem } from "../src/index.js";
import { AllComponents } from "../src/custom-elements.js";

// The controls of a story are the attributes, properties, slots, events, and parts of its `component` in the manifest, which
// `npm run cem:analyze` writes.
setCustomElementsManifest(manifest);

AdaptiveDesignSystem.adoptTokenStyles();

AdaptiveDesignSystem.defineComponents(AllComponents);

/** @type {import("@storybook/web-components-vite").Preview} */
export default {
    parameters: {
        a11y: {
            test: "error",
        },
    },
};
