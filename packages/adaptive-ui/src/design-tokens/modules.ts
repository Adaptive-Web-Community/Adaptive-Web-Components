import { CSSDesignToken, DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet, InteractiveSwatchSet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import type { InteractiveSet, InteractiveTokenSet } from "../types.js";
import { StyleProperties, Styles } from "../modules/styles.js";
import {
    accentFillDiscernibleInteractiveSet,
    accentFillReadableInteractiveSet,
    accentFillStealthInteractiveSet,
    accentFillSubtleInteractiveSet,
    accentStrokeDiscernibleInteractiveSet,
    accentStrokeReadableInteractiveSet,
    accentStrokeReadableRecipe,
    accentStrokeSafetyInteractiveSet,
    accentStrokeSubtleInteractiveSet,
    blackOrWhiteDiscernibleRecipe,
    blackOrWhiteReadableRecipe,
    neutralFillDiscernibleInteractiveSet,
    neutralFillReadableInteractiveSet,
    neutralFillStealthInteractiveSet,
    neutralFillSubtleInteractiveSet,
    neutralStrokeDiscernibleInteractiveSet,
    neutralStrokeDiscernibleRest,
    neutralStrokeReadableRest,
    neutralStrokeSafetyInteractiveSet,
    neutralStrokeStrongInteractiveSet,
    neutralStrokeStrongRecipe,
    neutralStrokeStrongRest,
    neutralStrokeSubtleInteractiveSet,
    neutralStrokeSubtleRest,
} from "./color.js";
import { createNonCss } from "./create.js";
import {
    bodyFont,
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
    background: InteractiveTokenSet<Swatch>,
): InteractiveTokenSet<Swatch> => {
    const foregroundBaseName = `${foregroundRecipe.name.replace("-recipe", "")}-${foregroundState}`;
    const backgroundBaseName = background.rest.name.replace("-rest", "");
    const setName = `${foregroundBaseName}-on-${backgroundBaseName}`;

    function createState(
        state: keyof InteractiveSet<any>,
    ): CSSDesignToken<Swatch> {
        return DesignToken.create<Swatch>(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(foregroundRecipe).evaluate(resolve, resolve(background[state]))[foregroundState]
        );
    }

    return {
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}

function createForegroundSetBySet(
    foregroundRecipe: DesignToken<InteractiveColorRecipeBySet>,
    background: InteractiveTokenSet<Swatch>,
): InteractiveTokenSet<Swatch> {
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
    ): CSSDesignToken<Swatch> {
        return DesignToken.create<Swatch>(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(set)[state]
        );
    }

    return {
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}

function backgroundAndForeground(
    background: InteractiveTokenSet<Swatch>,
    foregroundRecipe: DesignToken<InteractiveColorRecipe>
): StyleProperties {
    return {
        backgroundFill: background,
        foregroundFill: createForegroundSet(foregroundRecipe, "rest",  background),
    };
}

function backgroundAndForegroundBySet(
    background: InteractiveTokenSet<Swatch>,
    foregroundRecipe: DesignToken<InteractiveColorRecipeBySet>
): StyleProperties {
    return {
        backgroundFill: background,
        foregroundFill: createForegroundSetBySet(foregroundRecipe,  background),
    };
}

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
export const accentFillStealthControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForeground(accentFillStealthInteractiveSet, accentStrokeReadableRecipe),
    borderFill: accentStrokeSafetyInteractiveSet,
});

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
export const accentFillSubtleControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForeground(accentFillSubtleInteractiveSet, accentStrokeReadableRecipe),
    borderFill: accentStrokeSubtleInteractiveSet,
});

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
export const accentFillDiscernibleControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForegroundBySet(accentFillDiscernibleInteractiveSet, blackOrWhiteDiscernibleRecipe),
    borderFill: "transparent", // TODO Remove "transparent" borders, this is a hack for the Explorer app.
});

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
export const accentFillReadableControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForegroundBySet(accentFillReadableInteractiveSet, blackOrWhiteReadableRecipe),
    borderFill: "transparent",
});

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
export const accentOutlineDiscernibleControlStyles: Styles = Styles.fromProperties({
    borderFill: accentStrokeDiscernibleInteractiveSet,
    foregroundFill: accentStrokeReadableInteractiveSet,
});

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
export const accentForegroundReadableControlStyles: Styles = Styles.fromProperties({
    borderFill: "transparent",
    foregroundFill: accentStrokeReadableInteractiveSet,
});

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
export const neutralFillStealthControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForeground(neutralFillStealthInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: neutralStrokeSafetyInteractiveSet,
});

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
export const neutralFillSubtleControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForeground(neutralFillSubtleInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: neutralStrokeSubtleInteractiveSet,
});

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
export const neutralFillDiscernibleControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForegroundBySet(neutralFillDiscernibleInteractiveSet, blackOrWhiteDiscernibleRecipe),
    borderFill: "transparent",
});

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
export const neutralFillReadableControlStyles: Styles = Styles.fromProperties({
    ...backgroundAndForeground(neutralFillReadableInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: "transparent",
});

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
export const neutralOutlineDiscernibleControlStyles: Styles = Styles.fromProperties({
    borderFill: neutralStrokeDiscernibleInteractiveSet,
    foregroundFill: neutralStrokeStrongInteractiveSet,
});

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
export const neutralForegroundReadableElementStyles: Styles = Styles.fromProperties({
    borderFill: "transparent",
    foregroundFill: neutralStrokeReadableRest,
});

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
export const neutralForegroundStrongElementStyles: Styles = Styles.fromProperties({
    borderFill: "transparent",
    foregroundFill: neutralStrokeStrongRest,
});

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
export const neutralDividerSubtleElementStyles: Styles = Styles.fromProperties({
    foregroundFill: neutralStrokeSubtleRest,
});

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
export const neutralDividerDiscernibleElementStyles: Styles = Styles.fromProperties({
    foregroundFill: neutralStrokeDiscernibleRest,
});

/**
 * Convenience style module combining all font values for the `base` type ramp.
 *
 * @public
 */
export const typeRampBaseStyles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampBaseFontSize,
    lineHeight: typeRampBaseLineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampBaseFontVariations,
});

