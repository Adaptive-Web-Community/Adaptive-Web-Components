// All components that are used in html need to be defined.
import "@adaptive-web/adaptive-web-components/avatar/define";
import "@adaptive-web/adaptive-web-components/button/define";
import "@adaptive-web/adaptive-web-components/card/define";
import "@adaptive-web/adaptive-web-components/radio/define";
import "@adaptive-web/adaptive-web-components/radio-group/define";
import "@adaptive-web/adaptive-web-components/switch/define";
// Uncomment to define `adaptive-text-field`.
// import "@adaptive-web/adaptive-web-components/text-field/define";

import { accentBaseColor, fillColor, LayerBaseLuminance, layerFillBaseLuminance, layerFillFixedBase } from "@adaptive-web/adaptive-ui";
import { DesignToken, FASTSwitch } from "@microsoft/fast-foundation";

// This must be called during initialization for the design tokens to be setup so the component styling is applied.
DesignToken.registerDefaultStyleTarget();

fillColor.withDefault(layerFillFixedBase);

// Simple event handlers to change design token values
document.getElementById("darkMode").onchange = function(event) {
    const checked = (event.target as FASTSwitch).checked;
    console.log("darkMode onchange", checked);
    // The constants are for convenience, but try changing them to another decimal value between 0 and 1.
    layerFillBaseLuminance.withDefault(checked ? LayerBaseLuminance.DarkMode : LayerBaseLuminance.LightMode);
};

document.getElementById("accentColor").onchange = function(event) {
    const value = (event.target as FASTSwitch).value;
    console.log("accentColor onchange", value);
    accentBaseColor.withDefault("#" + value);
};
