import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { DesignToken } from "@microsoft/fast-foundation";
import { App } from './app.js';

App;

// Compose and define the components.
AdaptiveDesignSystem.defineComponents({
    buttonDefinition,
});

DesignToken.registerDefaultStyleTarget();
