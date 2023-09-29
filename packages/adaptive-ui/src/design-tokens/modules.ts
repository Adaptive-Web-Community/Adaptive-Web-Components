import { BorderFill, BorderStyle, BorderThickness, CornerRadius, Fill, Padding, Styles } from "../modules/styles.js";
import { cornerRadiusControl, cornerRadiusLayer, strokeThickness } from "./appearance.js";
import {
    accentFillDiscernible,
    accentFillReadable,
    accentFillStealth,
    accentFillSubtle,
    accentStrokeDiscernible,
    accentStrokeReadable,
    accentStrokeReadableRecipe,
    accentStrokeSafety,
    accentStrokeSubtle,
    blackOrWhiteDiscernibleRecipe,
    blackOrWhiteReadableRecipe,
    criticalFillDiscernible,
    criticalFillReadable,
    criticalFillStealth,
    criticalFillSubtle,
    criticalStrokeDiscernible,
    criticalStrokeReadable,
    criticalStrokeReadableRecipe,
    criticalStrokeSafety,
    criticalStrokeSubtle,
    fillColor,
    highlightFillDiscernible,
    highlightFillReadable,
    highlightFillStealth,
    highlightFillSubtle,
    highlightStrokeDiscernible,
    highlightStrokeReadable,
    highlightStrokeReadableRecipe,
    highlightStrokeSafety,
    highlightStrokeSubtle,
    neutralFillDiscernible,
    neutralFillReadable,
    neutralFillStealth,
    neutralFillSubtle,
    neutralStrokeDiscernible,
    neutralStrokeDiscernibleRest,
    neutralStrokeReadableRest,
    neutralStrokeSafety,
    neutralStrokeStrongRecipe,
    neutralStrokeStrongRest,
    neutralStrokeSubtle,
    neutralStrokeSubtleRest,
} from "./color.js";
import { densityControl, densityItemContainer, densityLayer } from "./density.js";
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
        ...CornerRadius.all(cornerRadiusControl),
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
        ...CornerRadius.all(cornerRadiusLayer),
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
        ...CornerRadius.all("999px"),
    },
    "shape.round",
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
        ...Padding.verticalHorizontal(densityControl.verticalPadding, densityControl.horizontalPadding),
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
        ...Padding.verticalHorizontal(densityControl.verticalPadding, densityControl.verticalPadding),
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
 * Style module for the density and spacing of an item container.
 *
 * By default, sets the padding and gap, useful for buttons, list items, etc.
 *
 * See {@link controlDensityStyles} or {@link autofillOuterDensityStyles}.
 *
 * @public
 */
export const itemContainerDensityStyles: Styles = Styles.fromProperties(
    {
        ...Padding.verticalHorizontal(densityItemContainer.verticalPadding, densityItemContainer.horizontalPadding),
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
        ...Padding.verticalHorizontal(densityLayer.verticalPadding, densityLayer.horizontalPadding),
        gap: densityLayer.horizontalGap,
    },
    "density.layer",
);

/**
 * Style module for the safety border.
 *
 * By default, sets the border thickness and style. The color is set to the safety recipe, which will turn on for increased contrast.
 *
 * @public
 */
export const safetyBorderStyles: Styles = Styles.fromProperties(
    {
        ...BorderThickness.all(strokeThickness),
        ...BorderStyle.all("solid"),
        ...BorderFill.all(neutralStrokeSafety),
    },
    "color.safety-border",
);

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
        ...BorderFill.all(accentStrokeSafety),
    },
    "color.accent-fill-stealth-control",
);

/**
 * Convenience style module for an accent-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - accent subtle background
 * - accent readable foreground (a11y)
 * - accent subtle border
 *
 * @public
 */
export const accentFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(accentFillSubtle, accentStrokeReadableRecipe),
        ...BorderFill.all(accentStrokeSubtle),
    },
    "color.accent-fill-subtle-control",
);

/**
 * Convenience style module for an accent-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - accent discernible background (a11y)
 * - accent discernible foreground
 * - no border
 *
 * @public
 */
export const accentFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(accentFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...BorderFill.all(accentStrokeDiscernible),
        foregroundFill: accentStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.accent-outline-discernible-control",
);

/**
 * Convenience style module for an accent-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a button, link, or similar:
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
        ...BorderFill.all(highlightStrokeSafety),
    },
    "color.highlight-fill-stealth-control",
);

/**
 * Convenience style module for an highlight-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - highlight subtle background
 * - highlight readable foreground (a11y)
 * - highlight subtle border
 *
 * @public
 */
