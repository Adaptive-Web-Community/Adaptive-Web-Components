import { DesignToken } from "@microsoft/fast-foundation";

import { DefaultDesignSystem } from "../src/index";
import { AllComponents } from "../src/custom-elements";

DesignToken.registerDefaultStyleTarget();

DefaultDesignSystem.defineComponents(AllComponents);