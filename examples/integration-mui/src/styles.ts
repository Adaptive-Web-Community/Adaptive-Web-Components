import { css } from "@microsoft/fast-element";
import { Styles } from "@adaptive-web/adaptive-ui";
import { densityLayer, labelFontWeight, layerDensityStyles, layerShapeStyles, plainTextStyles, shadowCardStyles, typeRampPlus1LineHeight, typeRampPlus1Styles } from "@adaptive-web/adaptive-ui/reference";

// Adaptive UI provides many reference styles. Here are some examples of customized reusable styles,
// including some features which are candidates for rolling into the reference offering.

// I'm adding support for flex layout and direction directly into AUI
export const layerContainerHorizontal = Styles.fromDeclaration({
    styles: layerDensityStyles,
    properties: {
        "display": "flex",
    },
});

export const layerContainerVertical = Styles.fromDeclaration({
    styles: layerDensityStyles,
    properties: {
        gap: densityLayer.verticalGap,
        "display": "flex",
        "flex-direction": "column",
    },
});

export const cardStyles = Styles.fromDeclaration({
    styles: [
        layerShapeStyles,
        plainTextStyles,
        shadowCardStyles,
    ],
});

// For instance, this is still overly manual and requires understanding what it takes to clamp to a
// specified number of text lines. Adaptive UI can help here because we could offer a `lineClamp` StyleProperty
// that wraps all of this logic. Also, since it knows which type ramp is applied it can appropriately
// generate the `height` value, which would be easy to get out of sync if done manually.
// I will add this to AUI as well.
export const itemTitleStyles = Styles.fromDeclaration({
    styles: [
        typeRampPlus1Styles,
    ],
    properties: {
        fontWeight: labelFontWeight,
        "display": "-webkit-box",
        "overflow": "hidden",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": "2",
        "height": css.partial`calc(${typeRampPlus1LineHeight} * 2)`,
    },
});
