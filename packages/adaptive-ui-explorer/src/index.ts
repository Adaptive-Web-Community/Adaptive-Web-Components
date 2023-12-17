import { DesignToken } from "@microsoft/fast-foundation";
import { AdaptiveDesignSystem } from "@adaptive-web/adaptive-web-components";
import { AllComponents } from "@adaptive-web/adaptive-web-components/all-components";
import { DefaultState, State } from "./state.js";
import { app } from './app.js';

AdaptiveDesignSystem.defineComponents(AllComponents);

State.provide(document, new DefaultState());

DesignToken.registerDefaultStyleTarget();

app.define();
