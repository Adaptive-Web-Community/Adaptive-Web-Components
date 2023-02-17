// All components that are used in html must be defined.
import AWC, { AllComponents } from "@adaptive-web/adaptive-web-components";

AWC.defineComponents(AllComponents);
// Uncomment to define the `adaptive-text-field` element.
// import "@adaptive-web/adaptive-web-components/text-field/define";

import { accentBaseColor, fillColor, LayerBaseLuminance, layerFillBaseLuminance, layerFillFixedBase } from "@adaptive-web/adaptive-ui";
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
