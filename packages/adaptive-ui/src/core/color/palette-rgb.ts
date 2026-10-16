import { clampRgb, type Hsl, interpolate, modeHsl, modeLab, modeRgb, type Rgb, useMode } from "culori/fn";
import { Color, fromCulori, parseColor, toCulori } from "./color.js";
import { contrastColor } from "./recipes/contrast-color.js";
import { closestSwatchIndex, createPalette, Palette, PaletteDirection, reversedSwatches } from "./palette.js";
import { black, white } from "./utilities/color-constants.js";
import { contrast, relativeLuminance } from "./utilities/relative-luminance.js";

const hsl = useMode(modeHsl);
const lab = useMode(modeLab);
const rgb = useMode(modeRgb);

/**
 * Bump the saturation if it falls below the reference color saturation.
 *
 * @param reference - Color with target saturation
 * @param color - Color to check and bump if below target saturation
 * @returns Original or adjusted color
 */
function saturationBump(reference: Rgb, color: Rgb): Rgb {
    const hslReference = hsl(reference);
    const saturationTarget = hslReference.s;
    const hslColor = hsl(color);
    if (hslColor.s < saturationTarget) {
        const hslNew: Hsl = { mode: "hsl", h: hslColor.h, s: saturationTarget, l: hslColor.l };
        return rgb(hslNew);
    }
    return color;
}

function isExactly(color: Rgb, channelValue: 0 | 1): boolean {
    return color.r === channelValue && color.g === channelValue && color.b === channelValue;
}

/**
 * Scales input from 0 to 100 to 0 to 0.5.
 *
 * @param l - Input number, 0 to 100
 * @returns Output number, 0 to 0.5
 */
function ramp(l: number) {
    const inputVal = l / 100;
    if (inputVal > 0.5) return (inputVal - 0.5) / 0.5; //from 0.500001in = 0.00000001out to 1.0in = 1.0out
    return 2 * inputVal; //from 0in = 0out to 0.5in = 1.0out
}

/**
 * Creates a utility palette that has many swatches used for selection in the actual palette.
 * The algorithm uses the LAB color space and keeps the saturation from the source color throughout.
 *
 * @param source - The source color
 * @returns The palette based on the `source` color
 */
function createHighResolutionPalette(source: Color): Palette {
    const swatches: Color[] = [];

    const labSource = lab(toCulori(source));
    const lab0 = clampRgb(rgb({ mode: "lab", l: 0, a: labSource.a, b: labSource.b }));
    const lab50 = clampRgb(rgb({ mode: "lab", l: 50, a: labSource.a, b: labSource.b }));
    const lab100 = clampRgb(rgb({ mode: "lab", l: 100, a: labSource.a, b: labSource.b }));
    const rgbMin = toCulori(black) as Rgb;
    const rgbMax = toCulori(white) as Rgb;

    // Only extend past the lab ends when they are not already exactly white or black. This must be an exact
    // comparison, the palette algorithm relies on the reference palette ending in exactly white (luminance 1)
    // and black (luminance 0), so a near match would leave an end short.
    const lAbove = isExactly(lab100, 1) ? 0 : 14;
    const lBelow = isExactly(lab0, 0) ? 0 : 14;

    // 257 levels max, depending on whether lab0 or lab100 are black or white respectively.
    for (let l = 100 + lAbove; l >= 0 - lBelow; l -= 0.5) {
        let rgb: Rgb;

        if (l < 0) {
            // For L less than 0, scale from black to L=0
            const percentFromRgbMinToLab0 = l / lBelow + 1;
            rgb = interpolate([rgbMin, lab0])(percentFromRgbMinToLab0);
        } else if (l <= 50) {
            // For L less than 50, we scale from L=0 to the base color
            rgb = interpolate([lab0, lab50])(ramp(l));
        } else if (l <= 100) {
            // For L less than 100, scale from the base color to L=100
            rgb = interpolate([lab50, lab100])(ramp(l));
        } else {
            // For L greater than 100, scale from L=100 to white
            const percentFromLab100ToRgbMax = (l - 100.0) / lAbove;
            rgb = interpolate([lab100, rgbMax])(percentFromLab100ToRgbMax);
        }

        rgb = saturationBump(lab50, rgb);

        swatches.push(fromCulori(rgb));
    }

    return createPalette(source, swatches);
}

/**
 * Options to tailor the generation of an RGB palette.
 *
 * @public
 */
export interface PaletteRGBOptions {
    /**
     * The minimum amount of contrast between steps in the palette.
     * - Default 1.05
     * - Greater than 1
     * - Recommended increments by hundredths
     */
    stepContrast: number;

    /**
     * Multiplier for increasing step contrast as the swatches darken.
     * - Default 0.
     * - Greater than or equal to 0
     * - Recommended increments by hundredths
     */
    stepContrastRamp: number;

    /**
     * Whether to keep the exact source color in the target palette.
     * - Default false
     *
     * Only recommended when the exact color is required and used in stateful interaction recipes like hover.
     *
     * Note that custom recipes can still access the source color even if it's not in the ramp,
     * but turning this on will potentially increase the contrast between steps toward the ends of the palette.
     */
    preserveSource: boolean;
}

const defaultPaletteRGBOptions: PaletteRGBOptions = {
    stepContrast: 1.05,
    stepContrastRamp: 0,
    preserveSource: false,
};

