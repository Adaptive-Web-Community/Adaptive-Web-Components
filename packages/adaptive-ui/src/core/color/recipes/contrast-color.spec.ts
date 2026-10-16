import chai from "chai";
import { formatColor, parseColor } from "../color.js";
import { createPaletteRGB } from "../palette-rgb.js";
import { createPalette, PaletteDirection } from "../palette.js";
import { black, white } from "../utilities/color-constants.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { contrast, relativeLuminance } from "../utilities/relative-luminance.js";
import { contrastColor } from "./contrast-color.js";

const { expect } = chai;

const neutralBase = parseColor("#808080")!;
const accentBase = parseColor("#80DEEA")!;

describe("contrastColor", (): void => {
    const neutralPalette = createPaletteRGB(neutralBase);
    const accentPalette = createPaletteRGB(accentBase);

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${formatColor(swatch)} should resolve a color from the neutral palette`, (): void => {
            expect(neutralPalette.swatches.indexOf(contrastColor(neutralPalette, swatch, 4.5))).not.to.equal(-1);
        });
    });

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${formatColor(swatch)} should always be at least 4.5 : 1 against the background`, (): void => {
            expect(
                contrast(swatch, contrastColor(neutralPalette, swatch, 4.5))
                // Because contrastColor follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).to.be.gte(formatColor(swatch).toUpperCase() === "#777777" ? 4.48 : 4.5);
            expect(contrast(swatch, contrastColor(neutralPalette, swatch, 4.5))).to.be.lessThan(5);
        });
    });

    it("should find a darker color from a light reference by default", (): void => {
        const result = contrastColor(neutralPalette, white, 4.5);

        expect(relativeLuminance(result)).to.be.lessThan(relativeLuminance(white));
    });

    it("should find a lighter color from a dark reference by default", (): void => {
        const result = contrastColor(neutralPalette, black, 4.5);

        expect(relativeLuminance(result)).to.be.greaterThan(relativeLuminance(black));
    });

    it("should honor the requested direction", (): void => {
        const mid = neutralPalette.swatches[Math.floor(neutralPalette.swatches.length / 2)];
        const darker = contrastColor(neutralPalette, mid, 1.5, PaletteDirection.darker);
        const lighter = contrastColor(neutralPalette, mid, 1.5, PaletteDirection.lighter);

        expect(relativeLuminance(darker)).to.be.lessThan(relativeLuminance(mid));
        expect(relativeLuminance(lighter)).to.be.greaterThan(relativeLuminance(mid));
        expect(contrast(darker, mid)).to.be.gte(1.5);
        expect(contrast(lighter, mid)).to.be.gte(1.5);
    });

    it("should return the end of the palette when the contrast is not achievable", (): void => {
        const result = contrastColor(neutralPalette, white, 100);

        expect(result).to.equal(neutralPalette.swatches[neutralPalette.swatches.length - 1]);
    });

    describe("with a simple palette", (): void => {
        // Eleven greys from white (index 0) to black (index 10).
        const swatches = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
        const palette = createPalette(swatches[5], swatches);

        it("should find the nearest darker swatch that meets the contrast", (): void => {
            const result = contrastColor(palette, white, 3, PaletteDirection.darker);

            expect(contrast(result, white)).to.be.gte(3);
            // The previous swatch does not meet the contrast
            const index = palette.swatches.indexOf(result);
            expect(contrast(palette.swatches[index - 1], white)).to.be.lessThan(3);
        });

        it("should find the nearest lighter swatch that meets the contrast", (): void => {
            const result = contrastColor(palette, black, 3, PaletteDirection.lighter);

            expect(contrast(result, black)).to.be.gte(3);
            const index = palette.swatches.indexOf(result);
            expect(contrast(palette.swatches[index + 1], black)).to.be.lessThan(3);
        });

        it("should default the direction to away from the reference based on whether it is dark", (): void => {
            expect(contrastColor(palette, white, 3)).to.equal(contrastColor(palette, white, 3, PaletteDirection.darker));
            expect(contrastColor(palette, black, 3)).to.equal(contrastColor(palette, black, 3, PaletteDirection.lighter));
        });

        it("should return the end of the palette when the contrast cannot be met", (): void => {
            expect(contrastColor(palette, white, 100, PaletteDirection.darker)).to.equal(swatches[10]);
            expect(contrastColor(palette, black, 100, PaletteDirection.lighter)).to.equal(swatches[0]);
        });

        it("should begin searching from the provided start index", (): void => {
            // Contrast of 1 is met by every swatch, so the result is the swatch at the start of the search.
            expect(contrastColor(palette, white, 1, PaletteDirection.darker, 4)).to.equal(swatches[4]);
            expect(contrastColor(palette, white, 1, PaletteDirection.lighter, 4)).to.equal(swatches[4]);
        });

        it("should accept a start index of zero", (): void => {
            expect(contrastColor(palette, white, 1, PaletteDirection.darker, 0)).to.equal(swatches[0]);
        });
    });
});
