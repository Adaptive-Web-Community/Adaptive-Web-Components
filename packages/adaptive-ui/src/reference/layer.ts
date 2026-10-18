import { DesignToken, Library } from "design-token-library";
import { Color } from "../core/color/color.js";
import { deltaColor } from "../core/color/recipes/delta-color.js";
import { deltaColorSet } from "../core/color/recipes/delta-color-set.js";
import { invertingPaletteDeltasForSet } from "../core/color/recipes/inverting-palette-deltas-for-set.js";
import { luminanceColor } from "../core/color/utilities/luminance-color.js";
import { PaletteDirection } from "../core/color/palette.js";
import { StyleProperty } from "../core/modules/types.js";
import { intendedFor } from "../core/token-metadata.js";
import { AdaptiveDesignToken, interactiveDeltas, InteractiveDeltaTokens, InteractiveToken, PaletteToken } from "../core/token-types.js";
import { colorContext, ColorContextLibraryTokens } from "./color-context.js";
import { PaletteLibraryTokens, palettes } from "./palette.js";

/**
 * Baseline values for light and dark mode for the `baseLuminance` of the layers.
 *
 * @remarks
 * These values represent reasonable starting points for light and dark modes, but custom values can be used instead.
 *
 * @public
 */
export const LayerBaseLuminance = Object.freeze({
    LightMode: 0.95,
    DarkMode: 0.15,
} as const);

/**
 * The fills of the "Fixed" layers, which represent the backgrounds commonly used to define the structure of an app.
 *
 * @remarks
 * The primary content is `base`. Underlying sections like a navigation or a header are logically *beneath*, `minus1` and so
 * on. Layers above the base, like a flyout or a dialog, are `plus1` and so on. Each position is one `restDelta` from the
 * one before it.
 *
 * @public
 */
export interface LayerRampTokens {
    /**
     * The ideal luminance of the `base` layer, 0 to 1, where 0 is black and 1 is white.
     */
    baseLuminance: DesignToken.Number;
    minus4: DesignToken.Color;
    minus3: DesignToken.Color;
    minus2: DesignToken.Color;
    minus1: DesignToken.Color;
    base: DesignToken.Color;
    plus1: DesignToken.Color;
    plus2: DesignToken.Color;
    plus3: DesignToken.Color;
    plus4: DesignToken.Color;
}

/**
 * The tokens of the layers, under `color`.
 *
 * @public
 */
export interface LayerTokens {
    /**
     * The palette to use for the layers, which is the neutral palette until it is set.
     */
    palette: PaletteToken;
    fill: {
        /**
         * The offset between the "Fixed" layers, or from the container for the "Interactive" rest state.
         *
         * @remarks
         * A negative value goes darker for the layers beneath and lighter for those above. A positive value does the reverse.
         */
        restDelta: DesignToken.Number;
        ramp: LayerRampTokens;

        /**
         * The deltas of the interactive fill, which are the offset from the context of each state. The `rest` is the `restDelta` until it is set.
         */
        interactiveDeltas: InteractiveDeltaTokens;

        /**
         * The fill of an interactive layer, like a card: a color for each state, relative to the context, made once. The recipe decides if a state has a color.
         */
        interactive: InteractiveToken<Color>;
    };
}

/**
 * The tokens of a library that has the layers, with the palette and the color context they are made from.
 *
 * @public
 */
export interface LayerLibraryTokens extends PaletteLibraryTokens, ColorContextLibraryTokens {
    color: PaletteLibraryTokens["color"] & ColorContextLibraryTokens["color"] & { layer: LayerTokens };
}

const fillFor = intendedFor(StyleProperty.backgroundFill);

// A step of the ramp, which is the `index` steps of the rest delta from the ideal luminance.
const rampStep = (index: number): Library.ConfigValue<DesignToken.Color, LayerLibraryTokens> => ({
    $type: DesignToken.Type.Color,
    $value: t => {
        const { palette, fill } = t.color.layer;
        return deltaColor(
            palette.$value,
            luminanceColor(fill.ramp.baseLuminance.$value),
            fill.restDelta.$value * index,
            PaletteDirection.darker
        );
    },
    $extensions: fillFor,
});

/**
 * The configuration of the layer tokens, for the library.
 *
 * @remarks
 * The interactive fill is for a container that is interactive, like a card. It is made relative to the color context, so
 * it is made again for the content of a layer, which is the library extended with the layer as its context.
 *
 * @public
 */
export const layer: Library.Config<LayerTokens, LayerLibraryTokens> = {
    palette: { $type: AdaptiveDesignToken.palette, $value: t => t.color.neutral.palette },
    fill: {
        restDelta: { $type: DesignToken.Type.Number, $value: -2 },
        ramp: {
            baseLuminance: { $type: DesignToken.Type.Number, $value: LayerBaseLuminance.LightMode },
            minus4: rampStep(-4),
            minus3: rampStep(-3),
            minus2: rampStep(-2),
            minus1: rampStep(-1),
            base: rampStep(0),
            plus1: rampStep(1),
            plus2: rampStep(2),
            plus3: rampStep(3),
            plus4: rampStep(4),
        },
        interactiveDeltas: {
            $type: DesignToken.Type.Number,
            rest: { $value: tokens => tokens.color.layer.fill.restDelta },
            hover: { $value: -3 },
            active: { $value: -1 },
            focus: { $value: -3 },
            disabled: { $value: -1 },
        },
        interactive: {
            $type: AdaptiveDesignToken.interactive,
            $value: tokens => {
                const { palette, fill } = tokens.color.layer;
                const reference = tokens.color.context.$value;
                const deltas = invertingPaletteDeltasForSet(palette.$value, reference, interactiveDeltas(fill.interactiveDeltas));
                return deltaColorSet(palette.$value, reference, deltas, { direction: PaletteDirection.darker });
            },
            $extensions: fillFor,
        },
    },
};

/**
 * Creates a library with the layer tokens, and the palette and color context they are made from.
 *
 * @public
 */
export const createLayerLibrary = () => Library.create<LayerLibraryTokens>({ color: { ...palettes, ...colorContext, layer } });