/**
 * Adjusts one end of the palette so the last two swatches meet the target contrast.
 *
 * @param swatchContrast - Gets the target contrast for a swatch
 * @param referencePalette - The high resolution palette
 * @param targetPalette - The swatches being created, modified in place
 * @param direction - Which end to adjust, `lighter` for the dark end and `darker` for the light end
 * @param preserved - The preserved source color, if any
 */
function adjustEnd(
    swatchContrast: (swatch: Color) => number,
    referencePalette: Palette,
    targetPalette: Color[],
    direction: PaletteDirection,
    preserved?: Color
) {
    const lastIndex = referencePalette.swatches.length - 1;

    // Careful with the use of referencePalette as only the refSwatches is reversed.
    const refSwatches = direction === PaletteDirection.lighter ? referencePalette.swatches : reversedSwatches(referencePalette);
    const refIndex = (color: Color) => {
        const index = closestSwatchIndex(referencePalette, color);
        return direction === PaletteDirection.darker ? lastIndex - index : index;
    };

    // Only operates on the 'end' end of the array, so flip if we're adjusting the 'beginning'
    if (direction === PaletteDirection.darker) {
        targetPalette.reverse();
    }

    const targetContrast = swatchContrast(targetPalette[targetPalette.length - 2]);
    const actualContrast = contrast(targetPalette[targetPalette.length - 1], targetPalette[targetPalette.length - 2]);
    // The last two swatches are replaced below, so there is nothing to adjust if one is preserved.
    const preservedIndex = preserved ? targetPalette.indexOf(preserved) : -1;
    const endIsPreserved = preservedIndex >= targetPalette.length - 2;
    if (actualContrast < targetContrast && !endIsPreserved) {
        // Remove last swatch if not sufficient contrast
        targetPalette.pop();

        // Distribute to the last swatch
        const safeSecondSwatch = contrastColor(
            referencePalette,
            refSwatches[lastIndex],
            targetContrast,
            direction
        );
        const safeSecondRefIndex = refIndex(safeSecondSwatch);
        const targetSwatchCurrentRefIndex = refIndex(targetPalette[targetPalette.length - 2]);
        const swatchesToSpace = safeSecondRefIndex - targetSwatchCurrentRefIndex;
        // The shift grows by one reference step for each swatch toward the end. With a large step contrast
        // the palette can have fewer swatches than the distance to space, so keep the shifts aligned to the
        // end of the palette and never move the swatch at the opposite end (index 0). A preserved color
        // is not moved either, so only swatches after it are shifted.
        const unclampedStart = targetPalette.length - swatchesToSpace - 1;
        for (let i = Math.max(1, unclampedStart, preservedIndex + 1); i < targetPalette.length; i++) {
            const space = i - unclampedStart + 1;
            const currentRefIndex = refIndex(targetPalette[i]);
            const nextRefIndex = i === targetPalette.length - 1 ? lastIndex : currentRefIndex + space;
            targetPalette[i] = refSwatches[nextRefIndex];
        }
    }

    if (direction === PaletteDirection.darker) {
        targetPalette.reverse();
    }
}

/**
 * Creates the swatches of a palette that has a minimum contrast between steps.
 *
 * @param source - The source color
 * @param options - Palette generation options
 * @returns The swatches meeting the requested contrast between steps.
 */
function createColorPaletteByContrast(source: Color, options: PaletteRGBOptions): Color[] {
    const referencePalette = createHighResolutionPalette(source);

    // Ramp function to increase contrast as the swatches get darker
    const nextContrast = (color: Color) => {
        return options.stepContrast + options.stepContrast * (1 - relativeLuminance(color)) * options.stepContrastRamp;
    };

    const swatches: Color[] = [];

    // Start with the source color (when preserving) or the light end color
    let ref = options.preserveSource ? source : referencePalette.swatches[0];
    swatches.push(ref);

    // Add swatches by contrast toward dark
    while (relativeLuminance(ref) > 0) {
        const targetContrast = nextContrast(ref);
        ref = contrastColor(referencePalette, ref, targetContrast, PaletteDirection.darker);
        swatches.push(ref);
    }

    // Add swatches by contrast toward light
    if (options.preserveSource) {
        ref = source;
        while (relativeLuminance(ref) < 1) {
            // This is off from the dark direction because `ref` here is the darker swatch, probably subtle
            const targetContrast = nextContrast(ref);
            ref = contrastColor(referencePalette, ref, targetContrast, PaletteDirection.lighter);
            swatches.unshift(ref);
        }
    }

    // Cleanup dark end
    adjustEnd(nextContrast, referencePalette, swatches, PaletteDirection.lighter, options.preserveSource ? source : undefined);

    // Cleanup light end
    if (options.preserveSource) {
        adjustEnd(nextContrast, referencePalette, swatches, PaletteDirection.darker, source);
    }

    return swatches;
}

/**
 * Creates a {@link Palette} that has a minimum contrast between steps, using the RGB color model.
 *
 * @param source - The source color, or a string that can be parsed as a color
 * @param options - Options to tailor the generation of the palette
 * @returns A new palette
 *
 * @public
 */
export function createPaletteRGB(source: Color | string, options?: Partial<PaletteRGBOptions>): Palette {
    const color = typeof source === "string" ? parseColor(source) : source;
    if (!color) {
        throw new Error(`Unable to parse Color as hex string: ${source}`);
    }

    const opts = { ...defaultPaletteRGBOptions, ...options };

    return createPalette(color, createColorPaletteByContrast(color, opts));
}
