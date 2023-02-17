import { DesignToken } from "@microsoft/fast-foundation";

import AWC, { AllComponents } from "../src/index";

DesignToken.registerDefaultStyleTarget();

AWC.defineComponents(AllComponents);