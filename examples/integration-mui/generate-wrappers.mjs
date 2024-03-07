import { generateReactWrappers } from "custom-element-react-wrappers";
import manifest from "../../packages/adaptive-web-components/dist/custom-elements.json" assert { type: "json" };

const options = {
    modulePath: (className, tagName) => `../../../packages/adaptive-web-components/dist/esm/components/index.js`,
    // outdir: "./src/react",
};

// Generate coded React wrappers based on the Adaptive Web Components custom elements manifest (CEM).
// See the output in the `react` directory.
generateReactWrappers(manifest, options);

// As mentioned in the README, this would be better to do as a wrapper package which exposes _your_ design system
// overrides and styles.