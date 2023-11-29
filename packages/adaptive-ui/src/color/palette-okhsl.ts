import { clampChroma, interpolate, modeOkhsl, modeRgb, samples, useMode} from "culori/fn";
import { Color } from "./color.js";
import { BasePalette } from "./palette.js";
import { Swatch } from "./swatch.js";
import { _black, _white } from "./utilities/color-constants.js";

const okhsl = useMode(modeOkhsl);
const rgb = useMode(modeRgb);

const stepCount = 56;

/**
 * An implementation of a {@link Palette} that uses the okhsl color model.
 * This is useful for UI as it means the difference between swatches is perceptually equal.
 *
 * @public
 */
export class PaletteOkhsl extends BasePalette<Swatch> {
    public static from(source: Color | string): PaletteOkhsl {
        const color = source instanceof Color ? source : Color.parse(source);
        if (!color) {
            throw new Error(`Unable to parse source: ${source}`);
        }

        const sourceHsl = okhsl(color.color);

        const lo = Object.assign({}, sourceHsl, {l: 0.01});
        const hi = Object.assign({}, sourceHsl, {l: 0.99});

        const y = 1 - sourceHsl.l; // Position for the source color in the ramp
        const stepCountLeft = Math.round(y * stepCount);
        const stepCountRight = stepCount- stepCountLeft;
        const colorsLeft: any = [hi, sourceHsl];
        const colorsRight: any = [sourceHsl, lo];
        const interpolateLeft = interpolate(colorsLeft, "okhsl");
        const interpolateRight = interpolate(colorsRight, "okhsl");
        const samplesLeft = samples(stepCountLeft).map(interpolateLeft);
        const samplesRight = samples(stepCountRight).map(interpolateRight);

        const ramp = [...samplesLeft, ...samplesRight.slice(1)];
        const swatches = ramp.map((value) =>
            Swatch.from(rgb(clampChroma(value, "okhsl")))
        );

        // It's important that the ends are full white and black.
        swatches[0] = _white;
        swatches[swatches.length - 1] = _black;

        return new PaletteOkhsl(color, swatches);
    }
}
