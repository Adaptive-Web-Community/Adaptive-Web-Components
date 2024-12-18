import { ValuesOf } from "@microsoft/fast-foundation";
import { Fill, Styles, StyleValue } from "../core/modules/styles.js";
import { cornerRadiusControl, cornerRadiusLayer, focusStrokeThickness, strokeThickness } from "./appearance.js";
import {
    accentFillDiscernible,
    accentFillIdeal,
    accentFillReadable,
    accentFillStealth,
    accentFillSubtle,
    accentFillSubtleInverse,
    accentStrokeDiscernible,
    accentStrokeReadable,
    accentStrokeReadableRecipe,
    accentStrokeSafety,
    blackOrWhiteDiscernibleRecipe,
    blackOrWhiteReadableRecipe,
    criticalFillDiscernible,
    criticalFillIdeal,
    criticalFillReadable,
    criticalFillStealth,
    criticalFillSubtle,
    criticalFillSubtleInverse,
    criticalStrokeDiscernible,
    criticalStrokeReadable,
    criticalStrokeReadableRecipe,
    criticalStrokeSafety,
    fillColor,
    focusStroke,
    highlightFillDiscernible,
    highlightFillIdeal,
    highlightFillReadable,
    highlightFillStealth,
    highlightFillSubtle,
    highlightFillSubtleInverse,
    highlightStrokeDiscernible,
    highlightStrokeReadable,
    highlightStrokeReadableRecipe,
    highlightStrokeSafety,
    infoFillDiscernible,
    infoFillIdeal,
    infoFillReadable,
    infoFillStealth,
    infoFillSubtle,
    infoFillSubtleInverse,
    infoStrokeDiscernible,
    infoStrokeReadable,
    infoStrokeReadableRecipe,
    infoStrokeSafety,
    neutralFillDiscernible,
    neutralFillIdeal,
    neutralFillReadable,
    neutralFillStealth,
    neutralFillSubtle,
    neutralFillSubtleInverse,
    neutralStrokeDiscernible,
    neutralStrokeReadable,
    neutralStrokeSafety,
    neutralStrokeStrong,
    neutralStrokeStrongRecipe,
    neutralStrokeSubtle,
    successFillDiscernible,
    successFillIdeal,
    successFillReadable,
    successFillStealth,
    successFillSubtle,
    successFillSubtleInverse,
    successStrokeDiscernible,
    successStrokeReadable,
    successStrokeReadableRecipe,
    successStrokeSafety,
    warningFillDiscernible,
    warningFillIdeal,
    warningFillReadable,
    warningFillStealth,
    warningFillSubtle,
    warningFillSubtleInverse,
    warningStrokeDiscernible,
    warningStrokeReadable,
    warningStrokeReadableRecipe,
    warningStrokeSafety,
} from "./color.js";
import { densityControl, densityControlList, densityItemContainer, densityLayer, densityText } from "./density.js";
import { elevationCardInteractive, elevationCardRest, elevationDialog, elevationFlyout, elevationTooltip } from "./elevation.js";
import { layerFillFixedPlus1 } from "./layer.js";
import {
    fontFamily,
    fontWeight,
    labelFontFamily,
    labelFontStyle,
    labelFontWeight,
    typeRampBaseFontSize,
    typeRampBaseFontVariations,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1FontVariations,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2FontVariations,
    typeRampMinus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1FontVariations,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2FontVariations,
    typeRampPlus2LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3FontVariations,
    typeRampPlus3LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4FontVariations,
    typeRampPlus4LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5FontVariations,
    typeRampPlus5LineHeight,
    typeRampPlus6FontSize,
    typeRampPlus6FontVariations,
    typeRampPlus6LineHeight,
} from "./type.js";

/**
 * Style module for the shape of a control.
 *
 * By default, sets the border radius, useful for buttons, inputs, list items, etc.
 *
 * @public
 */
export const controlShapeStyles: Styles = Styles.fromProperties(
    {
        cornerRadius: cornerRadiusControl,
    },
    "shape.control",
);

/**
 * Style module for the shape of a layer.
 *
 * By default, sets the border radius, useful for card, panes, etc.
 *
 * @public
 */
export const layerShapeStyles: Styles = Styles.fromProperties(
    {
        cornerRadius: cornerRadiusLayer,
    },
    "shape.layer",
);

/**
 * Style module for the shape of a rounded control (pill shape).
 *
 * By default, sets the border radius, useful for badge, radio, etc.
 *
 * @public
 */
export const roundShapeStyles: Styles = Styles.fromProperties(
    {
        cornerRadius: "999px",
    },
    "shape.round",
);

