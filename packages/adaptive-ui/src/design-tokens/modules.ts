import { CSSDesignToken, DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import type { Styles } from "../modules/types.js";
import type { InteractiveSet, InteractiveTokenSet } from "../types.js";
import {
    accentFillReadableActive,
    accentFillReadableFocus,
    accentFillReadableHover,
    accentFillReadableRest,
    accentStrokeReadableActive,
    accentStrokeReadableFocus,
    accentStrokeReadableHover,
    accentStrokeReadableRest,
    fillColor,
    foregroundOnAccentFillReadableActive,
    foregroundOnAccentFillReadableFocus,
    foregroundOnAccentFillReadableHover,
    foregroundOnAccentFillReadableRest,
    neutralFillDiscernibleActive,
    neutralFillDiscernibleFocus,
    neutralFillDiscernibleHover,
    neutralFillDiscernibleRest,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillSubtleActive,
    neutralFillSubtleFocus,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralStrokeDiscernibleActive,
    neutralStrokeDiscernibleFocus,
    neutralStrokeDiscernibleHover,
    neutralStrokeDiscernibleRest,
    neutralStrokeReadableRest,
    neutralStrokeStrongActive,
    neutralStrokeStrongFocus,
    neutralStrokeStrongHover,
    neutralStrokeStrongRecipe,
    neutralStrokeStrongRest,
    neutralStrokeSubtleActive,
    neutralStrokeSubtleFocus,
    neutralStrokeSubtleHover,
    neutralStrokeSubtleRest,
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
 * @public
 */
export const accentFillReadableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: accentFillReadableRest,
    hover: accentFillReadableHover,
    active: accentFillReadableActive,
    focus: accentFillReadableFocus,
};

/**
 * @public
 */
export const foregroundOnAccentFillReadableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: foregroundOnAccentFillReadableRest,
    hover: foregroundOnAccentFillReadableHover,
    active: foregroundOnAccentFillReadableActive,
    focus: foregroundOnAccentFillReadableFocus,
};

/**
 * @public
 */
export const accentStrokeReadableInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: accentStrokeReadableRest,
    hover: accentStrokeReadableHover,
    active: accentStrokeReadableActive,
    focus: accentStrokeReadableFocus,
};

/**
 * @public
 */
export const neutralFillStealthInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillStealthRest,
    hover: neutralFillStealthHover,
    active: neutralFillStealthActive,
    focus: neutralFillStealthFocus,
};

/**
 * @public
 */
export const neutralFillSubtleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillSubtleRest,
    hover: neutralFillSubtleHover,
    active: neutralFillSubtleActive,
    focus: neutralFillSubtleFocus,
};

/**
 * @public
 */
export const neutralFillDiscernibleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralFillDiscernibleRest,
    hover: neutralFillDiscernibleHover,
    active: neutralFillDiscernibleActive,
    focus: neutralFillDiscernibleFocus,
};

/**
 * @public
 */
export const neutralStrokeStrongInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralStrokeStrongRest,
    hover: neutralStrokeStrongHover,
    active: neutralStrokeStrongActive,
    focus: neutralStrokeStrongFocus,
};

/**
 * @public
 */
export const neutralStrokeSubtleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralStrokeSubtleRest,
    hover: neutralStrokeSubtleHover,
    active: neutralStrokeSubtleActive,
    focus: neutralStrokeSubtleFocus,
};

/**
 * @public
 */
export const neutralStrokeDiscernibleInteractiveSet: InteractiveTokenSet<Swatch> = {
    rest: neutralStrokeDiscernibleRest,
    hover: neutralStrokeDiscernibleHover,
    active: neutralStrokeDiscernibleActive,
    focus: neutralStrokeDiscernibleFocus,
};

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
