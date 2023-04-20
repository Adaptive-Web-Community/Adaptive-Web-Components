import { CSSDesignToken, DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet, InteractiveSwatchSet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import type { Styles } from "../modules/types.js";
import type { InteractiveSet, InteractiveTokenSet } from "../types.js";
import {
    accentFillDiscernibleInteractiveSet,
    accentFillReadableInteractiveSet,
    accentFillStealthInteractiveSet,
    accentFillSubtleInteractiveSet,
    accentStrokeDiscernibleInteractiveSet,
    accentStrokeReadableInteractiveSet,
    accentStrokeReadableRecipe,
    accentStrokeSafetyInteractiveSet,
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
    neutralStrokeSubtleRest,
} from "./color.js";
import { createNonCss } from "./create.js";

function createForegroundSet(
    foregroundRecipe: DesignToken<InteractiveColorRecipe>,
    foregroundState: keyof InteractiveSet<any>,
    background: InteractiveTokenSet<Swatch>,
): InteractiveTokenSet<Swatch> {
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

function backgroundAndForeground(background: InteractiveTokenSet<Swatch>, foregroundRecipe: DesignToken<InteractiveColorRecipe>): Styles {
    return {
        backgroundFill: background,
        foregroundFill: createForegroundSet(foregroundRecipe, "rest",  background),
    };
}

function backgroundAndForegroundBySet(
    background: InteractiveTokenSet<Swatch>,
    foregroundRecipe: DesignToken<InteractiveColorRecipeBySet>
): Styles {
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
export const accentFillStealthControlStyles: Styles = {
    ...backgroundAndForeground(accentFillStealthInteractiveSet, accentStrokeReadableRecipe),
    borderFill: accentStrokeSafetyInteractiveSet,
};

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
export const accentFillSubtleControlStyles: Styles = {
    ...backgroundAndForeground(accentFillSubtleInteractiveSet, accentStrokeReadableRecipe),
    borderFill: accentStrokeSafetyInteractiveSet,
};

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
export const accentFillDiscernibleControlStyles: Styles = {
    ...backgroundAndForegroundBySet(accentFillDiscernibleInteractiveSet, blackOrWhiteDiscernibleRecipe),
    borderFill: "transparent", // TODO Remove "transparent" borders, this is a hack for the Explorer app.
};

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
export const accentFillReadableControlStyles: Styles = {
    ...backgroundAndForegroundBySet(accentFillReadableInteractiveSet, blackOrWhiteReadableRecipe),
    borderFill: "transparent",
};

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
export const accentOutlineDiscernibleControlStyles: Styles = {
    borderFill: accentStrokeDiscernibleInteractiveSet,
    foregroundFill: accentStrokeReadableInteractiveSet,
};

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
export const accentForegroundReadableControlStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: accentStrokeReadableInteractiveSet,
};

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
export const neutralFillStealthControlStyles: Styles = {
    ...backgroundAndForeground(neutralFillStealthInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: neutralStrokeSafetyInteractiveSet,
};

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
export const neutralFillSubtleControlStyles: Styles = {
    ...backgroundAndForeground(neutralFillSubtleInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: neutralStrokeSafetyInteractiveSet,
};

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
export const neutralFillDiscernibleControlStyles: Styles = {
    ...backgroundAndForegroundBySet(neutralFillDiscernibleInteractiveSet, blackOrWhiteDiscernibleRecipe),
    borderFill: "transparent",
};

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
export const neutralFillReadableControlStyles: Styles = {
    ...backgroundAndForeground(neutralFillReadableInteractiveSet, neutralStrokeStrongRecipe),
    borderFill: "transparent",
};

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
export const neutralOutlineDiscernibleControlStyles: Styles = {
    borderFill: neutralStrokeDiscernibleInteractiveSet,
    foregroundFill: neutralStrokeStrongInteractiveSet,
};

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
export const neutralForegroundReadableElementStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: neutralStrokeReadableRest,
};

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
export const neutralForegroundStrongElementStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: neutralStrokeStrongRest,
};

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
export const neutralDividerSubtleElementStyles: Styles = {
    foregroundFill: neutralStrokeSubtleRest,
};

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
export const neutralDividerDiscernibleElementStyles: Styles = {
    foregroundFill: neutralStrokeDiscernibleRest,
};