/**
 * Style module for the density and spacing of plain text.
 *
 * By default, sets the padding and gap, useful for label and value pairs or stacked lines of text.
 *
 * @public
 */
export const textDensityStyles: Styles = Styles.fromProperties(
    {
        paddingHorizontal: densityText.horizontalPadding,
        paddingVertical: densityText.verticalPadding,
        gap: densityText.horizontalGap,
    },
    "density.text",
);

/**
 * Style module for the density and spacing of a control.
 *
 * By default, sets the padding and gap, useful for buttons, list items, etc.
 *
 * See {@link autofillOuterDensityStyles} or {@link itemContainerDensityStyles}.
 *
 * @public
 */
export const controlDensityStyles: Styles = Styles.fromProperties(
    {
        paddingHorizontal: densityControl.horizontalPadding,
        paddingVertical: densityControl.verticalPadding,
        gap: densityControl.horizontalGap,
    },
    "density.control",
);

/**
 * Style module for the density and spacing of a *square* control.
 *
 * By default, sets the padding and gap, useful for icon-only buttons or other elements which should be square based on vertical size.
 *
 * See {@link autofillOuterDensityStyles} or {@link itemContainerDensityStyles}.
 *
 * @public
 */
export const controlSquareDensityStyles: Styles = Styles.fromProperties(
    {
        padding: densityControl.verticalPadding,
        gap: densityControl.horizontalGap,
    },
    "density.control-square",
);

/**
 * Style module pair (outer portion) for input controls that support autofill to allow for better handling of platform styling.
 *
 * By default, sets the horizontal padding and gap, useful for the container of wrapped inputs like text field.
 *
 * See {@link autofillInnerDensityStyles}.
 *
 * @public
 */
export const autofillOuterDensityStyles: Styles = Styles.fromProperties(
    {
        paddingTop: "0",
        paddingRight: densityControl.horizontalPadding,
        paddingBottom: "0",
        paddingLeft: densityControl.horizontalPadding,
        gap: densityControl.horizontalGap,
    },
    "density.autofill-outer",
);

/**
 * Style module pair (inner portion) for input controls that support autofill to allow for better handling of platform styling.
 *
 * By default, sets the vertical padding, useful for wrapped inputs like text field.
 *
 * See {@link autofillOuterDensityStyles}.
 *
 * @public
 */
export const autofillInnerDensityStyles: Styles = Styles.fromProperties(
    {
        paddingTop: densityControl.verticalPadding,
        paddingRight: "0",
        paddingBottom: densityControl.verticalPadding,
        paddingLeft: "0",
    },
    "density.autofill-inner",
);

/**
 * Style module for the density and spacing of a list of controls.
 *
 * By default, sets the padding and gap, useful for menus, lists of buttons, etc.
 *
 * @public
 */
export const controlListDensityStyles: Styles = Styles.fromProperties(
    {
        paddingHorizontal: densityControlList.horizontalPadding,
        paddingVertical: densityControlList.verticalPadding,
        gap: densityControlList.horizontalGap,
    },
    "density.control-list",
);

/**
 * Style module for the density and spacing of an item container.
 *
 * By default, sets the padding and gap, useful for buttons, list items, etc.
 *
 * @public
 * @deprecated Use controlListDensityStyles
 */
export const itemContainerDensityStyles: Styles = Styles.fromProperties(
    {
        paddingHorizontal: densityItemContainer.horizontalPadding,
        paddingVertical: densityItemContainer.verticalPadding,
        gap: densityItemContainer.horizontalGap,
    },
    "density.item-container",
);

/**
 * Style module for the density and spacing of a layer.
 *
 * By default, sets the padding and gap, useful for cards, dialogs, etc.
 *
 * @public
 */
export const layerDensityStyles: Styles = Styles.fromProperties(
    {
        paddingHorizontal: densityLayer.horizontalPadding,
        paddingVertical: densityLayer.verticalPadding,
        gap: densityLayer.horizontalGap,
    },
    "density.layer",
);

const transparent = "transparent";

// TODO: There's a bit of an overlap right now where density calculations assume a border thickness,
// but setting the color is done elsewhere or not at all, producing inconsistent and unpredictable styling.
const densityBorderStyles = (fillValue: StyleValue) => {
    return {
        borderThickness: strokeThickness,
        borderStyle: "solid",
        borderFill: fillValue,
    }
};