/**
 * Convenience style module combining all font values for the `minus 1` type ramp.
 *
 * @public
 */
export const typeRampMinus1Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampMinus1FontSize,
    lineHeight: typeRampMinus1LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampMinus1FontVariations,
});

/**
 * Convenience style module combining all font values for the `minus 2` type ramp.
 *
 * @public
 */
export const typeRampMinus2Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampMinus2FontSize,
    lineHeight: typeRampMinus2LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampMinus2FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 1` type ramp.
 *
 * @public
 */
export const typeRampPlus1Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus1FontSize,
    lineHeight: typeRampPlus1LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus1FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 2` type ramp.
 *
 * @public
 */
export const typeRampPlus2Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus2FontSize,
    lineHeight: typeRampPlus2LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus2FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 3` type ramp.
 *
 * @public
 */
export const typeRampPlus3Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus3FontSize,
    lineHeight: typeRampPlus3LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus3FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 4` type ramp.
 *
 * @public
 */
export const typeRampPlus4Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus4FontSize,
    lineHeight: typeRampPlus4LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus4FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 5` type ramp.
 *
 * @public
 */
export const typeRampPlus5Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus5FontSize,
    lineHeight: typeRampPlus5LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus5FontVariations,
});

/**
 * Convenience style module combining all font values for the `plus 6` type ramp.
 *
 * @public
 */
export const typeRampPlus6Styles: Styles = Styles.fromProperties({
    fontFamily: bodyFont,
    fontSize: typeRampPlus6FontSize,
    lineHeight: typeRampPlus6LineHeight,
    fontWeight: "initial",
    fontVariationSettings: typeRampPlus6FontVariations,
});

/**
 * @public
 */
export const actionStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralFillSubtleControlStyles
);

/**
 * @public
 */
export const inputStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralOutlineDiscernibleControlStyles
);

/**
 * @public
 */
export const selectableSelectedStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    accentFillReadableControlStyles
);

/**
 * @public
 */
export const selectableUnselectedStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralOutlineDiscernibleControlStyles
);

/**
 * @public
 */
export const itemStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralFillStealthControlStyles
);

/**
 * @public
 */
export const plainTextStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralForegroundStrongElementStyles
);

/**
 * @public
 */
export const labelTextStyles: Styles = Styles.compose(
    typeRampBaseStyles,
    neutralForegroundStrongElementStyles
);
