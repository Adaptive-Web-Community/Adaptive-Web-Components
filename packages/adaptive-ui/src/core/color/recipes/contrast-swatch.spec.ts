import chai from "chai";
import { Color } from "../color.js";
import { PaletteRGB } from "../palette-rgb.js";
import { PaletteDirectionValue } from "../palette.js";
import { _black, _white } from "../utilities/color-constants.js";
import { contrastSwatch } from "./contrast-swatch.js";

const { expect } = chai;

const neutralBase = Color.parse("#808080")!;
const accentBase = Color.parse("#80DEEA")!;

describe("contrastSwatch", (): void => {
    const neutralPalette = PaletteRGB.from(neutralBase);
    const accentPalette = PaletteRGB.from(accentBase);

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${swatch.toString()} should resolve a color from the neutral palette`, (): void => {
            expect(
                neutralPalette.swatches.indexOf(contrastSwatch(neutralPalette, swatch, 4.5))
            ).not.to.equal(-1);
        });
    });

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${swatch.toString()} should always be at least 4.5 : 1 against the background`, (): void => {
            expect(
                swatch.contrast(contrastSwatch(neutralPalette, swatch, 4.5))
                // Because contrastSwatch follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).to.be.gte(swatch.toString().toUpperCase() === "#777777" ? 4.48 : 4.5);
            expect(swatch.contrast(contrastSwatch(neutralPalette, swatch, 4.5))).to.be.lessThan(5);
        });
    });

    it("should find a darker color from a light reference by default", (): void => {
        const result = contrastSwatch(neutralPalette, _white, 4.5);

        expect(result.relativeLuminance).to.be.lessThan(_white.relativeLuminance);
    });

    it("should find a lighter color from a dark reference by default", (): void => {
        const result = contrastSwatch(neutralPalette, _black, 4.5);

        expect(result.relativeLuminance).to.be.greaterThan(_black.relativeLuminance);
    });

    it("should honor the requested direction", (): void => {
        const mid = neutralPalette.swatches[Math.floor(neutralPalette.swatches.length / 2)];
        const darker = contrastSwatch(neutralPalette, mid, 1.5, PaletteDirectionValue.darker);
        const lighter = contrastSwatch(neutralPalette, mid, 1.5, PaletteDirectionValue.lighter);

        expect(darker.relativeLuminance).to.be.lessThan(mid.relativeLuminance);
        expect(lighter.relativeLuminance).to.be.greaterThan(mid.relativeLuminance);
        expect(darker.contrast(mid)).to.be.gte(1.5);
        expect(lighter.contrast(mid)).to.be.gte(1.5);
    });

    it("should return the end of the palette when the contrast is not achievable", (): void => {
        const result = contrastSwatch(neutralPalette, _white, 100);

        expect(result).to.equal(neutralPalette.swatches[neutralPalette.lastIndex]);
    });
});