/**
 * Convenience style module for an accent-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent stealth background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(accentFillStealth, accentStrokeReadableRecipe),
        ...densityBorderStyles(accentStrokeSafety),
    },
    "color.accent-fill-stealth-control",
);

/**
 * Convenience style module for an accent-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent subtle background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(accentFillSubtle, accentStrokeReadableRecipe),
        ...densityBorderStyles(accentStrokeSafety),
    },
    "color.accent-fill-subtle-control",
);

/**
 * Convenience style module for an accent-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent subtle inverse background
 * - accent readable foreground (a11y)
 * - accent safety border
 *
 * @public
 */
export const accentFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(accentFillSubtleInverse, accentStrokeReadableRecipe),
        ...densityBorderStyles(accentStrokeSafety),
    },
    "color.accent-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an accent-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - accent ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(accentFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.accent-fill-ideal-control",
);

/**
 * Convenience style module for an accent-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - accent discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(accentFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.accent-fill-discernible-control",
);

/**
 * Convenience style module for an accent-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - accent readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(accentFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.accent-fill-readable-control",
);

/**
 * Convenience style module for an accent-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - accent readable foreground
 * - accent discernible border
 *
 * @public
 */
export const accentOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(accentStrokeDiscernible),
        foregroundFill: accentStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.accent-outline-discernible-control",
);

/**
 * Convenience style module for an accent-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - accent readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const accentForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: accentStrokeReadable,
    },
    "color.accent-foreground-readable-control",
);

/**
 * Convenience style module for an highlight-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight stealth background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(highlightFillStealth, highlightStrokeReadableRecipe),
        ...densityBorderStyles(highlightStrokeSafety),
    },
    "color.highlight-fill-stealth-control",
);

/**
 * Convenience style module for an highlight-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight subtle background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(highlightFillSubtle, highlightStrokeReadableRecipe),
        ...densityBorderStyles(highlightStrokeSafety),
    },
    "color.highlight-fill-subtle-control",
);

/**
 * Convenience style module for an highlight-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight subtle inverse background
 * - highlight readable foreground (a11y)
 * - highlight safety border
 *
 * @public
 */
export const highlightFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(highlightFillSubtleInverse, highlightStrokeReadableRecipe),
        ...densityBorderStyles(highlightStrokeSafety),
    },
    "color.highlight-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an highlight-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - highlight ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(highlightFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.highlight-fill-ideal-control",
);

/**
 * Convenience style module for an highlight-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - highlight discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(highlightFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.highlight-fill-discernible-control",
);

/**
 * Convenience style module for an highlight-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - highlight readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(highlightFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.highlight-fill-readable-control",
);

/**
 * Convenience style module for an highlight-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - highlight readable foreground
 * - highlight discernible border
 *
 * @public
 */
export const highlightOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(highlightStrokeDiscernible),
        foregroundFill: highlightStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.highlight-outline-discernible-control",
);

/**
 * Convenience style module for an highlight-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - highlight readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const highlightForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: highlightStrokeReadable,
    },
    "color.highlight-foreground-readable-control",
);

/**
 * Convenience style module for an info-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info stealth background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(infoFillStealth, infoStrokeReadableRecipe),
        ...densityBorderStyles(infoStrokeSafety),
    },
    "color.info-fill-stealth-control",
);

/**
 * Convenience style module for an info-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info subtle background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(infoFillSubtle, infoStrokeReadableRecipe),
        ...densityBorderStyles(infoStrokeSafety),
    },
    "color.info-fill-subtle-control",
);

/**
 * Convenience style module for an info-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - info subtle inverse background
 * - info readable foreground (a11y)
 * - info safety border
 *
 * @public
 */
export const infoFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(infoFillSubtleInverse, infoStrokeReadableRecipe),
        ...densityBorderStyles(infoStrokeSafety),
    },
    "color.info-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an info-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - info ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(infoFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.info-fill-ideal-control",
);

/**
 * Convenience style module for an info-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - info discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(infoFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.info-fill-discernible-control",
);

/**
 * Convenience style module for an info-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - info readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(infoFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.info-fill-readable-control",
);

/**
 * Convenience style module for an info-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - info readable foreground
 * - info discernible border
 *
 * @public
 */
export const infoOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(infoStrokeDiscernible),
        foregroundFill: infoStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.info-outline-discernible-control",
);

