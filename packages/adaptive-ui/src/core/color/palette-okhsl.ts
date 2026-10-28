import { clampChroma, interpolate, modeOkhsl, modeRgb, samples, useMode } from "culori/fn";
import { Color, fromCulori, parseColor, toCulori } from "./color.js";
import { createPalette, Palette } from "./palette.js";
import { black, white } from "./utilities/color-constants.js";

const okhsl = useMode(modeOkhsl);
useMode(modeRgb);

/**
 * Options to tailor the generation of an okhsl palette.
 *
 * @public
 */
export interface PaletteOkhslOptions {
    /**
     * The number of steps in the generated palette.
     *
     * @defaultValue 66
     */
    stepCount: number;

    /**
     * The saturation of the color at the light end of the palette.
     *
     * @remarks Decimal value between 0 and 1; 0 means no change.
     *
     * @defaultValue 0
     */
    lightEndSaturation: number;

    /**
     * The saturation of the color at the dark end of the palette.
     *
     * @remarks Decimal value between 0 and 1; 0 means no change.
     *
     * @defaultValue 0
     */
    darkEndSaturation: number;
}

const defaultPaletteOkhslOptions: PaletteOkhslOptions = {
    stepCount: 66,
    lightEndSaturation: 0,
    darkEndSaturation: 0,
};

/**
 * Creates a {@link Palette} that uses the okhsl color model.
 *
 * @remarks
 * This is useful for UI as it means the difference between swatches is perceptually equal.
 *
 * @param source - The source color, or a string that can be parsed as a color
 * @param options - Options to tailor the generation of the palette
 * @returns A new palette
 *
 * @public
 */
export function createPaletteOkhsl(source: Color | string, options?: Partial<PaletteOkhslOptions>): Palette {
    const color = typeof source === "string" ? parseColor(source) : source;
    if (!color) {
        throw new Error(`Unable to parse source: ${source}`);
    }

    const opts = { ...defaultPaletteOkhslOptions, ...options };

    const oneStep = 1 / opts.stepCount;
    const threeSteps = oneStep * 3;

    const sourceHsl = okhsl(toCulori(color));

    const hiS = sourceHsl.s > 0 && opts.lightEndSaturation > 0 ? opts.lightEndSaturation : sourceHsl.s;
    const loS = sourceHsl.s > 0 && opts.darkEndSaturation > 0 ? opts.darkEndSaturation : sourceHsl.s;
    const hi = Object.assign({}, sourceHsl, { s: hiS, l: 1 - oneStep });
    const lo = Object.assign({}, sourceHsl, { s: loS, l: Math.max(oneStep, 0.04) }); // Minimum value to perceive difference

    // Adjust the hi or lo end if the source color is too close to produce a good ramp.
    sourceHsl.l = Math.min(1 - threeSteps, sourceHsl.l);
    sourceHsl.l = Math.max(threeSteps, sourceHsl.l);

    const rampCount = opts.stepCount - 2; // Ends fixed to white and black
    const y = 1 - sourceHsl.l; // Position for the source color in the ramp
    const rampCountLeft = Math.round(y * rampCount);
    const rampCountRight = rampCount - rampCountLeft + 1;
    const colorsLeft: any = [hi, sourceHsl];
    const colorsRight: any = [sourceHsl, lo];
    const interpolateLeft = interpolate(colorsLeft, "okhsl");
    const interpolateRight = interpolate(colorsRight, "okhsl");
    const samplesLeft = samples(rampCountLeft).map(interpolateLeft);
    const samplesRight = samples(rampCountRight).map(interpolateRight);

    const ramp = [...samplesLeft, ...samplesRight.slice(1)];
    const rampSwatches = ramp.map(value => fromCulori(clampChroma(value, "okhsl")));

    // It's important that the ends are full white and black.
    return createPalette(color, [white, ...rampSwatches, black]);
}
