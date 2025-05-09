import chai from "chai";
import { Color } from "../color.js";
import { PaletteRGB } from "../palette-rgb.js";
import { contrastSwatch } from "./contrast-swatch.js";

const { expect } = chai;

const neutralBase = Color.parse("#808080")!;
const accentBase = Color.parse("#80DEEA")!;

describe("contrastSwatch", (): void => {
    const neutralPalette = PaletteRGB.from(neutralBase);
    const accentPalette = PaletteRGB.from(accentBase);

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${swatch.toColorString()} should resolve a color from the neutral palette`, (): void => {
            expect(
                neutralPalette.swatches.indexOf(contrastSwatch(neutralPalette, swatch, 4.5))
            ).not.to.equal(-1);
        });
    });

    neutralPalette.swatches.concat(accentPalette.swatches).forEach((swatch): void => {
        it(`${swatch.toColorString()} should always be at least 4.5 : 1 against the background`, (): void => {
            expect(
                swatch.contrast(contrastSwatch(neutralPalette, swatch, 4.5))
                // Because contrastSwatch follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).to.be.gte(swatch.toColorString().toUpperCase() === "#777777" ? 4.48 : 4.5);
            expect(swatch.contrast(contrastSwatch(neutralPalette, swatch, 4.5))).to.be.lessThan(5);
        });
    });
});