/**
 * Convenience style module for an info-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - info readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const infoForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: infoStrokeReadable,
    },
    "color.info-foreground-readable-control",
);

/**
 * Convenience style module for an success-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success stealth background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(successFillStealth, successStrokeReadableRecipe),
        ...densityBorderStyles(successStrokeSafety),
    },
    "color.success-fill-stealth-control",
);

/**
 * Convenience style module for an success-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success subtle background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(successFillSubtle, successStrokeReadableRecipe),
        ...densityBorderStyles(successStrokeSafety),
    },
    "color.success-fill-subtle-control",
);

/**
 * Convenience style module for an success-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - success subtle inverse background
 * - success readable foreground (a11y)
 * - success safety border
 *
 * @public
 */
export const successFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(successFillSubtleInverse, successStrokeReadableRecipe),
        ...densityBorderStyles(successStrokeSafety),
    },
    "color.success-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an success-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - success ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(successFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.success-fill-ideal-control",
);

/**
 * Convenience style module for an success-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - success discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(successFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.success-fill-discernible-control",
);

/**
 * Convenience style module for an success-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - success readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const successFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(successFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.success-fill-readable-control",
);

/**
 * Convenience style module for an success-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - success readable foreground
 * - success discernible border
 *
 * @public
 */
export const successOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(successStrokeDiscernible),
        foregroundFill: successStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.success-outline-discernible-control",
);

/**
 * Convenience style module for an success-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - success readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const successForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: successStrokeReadable,
    },
    "color.success-foreground-readable-control",
);

/**
 * Convenience style module for an warning-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning stealth background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(warningFillStealth, warningStrokeReadableRecipe),
        ...densityBorderStyles(warningStrokeSafety),
    },
    "color.warning-fill-stealth-control",
);

/**
 * Convenience style module for an warning-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning subtle background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(warningFillSubtle, warningStrokeReadableRecipe),
        ...densityBorderStyles(warningStrokeSafety),
    },
    "color.warning-fill-subtle-control",
);

/**
 * Convenience style module for an warning-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - warning subtle inverse background
 * - warning readable foreground (a11y)
 * - warning safety border
 *
 * @public
 */
export const warningFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(warningFillSubtleInverse, warningStrokeReadableRecipe),
        ...densityBorderStyles(warningStrokeSafety),
    },
    "color.warning-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an warning-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - warning ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(warningFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.warning-fill-ideal-control",
);

/**
 * Convenience style module for an warning-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - warning discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(warningFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.warning-fill-discernible-control",
);

/**
 * Convenience style module for an warning-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - warning readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(warningFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.warning-fill-readable-control",
);

/**
 * Convenience style module for an warning-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - warning readable foreground
 * - warning discernible border
 *
 * @public
 */
export const warningOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(warningStrokeDiscernible),
        foregroundFill: warningStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.warning-outline-discernible-control",
);

/**
 * Convenience style module for an warning-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - warning readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const warningForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: warningStrokeReadable,
    },
    "color.warning-foreground-readable-control",
);

/**
 * Convenience style module for an critical-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical stealth background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(criticalFillStealth, criticalStrokeReadableRecipe),
        ...densityBorderStyles(criticalStrokeSafety),
    },
    "color.critical-fill-stealth-control",
);

/**
 * Convenience style module for an critical-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical subtle background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(criticalFillSubtle, criticalStrokeReadableRecipe),
        ...densityBorderStyles(criticalStrokeSafety),
    },
    "color.critical-fill-subtle-control",
);

/**
 * Convenience style module for an critical-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical subtle inverse background
 * - critical readable foreground (a11y)
 * - critical safety border
 *
 * @public
 */
export const criticalFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(criticalFillSubtleInverse, criticalStrokeReadableRecipe),
        ...densityBorderStyles(criticalStrokeSafety),
    },
    "color.critical-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an critical-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - critical ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(criticalFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.critical-fill-ideal-control",
);

/**
 * Convenience style module for an critical-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - critical discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(criticalFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.critical-fill-discernible-control",
);

/**
 * Convenience style module for an critical-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - critical readable background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(criticalFillReadable, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.critical-fill-readable-control",
);

/**
 * Convenience style module for an critical-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - critical readable foreground
 * - critical discernible border
 *
 * @public
 */
export const criticalOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(criticalStrokeDiscernible),
        foregroundFill: criticalStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.critical-outline-discernible-control",
);

