import { DesignToken } from "@microsoft/fast-foundation";

import { AdaptiveDesignSystem } from "../src/index";
import { AllComponents } from "../src/custom-elements";

DesignToken.registerDefaultStyleTarget();

AdaptiveDesignSystem.defineComponents(AllComponents);