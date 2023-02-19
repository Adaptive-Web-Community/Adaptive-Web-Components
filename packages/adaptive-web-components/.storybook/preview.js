import { DesignToken } from "@microsoft/fast-foundation";

import AWC from "../src/index";
import { AllComponents } from "../src/custom-elements";

DesignToken.registerDefaultStyleTarget();

AWC.defineComponents(AllComponents);