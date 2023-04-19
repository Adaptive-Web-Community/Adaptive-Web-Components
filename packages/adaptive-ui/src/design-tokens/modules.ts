import { CSSDesignToken, DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import type { Styles } from "../modules/types.js";
import type { InteractiveSet, InteractiveTokenSet } from "../types.js";
import {
    accentFillReadableInteractiveSet,
    accentStrokeReadableInteractiveSet,
    fillColor,
    foregroundOnAccentFillReadableInteractiveSet,
    neutralFillDiscernibleInteractiveSet,
    neutralFillStealthInteractiveSet,
    neutralFillSubtleInteractiveSet,
    neutralStrokeDiscernibleInteractiveSet,
    neutralStrokeReadableRest,
    neutralStrokeStrongInteractiveSet,
    neutralStrokeStrongRecipe,
    neutralStrokeStrongRest,
    neutralStrokeSubtleInteractiveSet,
} from "./color.js";

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

/**
 * Convenience style module for an accent-filled control.
 *
 * @public
 */
export const accentFillControlStyles: Styles = {
    backgroundFill: accentFillReadableInteractiveSet,
    borderFill: "transparent",
    foregroundFill: foregroundOnAccentFillReadableInteractiveSet,
};

/**
 * Convenience style module for a neutral stealth control.
 *
 * @public
 */
export const neutralStealthControlStyles: Styles = {
    backgroundFill: neutralFillStealthInteractiveSet,
    borderFill: "transparent",
    foregroundFill: createForegroundSet(neutralStrokeStrongRecipe, "rest", neutralFillStealthInteractiveSet),
};

/**
 * Convenience style module for a neutral control with accessibility requirements applied to the fill, like a selected checkbox.
 *
 * @public
 */
export const neutralFillDiscernibleControlStyles: Styles = {
    backgroundFill: neutralFillDiscernibleInteractiveSet,
    borderFill: "transparent",
    foregroundFill: createForegroundSet(neutralStrokeStrongRecipe, "rest", neutralFillDiscernibleInteractiveSet),
};

/**
 * Convenience style module for a neutral-filled control.
 *
 * @public
 */
export const neutralFillControlStyles: Styles = {
    backgroundFill: neutralFillSubtleInteractiveSet,
    borderFill: neutralStrokeSubtleInteractiveSet,
    foregroundFill: createForegroundSet(neutralStrokeStrongRecipe, "rest", neutralFillSubtleInteractiveSet),
};

/**
 * Convenience style module for a neutral control with accessibility requirements applied to the border, like an unselected checkbox.
 *
 * @public
 */
export const neutralOutlineDiscernibleControlStyles: Styles = {
    backgroundFill: neutralFillSubtleInteractiveSet,
    borderFill: neutralStrokeDiscernibleInteractiveSet,
    foregroundFill: createForegroundSet(neutralStrokeStrongRecipe, "rest", neutralFillSubtleInteractiveSet),
};

/**
 * Convenience style module for a neutral-outlined control.
 *
 * @public
 */
export const neutralOutlineControlStyles: Styles = {
    backgroundFill: fillColor,
    borderFill: neutralStrokeDiscernibleInteractiveSet,
    foregroundFill: neutralStrokeStrongRest,
};

/**
 * Convenience style module for accent-colored text or icons.
 *
 * @public
 */
export const accentForegroundReadableStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: accentStrokeReadableInteractiveSet,
};

/**
 * Convenience style module for neutral-colored hint or placeholder text or icons.
 *
 * @public
 */
export const neutralForegroundReadableStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: neutralStrokeReadableRest,
};

/**
 * Convenience style module for neutral-colored main text or icons.
 *
 * @public
 */
export const neutralForegroundStrongStyles: Styles = {
    borderFill: "transparent",
    foregroundFill: neutralStrokeStrongInteractiveSet,
};
