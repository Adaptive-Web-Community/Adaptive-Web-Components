import { clampChroma, Color, interpolate, okhsl, parse, rgb, samples} from "culori";
import { BasePalette } from "./palette.js";
import { SwatchRGB } from "./swatch.js";

const stepCount = 56;

export class PaletteOkhsl extends BasePalette<SwatchRGB> {
    static swatchToColor(swatch: SwatchRGB): Color {
        return {mode: "rgb", r: swatch.r, g: swatch.g, b: swatch.b};
    }

    static from(source: SwatchRGB | string): PaletteOkhsl {
        let swatch;
        if (source instanceof SwatchRGB) {
            swatch = source;
        } else {
            const color = parse(source);
            if (color === undefined) {
                throw new Error(`Unable to parse Color as hex string: ${source}`);
            }
            swatch = SwatchRGB.from(rgb(color));
        }

        const sourceRgb = this.swatchToColor(swatch);
        const sourceHsl = okhsl(sourceRgb);

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
            SwatchRGB.from(rgb(clampChroma(value, "okhsl")))
        );

        return new PaletteOkhsl(swatch, swatches);
    }
}