/**
 * Convenience style module for an critical-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a link, or similar:
 * - no background
 * - critical readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const criticalForegroundReadableControlStyles: Styles = Styles.fromProperties(
    {
        foregroundFill: criticalStrokeReadable,
    },
    "color.critical-foreground-readable-control",
);

/**
 * Convenience style module for a neutral-filled stealth control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral stealth background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillStealthControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(neutralFillStealth, neutralStrokeStrongRecipe),
        ...densityBorderStyles(neutralStrokeSafety),
    },
    "color.neutral-fill-stealth-control",
);

/**
 * Convenience style module for a neutral-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral subtle background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(neutralFillSubtle, neutralStrokeStrongRecipe),
        ...densityBorderStyles(neutralStrokeSafety),
    },
    "color.neutral-fill-subtle-control",
);

/**
 * Convenience style module for a neutral-filled subtle inverse control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral subtle inverse background
 * - neutral strong foreground (a11y)
 * - neutral safety border
 *
 * @public
 */
export const neutralFillSubtleInverseControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(neutralFillSubtleInverse, neutralStrokeStrongRecipe),
        ...densityBorderStyles(neutralStrokeSafety),
    },
    "color.neutral-fill-subtle-inverse-control",
);

/**
 * Convenience style module for an neutral-filled ideal control (interactive).
 *
 * By default, the background meets a non-WCAG contrast that minimally stands out, useful for a filled button:
 * - neutral ideal background
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillIdealControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(neutralFillIdeal, blackOrWhiteReadableRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.neutral-fill-ideal-control",
);

/**
 * Convenience style module for a neutral-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - neutral discernible background (a11y)
 * - black or white foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(neutralFillDiscernible, blackOrWhiteDiscernibleRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.neutral-fill-discernible-control",
);

/**
 * Convenience style module for a neutral-filled readable control (interactive).
 *
 * By default, the fill meets accessibility for text elements, producing an inverted foreground, useful for a button or similar:
 * - neutral readable background
 * - neutral strong foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralFillReadableControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(neutralFillReadable, neutralStrokeStrongRecipe),
        ...densityBorderStyles(transparent),
    },
    "color.neutral-fill-readable-control",
);

/**
 * Convenience style module for a neutral-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - fill color background
 * - neutral strong foreground
 * - neutral discernible border
 *
 * @public
 */
export const neutralOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...densityBorderStyles(neutralStrokeDiscernible),
        ...Fill.foregroundNonInteractiveWithDisabled(neutralStrokeStrong.rest, neutralStrokeStrong.disabled),
        backgroundFill: fillColor,
    },
    "color.neutral-outline-discernible-control",
);

/**
 * Convenience style module for neutral-colored hint or placeholder text or icons (not interactive).
 *
 * By default, the foreground color meets accessibility, useful for hint, placeholder, or secondary text:
 * - no background
 * - neutral readable foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralForegroundReadableElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.foregroundNonInteractiveWithDisabled(neutralStrokeReadable.rest, neutralStrokeStrong.disabled),
    },
    "color.neutral-foreground-readable-element",
);

/**
 * Convenience style module for neutral-colored regular text or icons (not interactive).
 *
 * By default, the foreground color meets accessibility, useful for regular text:
 * - no background
 * - neutral strong foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralForegroundStrongElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.foregroundNonInteractiveWithDisabled(neutralStrokeStrong.rest, neutralStrokeStrong.disabled),
    },
    "color.neutral-foreground-strong-element",
);

/**
 * Convenience style module for neutral-colored divider for presentation role.
 *
 * By default, the foreground color does not meet accessibility, useful for presentation only:
 * - no background
 * - neutral subtle foreground
 * - no border
 *
 * @public
 */
export const neutralDividerSubtleElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.foregroundNonInteractiveWithDisabled(neutralStrokeSubtle.rest, neutralStrokeStrong.disabled),
    },
    "color.neutral-divider-subtle-element",
);

/**
 * Convenience style module for neutral-colored divider for separator role.
 *
 * By default, the foreground color meets accessibility, useful for semantic separation:
 * - no background
 * - neutral discernible foreground (a11y)
 * - no border
 *
 * @public
 */
export const neutralDividerDiscernibleElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.foregroundNonInteractiveWithDisabled(neutralStrokeDiscernible.rest, neutralStrokeStrong.disabled),
    },
    "color.neutral-divider-discernible-element",
);

/**
 * Convenience style module combining all font values for the `base` type ramp.
 *
 * @public
 */
export const typeRampBaseStyles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampBaseFontSize,
        lineHeight: typeRampBaseLineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampBaseFontVariations,
    },
    "text.type-ramp-base",
);

/**
 * Convenience style module combining all font values for the `minus 1` type ramp.
 *
 * @public
 */
export const typeRampMinus1Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampMinus1FontSize,
        lineHeight: typeRampMinus1LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampMinus1FontVariations,
    },
    "text.type-ramp-minus-1",
);

