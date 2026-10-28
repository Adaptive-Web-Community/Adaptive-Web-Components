import chai from "chai";
import { Color } from "../color.js";
import { PaletteDirectionValue } from "../palette.js";
import { PaletteOkhsl } from "../palette-okhsl.js";
import { _black, _white } from "../utilities/color-constants.js";
import { idealColorDeltaSwatchSet } from "./ideal-color-delta-swatch-set.js";

const { expect } = chai;

const neutralBase = Color.parse("#808080")!;
const accentBase = Color.parse("#80DEEA")!;

describe("idealColorDeltaSwatchSet", (): void => {
    const neutralPalette = PaletteOkhsl.from(neutralBase);
    const accentPalette = PaletteOkhsl.from(accentBase);

    it("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        const lightModeColors = idealColorDeltaSwatchSet(accentPalette, _white, 4.5, accentPalette.source, 0, 6, -4, 0, 1);
        const darkModeColors = idealColorDeltaSwatchSet(accentPalette, _black, 4.5, accentPalette.source, 0, 6, -4, 0, 1);

        expect(lightModeColors.hover!.contrast(_white)).to.be.greaterThan(lightModeColors.rest!.contrast(_white));
        expect(darkModeColors.hover!.contrast(_black)).to.be.greaterThan(darkModeColors.rest!.contrast(_black));
    });

    it("should have accessible rest and hover colors against the background color", (): void => {
        const accentColors = [
            Color.parse("#0078D4")!,
            Color.parse("#107C10")!,
            Color.parse("#5C2D91")!,
            Color.parse("#D83B01")!,
            Color.parse("#F2C812")!,
        ];

        accentColors.forEach((accent): void => {
            const accentPalette = PaletteOkhsl.from(accent);

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

    it("should swap the rest and hover positions when the hover delta is lower than the rest delta", (): void => {
        const normal = idealColorDeltaSwatchSet(neutralPalette, _white, 3, neutralPalette.source, 0, 2, 0, 0, 0);
        const swapped = idealColorDeltaSwatchSet(neutralPalette, _white, 3, neutralPalette.source, 2, 0, 0, 0, 0);

        // The same two colors are used, but in the opposite states.
        expect(swapped.rest).to.equal(normal.hover);
        expect(swapped.hover).to.equal(normal.rest);
        expect(swapped.rest).not.to.equal(swapped.hover);
    });

    it("should swap the rest and hover positions in the lighter direction", (): void => {
        const lighter = PaletteDirectionValue.lighter;
        const normal = idealColorDeltaSwatchSet(neutralPalette, _black, 3, neutralPalette.source, 0, 2, 0, 0, 0, neutralPalette, lighter);
        const swapped = idealColorDeltaSwatchSet(neutralPalette, _black, 3, neutralPalette.source, 2, 0, 0, 0, 0, neutralPalette, lighter);

        expect(swapped.rest).to.equal(normal.hover);
        expect(swapped.hover).to.equal(normal.rest);
    });

    it("should use the disabled palette and delta from the reference for the disabled state", (): void => {
        const set = idealColorDeltaSwatchSet(neutralPalette, _white, 3, neutralPalette.source, 0, 2, 0, 0, 3, accentPalette, PaletteDirectionValue.darker);

        expect(set.disabled).to.equal(accentPalette.get(accentPalette.closestIndexOf(_white) + 3));
    });
});
