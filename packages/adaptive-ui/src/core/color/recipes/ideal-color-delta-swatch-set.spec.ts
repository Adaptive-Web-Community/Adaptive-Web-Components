import chai from "chai";
import { PaletteRGB } from "../palette-rgb.js";
import { Swatch } from "../swatch.js";
import { _black, _white } from "../utilities/color-constants.js";
import { idealColorDeltaSwatchSet } from "./ideal-color-delta-swatch-set.js";

const { expect } = chai;

const neutralBase = Swatch.parse("#808080")!;
const accentBase = Swatch.parse("#80DEEA")!;

describe("idealColorDeltaSwatchSet", (): void => {
    const neutralPalette = PaletteRGB.from(neutralBase);
    const accentPalette = PaletteRGB.from(accentBase);

    it("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        const lightModeColors = idealColorDeltaSwatchSet(accentPalette, _white, 4.5, accentPalette.source, 0, 6, -4, 0, 1);
        const darkModeColors = idealColorDeltaSwatchSet(accentPalette, _black, 4.5, accentPalette.source, 0, 6, -4, 0, 1);

        expect(lightModeColors.hover!.contrast(_white)).to.be.greaterThan(lightModeColors.rest!.contrast(_white));
        expect(darkModeColors.hover!.contrast(_black)).to.be.greaterThan(darkModeColors.rest!.contrast(_black));
    });

    it("should have accessible rest and hover colors against the background color", (): void => {
        const accentColors = [
            Swatch.parse("#0078D4")!,
            Swatch.parse("#107C10")!,
            Swatch.parse("#5C2D91")!,
            Swatch.parse("#D83B01")!,
            Swatch.parse("#F2C812")!,
        ];

        accentColors.forEach((accent): void => {
            const accentPalette = PaletteRGB.from(accent);

            neutralPalette.swatches.forEach((swatch): void => {
                const smallColors = idealColorDeltaSwatchSet(
                    accentPalette,
                    swatch,
                    4.5,
                    accentPalette.source,
                    0,
                    6,
                    -4,
                    0,
                    1
                );
                const largeColors = idealColorDeltaSwatchSet(
                    accentPalette,
                    swatch,
                    3,
                    accentPalette.source,
                    0,
                    6,
                    -4,
                    0,
                    1
                );
                expect(
                    swatch.contrast(smallColors.rest!)
                    // There are a few states that are impossible to meet contrast on
                ).to.be.gte(4.47);
                expect(
                    swatch.contrast(smallColors.hover!)
                    // There are a few states that are impossible to meet contrast on
                ).to.be.gte(3.7);
                expect(swatch.contrast(largeColors.rest!)).to.be.gte(3);
                expect(swatch.contrast(largeColors.hover!)).to.be.gte(3);
            });
        });
    });
});