/**
 * Convenience style module combining all font values for the `minus 2` type ramp.
 *
 * @public
 */
export const typeRampMinus2Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampMinus2FontSize,
        lineHeight: typeRampMinus2LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampMinus2FontVariations,
    },
    "text.type-ramp-minus-2",
);

/**
 * Convenience style module combining all font values for the `plus 1` type ramp.
 *
 * @public
 */
export const typeRampPlus1Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus1FontSize,
        lineHeight: typeRampPlus1LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus1FontVariations,
    },
    "text.type-ramp-plus-1",
);

/**
 * Convenience style module combining all font values for the `plus 2` type ramp.
 *
 * @public
 */
export const typeRampPlus2Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus2FontSize,
        lineHeight: typeRampPlus2LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus2FontVariations,
    },
    "text.type-ramp-plus-2",
);

/**
 * Convenience style module combining all font values for the `plus 3` type ramp.
 *
 * @public
 */
export const typeRampPlus3Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus3FontSize,
        lineHeight: typeRampPlus3LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus3FontVariations,
    },
    "text.type-ramp-plus-3",
);

/**
 * Convenience style module combining all font values for the `plus 4` type ramp.
 *
 * @public
 */
export const typeRampPlus4Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus4FontSize,
        lineHeight: typeRampPlus4LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus4FontVariations,
    },
    "text.type-ramp-plus-4",
);

/**
 * Convenience style module combining all font values for the `plus 5` type ramp.
 *
 * @public
 */
export const typeRampPlus5Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus5FontSize,
        lineHeight: typeRampPlus5LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus5FontVariations,
    },
    "text.type-ramp-plus-5",
);

/**
 * Convenience style module combining all font values for the `plus 6` type ramp.
 *
 * @public
 */
export const typeRampPlus6Styles: Styles = Styles.fromProperties(
    {
        fontFamily: fontFamily,
        fontSize: typeRampPlus6FontSize,
        lineHeight: typeRampPlus6LineHeight,
        fontWeight: fontWeight,
        fontVariationSettings: typeRampPlus6FontVariations,
    },
    "text.type-ramp-plus-6",
);

/**
 * @public
 */
export const shadowCardStyles: Styles = Styles.fromProperties(
    {
        shadow: elevationCardRest,
    },
    "shadow.card",
);

/**
 * @public
 */
export const shadowCardInteractiveStyles: Styles = Styles.fromProperties(
    {
        shadow: elevationCardInteractive,
    },
    "shadow.card-interactive",
);

/**
 * @public
 */
export const shadowTooltipStyles: Styles = Styles.fromProperties(
    {
        shadow: elevationTooltip,
    },
    "shadow.tooltip",
);

/**
 * @public
 */
export const shadowFlyoutStyles: Styles = Styles.fromProperties(
    {
        shadow: elevationFlyout,
    },
    "shadow.flyout",
);

/**
 * @public
 */
export const shadowDialogStyles: Styles = Styles.fromProperties(
    {
        shadow: elevationDialog,
    },
    "shadow.dialog",
);

/**
 * @public
 */
export const actionStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralFillSubtleControlStyles,
    ],
    {
        ...densityBorderStyles(neutralStrokeSubtle),
    },
    "styles.action-control",
);

/**
 * @public
 */
export const inputBaseStyles = Styles.compose(
    [
        controlShapeStyles,
        typeRampBaseStyles,
        neutralFillSubtleInverseControlStyles,
    ],
    {
        ...densityBorderStyles(neutralStrokeDiscernible),
    },
    "styles.input-base",
);

/**
 * @public
 */
export const inputStyles: Styles = Styles.compose(
    [
        inputBaseStyles,
        controlDensityStyles,
    ],
    undefined,
    "styles.input-control",
);

/**
 * @public
 */
export const inputAutofillStyles: Styles = Styles.compose(
    [
        inputBaseStyles,
        autofillOuterDensityStyles,
    ],
    undefined,
    "styles.input-autofill-control",
);

/**
 * @public
 */
export const selectableSelectedStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        typeRampBaseStyles,
        highlightFillReadableControlStyles,
    ],
    undefined,
    "styles.selectable-control-selected",
);

/**
 * @public
 */
export const selectableUnselectedStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        typeRampBaseStyles,
        neutralOutlineDiscernibleControlStyles,
    ],
    undefined,
    "styles.selectable-control-unselected",
);

/**
 * @public
 */
export const itemStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralFillStealthControlStyles,
    ],
    undefined,
    "styles.item-control",
);

