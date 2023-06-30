// All components that are used in html must be defined.
import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { avatarDefinition } from "@adaptive-web/adaptive-web-components/avatar";
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { cardDefinition } from "@adaptive-web/adaptive-web-components/card";
import { radioDefinition } from "@adaptive-web/adaptive-web-components/radio";
import { radioGroupDefinition } from "@adaptive-web/adaptive-web-components/radio-group";
import { switchDefinition } from "@adaptive-web/adaptive-web-components/switch";
import { textFieldDefinition } from "@adaptive-web/adaptive-web-components/text-field";
AdaptiveDesignSystem.defineComponents({
    avatarDefinition,
    buttonDefinition,
    cardDefinition,
    radioDefinition,
    radioGroupDefinition,
    switchDefinition,
    // textFieldDefinition // Uncomment to define the `adaptive-text-field` element.
});

import {
    accentBaseColor,
    fillColor,
    LayerBaseLuminance,
    layerFillBaseLuminance,
    layerFillFixedBase
} from "@adaptive-web/adaptive-ui/reference";
import { DesignToken, FASTRadioGroup, FASTSwitch } from "@microsoft/fast-foundation";

// This must be called during initialization for the Design Tokens to be setup so the component styling is applied.
DesignToken.registerDefaultStyleTarget();

// The `fillColor` Design Token is the reference for many color recipes - setup the layering system as that basis.
// Look at the css for how this displays in the browser in the plain html model.
fillColor.withDefault(layerFillFixedBase);

// Simple event handlers to change Design Token values:

document.getElementById("darkMode").onchange = function(event) {
    const checked = (event.target as FASTSwitch).checked;
    console.log("darkMode change", checked);
    // This Design Token causes `layerFillFixedBase` to update.
    // The constants are for convenience, but try changing them to another decimal value between 0 and 1.
    layerFillBaseLuminance.withDefault(checked ? LayerBaseLuminance.DarkMode : LayerBaseLuminance.LightMode);
};

document.getElementById("accentColor").onchange = function(event) {
    const value = (event.target as FASTRadioGroup).value;
    console.log("accentColor change", value);
    // This Design Token causes the accent palette to update, including any components styled with recipes based on that palette.
    accentBaseColor.withDefault("#" + value);
};
