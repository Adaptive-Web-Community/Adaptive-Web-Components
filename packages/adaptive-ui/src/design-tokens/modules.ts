import { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet, InteractiveSwatchSet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import type { InteractiveSet, InteractiveTokenGroup } from "../types.js";
import { BorderFill, BorderStyle, BorderThickness, CornerRadius, Padding, StyleProperties, Styles } from "../modules/styles.js";
import { TypedCSSDesignToken } from "../adaptive-design-tokens.js";
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
import { createNonCss, createTokenSwatch } from "./create.js";
import { densityControl, densityItemContainer } from "./density.js";
import {
    fontFamily,
    fontWeight,
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
 * Creates a set of foreground tokens applied over the background tokens.
 *
 * @param foregroundRecipe - The recipe for the foreground
 * @param foregroundState - The state from the foreground recipe, typically "rest"
 * @param background - The recipe for the background
 * @returns A token set representing the foreground over the background.
 * 
 * @public
 */
export const createForegroundSet = (
    foregroundRecipe: DesignToken<InteractiveColorRecipe>,
    foregroundState: keyof InteractiveSet<any>,
    background: InteractiveTokenGroup<Swatch>,
): InteractiveTokenGroup<Swatch> => {
    const foregroundBaseName = `${foregroundRecipe.name.replace("-recipe", "")}-${foregroundState}`;
    const backgroundBaseName = background.rest.name.replace("-rest", "");
    const setName = `${foregroundBaseName}-on-${backgroundBaseName}`;

    function createState(
        state: keyof InteractiveSet<any>,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(foregroundRecipe).evaluate(resolve, {
                    reference: resolve(background[state])
                })[foregroundState]
        );
    }

    return {
        name: setName,
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}

function createForegroundSetBySet(
    foregroundRecipe: DesignToken<InteractiveColorRecipeBySet>,
    background: InteractiveTokenGroup<Swatch>,
): InteractiveTokenGroup<Swatch> {
    const foregroundBaseName = foregroundRecipe.name.replace("-recipe", "");
    const backgroundBaseName = background.rest.name.replace("-rest", "");
    const setName = `${foregroundBaseName}-on-${backgroundBaseName}`;

    const set = createNonCss<InteractiveSwatchSet>(`${setName}-value`).withDefault(
        (resolve: DesignTokenResolver) =>
            {
                const backgroundSet: InteractiveSwatchSet = {
                    rest: resolve(background.rest),
                    hover: resolve(background.hover),
                    active: resolve(background.active),
                    focus: resolve(background.focus),
                }
                return resolve(foregroundRecipe).evaluate(resolve, backgroundSet);
            }
    );

    function createState(
        state: keyof InteractiveSet<any>,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(set)[state]
        );
    }

    return {
        name: setName,
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}

function backgroundAndForeground(
    background: InteractiveTokenGroup<Swatch>,
    foregroundRecipe: DesignToken<InteractiveColorRecipe>
): StyleProperties {
    return {
        backgroundFill: background,
        foregroundFill: createForegroundSet(foregroundRecipe, "rest",  background),
    };
}

function backgroundAndForegroundBySet(
    background: InteractiveTokenGroup<Swatch>,
    foregroundRecipe: DesignToken<InteractiveColorRecipeBySet>
): StyleProperties {
    return {
        backgroundFill: background,
        foregroundFill: createForegroundSetBySet(foregroundRecipe,  background),
    };
}

/**
 * Style module for the shape of a control.
 *
 * By default, sets the border radius, thickness, and style, useful for buttons, inputs, list items, etc.
 *
 * @public
 */
export const controlShapeStyles: Styles = Styles.fromProperties(
    {
        ...BorderThickness.all(strokeThickness),
        ...BorderStyle.all("solid"),
        ...BorderFill.all("transparent"),
        ...CornerRadius.all(cornerRadiusControl),
    },
    "shape.control",
);

/**
 * Style module for the shape of a layer.
 *
 * By default, sets the border radius, thickness, and style, useful for card, panes, etc.
 *
 * @public
 */
export const layerShapeStyles: Styles = Styles.fromProperties(
    {
        ...BorderThickness.all(strokeThickness),
        ...BorderStyle.all("solid"),
        ...BorderFill.all("transparent"),
        ...CornerRadius.all(cornerRadiusLayer),
    },
    "shape.layer",
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
        ...backgroundAndForeground(accentFillStealth, accentStrokeReadableRecipe),
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
        ...backgroundAndForeground(accentFillSubtle, accentStrokeReadableRecipe),
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
        ...backgroundAndForegroundBySet(accentFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...backgroundAndForegroundBySet(accentFillReadable, blackOrWhiteReadableRecipe),
    },
    "color.accent-fill-readable-control",
);

/**
 * Convenience style module for an accent-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - no background
 * - accent readable foreground
 * - accent discernible border
 *
 * @public
 */
export const accentOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...BorderFill.all(accentStrokeDiscernible),
        foregroundFill: accentStrokeReadable,
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
        ...backgroundAndForeground(neutralFillStealth, neutralStrokeStrongRecipe),
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
        ...backgroundAndForeground(neutralFillSubtle, neutralStrokeStrongRecipe),
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
        ...backgroundAndForegroundBySet(neutralFillDiscernible, blackOrWhiteDiscernibleRecipe),
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
        ...backgroundAndForeground(neutralFillReadable, neutralStrokeStrongRecipe),
    },
    "color.neutral-fill-readable-control",
);

/**
 * Convenience style module for a neutral-outlined discernible control (interactive).
 *
 * By default, the outline meets accessibility for non-text elements, useful for an unchecked checkbox:
 * - no background
 * - neutral strong foreground
 * - neutral discernible border
 *
 * @public
 */
export const neutralOutlineDiscernibleControlStyles: Styles = Styles.fromProperties(
    {
        ...BorderFill.all(neutralStrokeDiscernible),
        foregroundFill: neutralStrokeStrongRest,
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
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralFillSubtleControlStyles
    ],
    undefined,
    "styles.action-control",
);

/**
 * @public
 */
export const inputStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        controlDensityStyles,
        typeRampBaseStyles,
        neutralOutlineDiscernibleControlStyles
    ],
    undefined,
    "styles.input-control",
);

/**
 * @public
 */
export const inputAutofillStyles: Styles = Styles.compose(
    [
        controlShapeStyles,
        autofillOuterDensityStyles,
        typeRampBaseStyles,
        neutralOutlineDiscernibleControlStyles
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
        accentFillReadableControlStyles
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
        neutralOutlineDiscernibleControlStyles
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
        neutralFillStealthControlStyles
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
        neutralForegroundStrongElementStyles
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
        neutralForegroundStrongElementStyles
    ],
    undefined,
    "styles.text-label",
);
