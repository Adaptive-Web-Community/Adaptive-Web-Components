import { AdaptiveDesignSystem } from "../src/index.js";
import { AllComponents } from "../src/custom-elements.js";

AdaptiveDesignSystem.adoptTokenStyles();

await AdaptiveDesignSystem.defineComponents(AllComponents);