export const highlightFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(highlightFillSubtle, highlightStrokeReadableRecipe),
        ...BorderFill.all(highlightStrokeSubtle),
    },
    "color.highlight-fill-subtle-control",
);

/**
 * Convenience style module for an highlight-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - highlight discernible background (a11y)
 * - highlight discernible foreground
 * - no border
 *
 * @public
 */
export const highlightFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(highlightFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...BorderFill.all(highlightStrokeDiscernible),
        foregroundFill: highlightStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.highlight-outline-discernible-control",
);

/**
 * Convenience style module for an highlight-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a button, link, or similar:
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
        ...BorderFill.all(criticalStrokeSafety),
    },
    "color.critical-fill-stealth-control",
);

/**
 * Convenience style module for an critical-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - critical subtle background
 * - critical readable foreground (a11y)
 * - critical subtle border
 *
 * @public
 */
export const criticalFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(criticalFillSubtle, criticalStrokeReadableRecipe),
        ...BorderFill.all(criticalStrokeSubtle),
    },
    "color.critical-fill-subtle-control",
);

/**
 * Convenience style module for an critical-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - critical discernible background (a11y)
 * - critical discernible foreground
 * - no border
 *
 * @public
 */
export const criticalFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(criticalFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...BorderFill.all(criticalStrokeDiscernible),
        foregroundFill: criticalStrokeReadable,
        backgroundFill: fillColor,
    },
    "color.critical-outline-discernible-control",
);

/**
 * Convenience style module for an critical-colored text or icon control (interactive).
 *
 * By default, the foreground color meets accessibility, useful for a button, link, or similar:
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
        ...BorderFill.all(neutralStrokeSafety),
    },
    "color.neutral-fill-stealth-control",
);

/**
 * Convenience style module for a neutral-filled subtle control (interactive).
 *
 * By default, only the foreground color meets accessibility, useful for a button or similar:
 * - neutral subtle background
 * - neutral strong foreground (a11y)
 * - neutral subtle border
 *
 * @public
 */
export const neutralFillSubtleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForeground(neutralFillSubtle, neutralStrokeStrongRecipe),
        ...BorderFill.all(neutralStrokeSubtle),
    },
    "color.neutral-fill-subtle-control",
);

/**
 * Convenience style module for a neutral-filled discernible control (interactive).
 *
 * By default, the background meets accessibility for non-text elements, useful for a checked checkbox:
 * - neutral discernible background (a11y)
 * - neutral discernible foreground
 * - no border
 *
 * @public
 */
export const neutralFillDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundAndForegroundBySet(neutralFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...BorderFill.all(neutralStrokeDiscernible),
        foregroundFill: neutralStrokeStrongRest,
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
        foregroundFill: neutralStrokeReadableRest,
    },
    "color.neutral-foreground-readable-control",
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
        foregroundFill: neutralStrokeStrongRest,
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
        foregroundFill: neutralStrokeSubtleRest,
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
        foregroundFill: neutralStrokeDiscernibleRest,
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
    "font.type-ramp-base",
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
    "font.type-ramp-minus-1",
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
    "font.type-ramp-minus-2",
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
    "font.type-ramp-plus-1",
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
    "font.type-ramp-plus-2",
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
    "font.type-ramp-plus-3",
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
    "font.type-ramp-plus-4",
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
    "font.type-ramp-plus-5",
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
    "font.type-ramp-plus-6",
);

/**
 * @public
 */
export const actionStyles: Styles = Styles.compose(
    [
        safetyBorderStyles,
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralFillSubtleControlStyles,
    ],
    undefined,
    "styles.action-control",
);

/**
 * @public
 */
export const inputStyles: Styles = Styles.compose(
    [
        safetyBorderStyles,
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralOutlineDiscernibleControlStyles,
    ],
    undefined,
    "styles.input-control",
);

/**
 * @public
 */
export const inputAutofillStyles: Styles = Styles.compose(
    [
        safetyBorderStyles,
        controlShapeStyles,
        autofillOuterDensityStyles,
        typeRampBaseStyles,
        neutralOutlineDiscernibleControlStyles,
    ],
    undefined,
    "styles.input-autofill-control",
);

/**
 * @public
 */
export const selectableSelectedStyles: Styles = Styles.compose(
    [
        safetyBorderStyles,
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
        safetyBorderStyles,
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
        safetyBorderStyles,
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
