import { DesignToken, Library, recipes, refs } from "design-token-library";
import { Color, withAlpha } from "../core/color/color.js";
import { InteractiveColorSet } from "../core/color/interactive-set.js";
import { StyleProperty } from "../core/styles/properties.js";
import { shadow } from "../core/shadow/index.js";
import { intendedFor } from "../core/token-metadata.js";
import { AdaptiveDesignToken, DeltaToken, InteractiveDeltaTokens, InteractiveToken } from "../core/token-types.js";
import { color, ColorLibraryTokens } from "./color.js";

/**
 * The shadow of an element at a height: an ambient shadow around it, and a directional one below it that grows with the height.
 * Above a height of 16 both are darker.
 *
 * @remarks
 * This is the shadow of Adaptive UI's system. A system that wants another overrides `elevationRecipes.elevationShadow` with a function of the
 * same parameters, which may make any shadow, one layer or several.
 *
 * @param color - The color of the shadow, opaque
 * @param size - The height, which is the blur of the directional shadow in `px`, and twice its offset
 * @returns The two layers
 *
 * @public
 */
export function elevationShadow(color: Color, size: number): DesignToken.Values.Readonly.Shadow {
    const [ambientAlpha, directionalAlpha] = size > 16 ? [0.2, 0.24] : [0.12, 0.14];
    return Object.freeze([shadow(withAlpha(color, ambientAlpha), 0, 0, 2), shadow(withAlpha(color, directionalAlpha), 0, size * 0.5, size)]);
}

/**
 * The recipes of the elevation tokens, which a system can override with the library's `override()`.
 *
 * @remarks
 * `elevationShadow` is the shadow of a height, and `shadowColor` the rest of a set of colors, the color the shadows are cast in. Each state of
 * an interactive shadow is an `elevationShadow` of its own, so an override of it changes them as well.
 *
 * @public
 */
export const elevationRecipes = recipes({
    elevationShadow,
    shadowColor: (set: InteractiveColorSet): Color => {
        if (!set.rest) {
            throw new Error("The color of the shadows is the rest of a set, and the set has none");
        }
        return set.rest;
    },
});

/**
 * The shadow of an element at a height, and the height.
 *
 * @public
 */
export interface ElevationLevelTokens {
    /**
     * The shadow, a recipe of the color and the size until it is set. Its custom property is the name of the group, `--elevation-tooltip`.
     */
    $root: DesignToken.Shadow;
    /**
     * The height, which the recipe reads, and which is not CSS.
     */
    size: DeltaToken;
}

/**
 * The tokens of the shadows, under `elevation`.
 *
 * @public
 */
export interface ElevationTokens {
    /**
     * The color the shadows are cast in, the rest of the strong neutral stroke until it is set.
     */
    color: DesignToken.Color;
    /**
     * The shadow of a card for each state, from a height for each, its deltas.
     */
    card: {
        $root: InteractiveToken<DesignToken.Values.Readonly.Shadow>;
        deltas: InteractiveDeltaTokens;
    };
    tooltip: ElevationLevelTokens;
    flyout: ElevationLevelTokens;
    dialog: ElevationLevelTokens;
}

/**
 * The tokens of a library that has the shadows, which are cast in a color of the color tokens.
 *
 * @public
 */
export interface ElevationLibraryTokens extends ColorLibraryTokens {
    elevation: ElevationTokens;
}

const tokens = refs<ElevationLibraryTokens>().elevation;

const level = (
    group: Library.Refs<ElevationLevelTokens, ElevationLibraryTokens>,
    size: number
): Library.Config<ElevationLevelTokens, ElevationLibraryTokens> => ({
    $root: { $type: DesignToken.Type.Shadow, $value: elevationRecipes.elevationShadow(tokens.color, group.size) },
    size: { $type: AdaptiveDesignToken.delta, $value: size },
});

const cardDeltas = tokens.card.deltas;

/**
 * The configuration of the elevation tokens, for the library.
 *
 * @public
 */
export const elevation: Library.Config<ElevationTokens, ElevationLibraryTokens> = {
    color: {
        $type: DesignToken.Type.Color,
        $value: elevationRecipes.shadowColor(refs<ElevationLibraryTokens>().color.neutral.stroke.strong),
    },
    card: {
        $root: {
            $type: AdaptiveDesignToken.interactive,
            $value: {
                rest: elevationRecipes.elevationShadow(tokens.color, cardDeltas.rest),
                hover: elevationRecipes.elevationShadow(tokens.color, cardDeltas.hover),
                active: elevationRecipes.elevationShadow(tokens.color, cardDeltas.active),
                focus: elevationRecipes.elevationShadow(tokens.color, cardDeltas.focus),
                disabled: elevationRecipes.elevationShadow(tokens.color, cardDeltas.disabled),
            },
            // An interactive token can hold any value, so its type doesn't say that it's a shadow.
            $extensions: intendedFor(StyleProperty.shadow),
        },
        deltas: {
            $type: AdaptiveDesignToken.delta,
            rest: { $value: 4 },
            hover: { $value: 6 },
            active: { $value: 2 },
            focus: { $value: 4 },
            disabled: { $value: 0 },
        },
    },
    tooltip: level(tokens.tooltip, 8),
    flyout: level(tokens.flyout, 16),
    dialog: level(tokens.dialog, 32),
};

/**
 * Creates a library with the elevation tokens and the color tokens they read.
 *
 * @public
 */
export const createElevationLibrary = () => Library.create<ElevationLibraryTokens>({ color, elevation });
