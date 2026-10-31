import { AdaptiveDesignSystem } from "../src/index.js";
import { AllComponents } from "../src/custom-elements.js";

AdaptiveDesignSystem.adoptTokenStyles();

await AdaptiveDesignSystem.defineComponents(AllComponents);

/** @type {import("@storybook/html-vite").Preview} */
export default {
    parameters: {
        a11y: {
            test: "error",
        },
    },
};