/**
 * @public
 */
export const plainTextStyles: Styles = Styles.compose(
    [
        typeRampBaseStyles,
        neutralForegroundStrongElementStyles,
    ],
    undefined,
    "styles.text-plain",
);

/**
 * @public
 */
export const labelTextStyles: Styles = Styles.compose(
    [
        typeRampBaseStyles,
        neutralForegroundStrongElementStyles,
    ],
    {
        fontFamily: labelFontFamily,
        fontStyle: labelFontStyle,
        fontWeight: labelFontWeight,
    },
    "styles.text-label",
);

/**
 * @public
 */
export const flyoutStyles: Styles = Styles.compose(
    [
        layerShapeStyles,
        shadowFlyoutStyles,
    ], {
        backgroundFill: layerFillFixedPlus1,
    },
    "styles.flyout",
);

/**
 * Style module for the disabled state.
 *
 * By default, sets the cursor to "not-allowed".
 *
 * @public
 */
export const disabledStyles: Styles = Styles.fromProperties(
    {
        cursor: "not-allowed",
    },
    "styles.disabled",
);

/**
 * @public
 */
export const focusIndicatorStyles: Styles = Styles.fromProperties(
    {
        outlineColor: focusStroke,
        outlineOffset: "1px",
        outlineStyle: "solid",
        outlineThickness: focusStrokeThickness,
    },
    "styles.focus-indicator",
);

/**
 * @public
 */
export const focusResetStyles: Styles = Styles.fromProperties(
    {
        outlineStyle: "none",
    },
    "styles.focus-reset",
);

/**
 * A mapping of reference style names to variable names.
 *
 * HACK: The full realization of design-to-code relies on generation of the styles _and_ the application to component parts.
 * This is a temporary backfill because the current variable names are not predictable, but this is cleaner in the generated
 * code than looking them up based by name.
 *
 * @beta
 */
