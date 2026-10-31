import { AdaptiveDesignSystem } from "./src/index.js";
import { AllComponents } from "./src/custom-elements.js";

AdaptiveDesignSystem.adoptTokenStyles();

AdaptiveDesignSystem.defineComponents(AllComponents);