export const StyleNameMapping = {
    "shape.control": "controlShapeStyles",
    "shape.layer": "layerShapeStyles",
    "shape.round": "roundShapeStyles",
    "density.control": "controlDensityStyles",
    "density.control-square": "controlSquareDensityStyles",
    "density.autofill-outer": "autofillOuterDensityStyles",
    "density.autofill-inner": "autofillInnerDensityStyles",
    "density.item-container": "itemContainerDensityStyles",
    "density.layer": "layerDensityStyles",
    "color.accent-fill-stealth-control": "accentFillStealthControlStyles",
    "color.accent-fill-subtle-control": "accentFillSubtleControlStyles",
    "color.accent-fill-subtle-inverse-control": "accentFillSubtleInverseControlStyles",
    "color.accent-fill-ideal-control": "accentFillIdealControlStyles",
    "color.accent-fill-discernible-control": "accentFillDiscernibleControlStyles",
    "color.accent-fill-readable-control": "accentFillReadableControlStyles",
    "color.accent-outline-discernible-control": "accentOutlineDiscernibleControlStyles",
    "color.accent-foreground-readable-control": "accentForegroundReadableControlStyles",
    "color.highlight-fill-stealth-control": "highlightFillStealthControlStyles",
    "color.highlight-fill-subtle-control": "highlightFillSubtleControlStyles",
    "color.highlight-fill-subtle-inverse-control": "highlightFillSubtleInverseControlStyles",
    "color.highlight-fill-ideal-control": "highlightFillIdealControlStyles",
    "color.highlight-fill-discernible-control": "highlightFillDiscernibleControlStyles",
    "color.highlight-fill-readable-control": "highlightFillReadableControlStyles",
    "color.highlight-outline-discernible-control": "highlightOutlineDiscernibleControlStyles",
    "color.highlight-foreground-readable-control": "highlightForegroundReadableControlStyles",
    "color.info-fill-stealth-control": "infoFillStealthControlStyles",
    "color.info-fill-subtle-control": "infoFillSubtleControlStyles",
    "color.info-fill-subtle-inverse-control": "infoFillSubtleInverseControlStyles",
    "color.info-fill-ideal-control": "infoFillIdealControlStyles",
    "color.info-fill-discernible-control": "infoFillDiscernibleControlStyles",
    "color.info-fill-readable-control": "infoFillReadableControlStyles",
    "color.info-outline-discernible-control": "infoOutlineDiscernibleControlStyles",
    "color.info-foreground-readable-control": "infoForegroundReadableControlStyles",
    "color.success-fill-stealth-control": "successFillStealthControlStyles",
    "color.success-fill-subtle-control": "successFillSubtleControlStyles",
    "color.success-fill-subtle-inverse-control": "successFillSubtleInverseControlStyles",
    "color.success-fill-ideal-control": "successFillIdealControlStyles",
    "color.success-fill-discernible-control": "successFillDiscernibleControlStyles",
    "color.success-fill-readable-control": "successFillReadableControlStyles",
    "color.success-outline-discernible-control": "successOutlineDiscernibleControlStyles",
    "color.success-foreground-readable-control": "successForegroundReadableControlStyles",
    "color.warning-fill-stealth-control": "warningFillStealthControlStyles",
    "color.warning-fill-subtle-control": "warningFillSubtleControlStyles",
    "color.warning-fill-subtle-inverse-control": "warningFillSubtleInverseControlStyles",
    "color.warning-fill-ideal-control": "warningFillIdealControlStyles",
    "color.warning-fill-discernible-control": "warningFillDiscernibleControlStyles",
    "color.warning-fill-readable-control": "warningFillReadableControlStyles",
    "color.warning-outline-discernible-control": "warningOutlineDiscernibleControlStyles",
    "color.warning-foreground-readable-control": "warningForegroundReadableControlStyles",
    "color.critical-fill-stealth-control": "criticalFillStealthControlStyles",
    "color.critical-fill-subtle-control": "criticalFillSubtleControlStyles",
    "color.critical-fill-subtle-inverse-control": "criticalFillSubtleInverseControlStyles",
    "color.critical-fill-ideal-control": "criticalFillIdealControlStyles",
    "color.critical-fill-discernible-control": "criticalFillDiscernibleControlStyles",
    "color.critical-fill-readable-control": "criticalFillReadableControlStyles",
    "color.critical-outline-discernible-control": "criticalOutlineDiscernibleControlStyles",
    "color.critical-foreground-readable-control": "criticalForegroundReadableControlStyles",
    "color.neutral-fill-stealth-control": "neutralFillStealthControlStyles",
    "color.neutral-fill-subtle-control": "neutralFillSubtleControlStyles",
    "color.neutral-fill-subtle-inverse-control": "neutralFillSubtleInverseControlStyles",
    "color.neutral-fill-ideal-control": "neutralFillIdealControlStyles",
    "color.neutral-fill-discernible-control": "neutralFillDiscernibleControlStyles",
    "color.neutral-fill-readable-control": "neutralFillReadableControlStyles",
    "color.neutral-outline-discernible-control": "neutralOutlineDiscernibleControlStyles",
    "color.neutral-foreground-readable-element": "neutralForegroundReadableElementStyles",
    "color.neutral-foreground-strong-element": "neutralForegroundStrongElementStyles",
    "color.neutral-divider-subtle-element": "neutralDividerSubtleElementStyles",
    "color.neutral-divider-discernible-element": "neutralDividerDiscernibleElementStyles",
    "text.type-ramp-base": "typeRampBaseStyles",
    "text.type-ramp-minus-1": "typeRampMinus1Styles",
    "text.type-ramp-minus-2": "typeRampMinus2Styles",
    "text.type-ramp-plus-1": "typeRampPlus1Styles",
    "text.type-ramp-plus-2": "typeRampPlus2Styles",
    "text.type-ramp-plus-3": "typeRampPlus3Styles",
    "text.type-ramp-plus-4": "typeRampPlus4Styles",
    "text.type-ramp-plus-5": "typeRampPlus5Styles",
    "text.type-ramp-plus-6": "typeRampPlus6Styles",
    "shadow.card": "shadowCardStyles",
    "shadow.card-interactive": "shadowCardInteractiveStyles",
    "shadow.tooltip": "shadowTooltipStyles",
    "shadow.flyout": "shadowFlyoutStyles",
    "shadow.dialog": "shadowDialogStyles",
    "styles.action-control": "actionStyles",
    "styles.input-base": "inputBaseStyles",
    "styles.input-control": "inputStyles",
    "styles.input-autofill-control": "inputAutofillStyles",
    "styles.selectable-control-selected": "selectableSelectedStyles",
    "styles.selectable-control-unselected": "selectableUnselectedStyles",
    "styles.item-control": "itemStyles",
    "styles.text-plain": "plainTextStyles",
    "styles.text-label": "labelTextStyles",
    "styles.flyout": "flyoutStyles",
    "styles.disabled": "disabledStyles",
    "styles.focus-indicator": "focusIndicatorStyles",
    "styles.focus-reset": "focusResetStyles",
};

export type StyleNameMapping = ValuesOf<typeof StyleNameMapping>;
