import chai from "chai";
import { parseColor } from "../color.js";
import { createPaletteRGB } from "../palette-rgb.js";
import { closestSwatchIndex, PaletteDirection, swatchAt } from "../palette.js";
import { black, white } from "../utilities/color-constants.js";
import { contrast } from "../utilities/relative-luminance.js";
import { idealColorDeltaSet } from "./ideal-color-delta-set.js";

const { expect } = chai;

const neutralBase = parseColor("#808080")!;
const accentBase = parseColor("#80DEEA")!;

const deltas = (rest: number, hover: number, active: number, focus: number, disabled: number) => ({
    rest,
    hover,
    active,
    focus,
    disabled,
});

describe("idealColorDeltaSet", (): void => {
    const neutralPalette = createPaletteRGB(neutralBase);
    const accentPalette = createPaletteRGB(accentBase);

    it("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        const lightModeColors = idealColorDeltaSet(accentPalette, white, 4.5, accentPalette.source, deltas(0, 6, -4, 0, 1));
        const darkModeColors = idealColorDeltaSet(accentPalette, black, 4.5, accentPalette.source, deltas(0, 6, -4, 0, 1));

        expect(contrast(lightModeColors.hover!, white)).to.be.greaterThan(contrast(lightModeColors.rest!, white));
        expect(contrast(darkModeColors.hover!, black)).to.be.greaterThan(contrast(darkModeColors.rest!, black));
    });

    it("should have accessible rest and hover colors against the background color", (): void => {
        const accentColors = [
            parseColor("#0078D4")!,
            parseColor("#107C10")!,
            parseColor("#5C2D91")!,
            parseColor("#D83B01")!,
            parseColor("#F2C812")!,
        ];

        accentColors.forEach((accent): void => {
            const accentPalette = createPaletteRGB(accent);

            neutralPalette.swatches.forEach((swatch): void => {
                const smallColors = idealColorDeltaSet(accentPalette, swatch, 4.5, accentPalette.source, deltas(0, 6, -4, 0, 1));
                const largeColors = idealColorDeltaSet(accentPalette, swatch, 3, accentPalette.source, deltas(0, 6, -4, 0, 1));
                expect(
                    contrast(swatch, smallColors.rest!)
                    // There are a few states that are impossible to meet contrast on
                ).to.be.gte(4.47);
                expect(
                    contrast(swatch, smallColors.hover!)
                    // There are a few states that are impossible to meet contrast on
                ).to.be.gte(3.7);
                expect(contrast(swatch, largeColors.rest!)).to.be.gte(3);
                expect(contrast(swatch, largeColors.hover!)).to.be.gte(3);
            });
        });
    });

    it("should swap the rest and hover positions when the hover delta is lower than the rest delta", (): void => {
        const normal = idealColorDeltaSet(neutralPalette, white, 3, neutralPalette.source, deltas(0, 2, 0, 0, 0));
        const swapped = idealColorDeltaSet(neutralPalette, white, 3, neutralPalette.source, deltas(2, 0, 0, 0, 0));

        // The same two colors are used, but in the opposite states.
        expect(swapped.rest).to.equal(normal.hover);
        expect(swapped.hover).to.equal(normal.rest);
        expect(swapped.rest).not.to.equal(swapped.hover);
    });

    it("should swap the rest and hover positions in the lighter direction", (): void => {
        const options = { disabledPalette: neutralPalette, direction: PaletteDirection.lighter };
        const normal = idealColorDeltaSet(neutralPalette, black, 3, neutralPalette.source, deltas(0, 2, 0, 0, 0), options);
        const swapped = idealColorDeltaSet(neutralPalette, black, 3, neutralPalette.source, deltas(2, 0, 0, 0, 0), options);

        expect(swapped.rest).to.equal(normal.hover);
        expect(swapped.hover).to.equal(normal.rest);
    });

    it("should use the disabled palette and delta from the reference for the disabled state", (): void => {
        const set = idealColorDeltaSet(neutralPalette, white, 3, neutralPalette.source, deltas(0, 2, 0, 0, 3), {
            disabledPalette: accentPalette,
            direction: PaletteDirection.darker,
        });

        expect(set.disabled).to.equal(swatchAt(accentPalette, closestSwatchIndex(accentPalette, white) + 3));
    });
});

describe("idealColorDeltaSet with only some of the states", (): void => {
    const palette = createPaletteRGB(accentBase);

    it("should have a color only for the states that have a delta, from the same accessible color", (): void => {
        const full = idealColorDeltaSet(palette, white, 4.5, palette.source, deltas(0, 0, 2, 0, 1));
        const sparse = idealColorDeltaSet(palette, white, 4.5, palette.source, { active: 2, disabled: 1 });

        expect(Object.keys(sparse)).to.deep.equal(["active", "disabled"]);
        expect(sparse.active).to.equal(full.active);
        expect(sparse.disabled).to.equal(full.disabled);
    });

    it("should clear a state that has a null delta", (): void => {
        expect(idealColorDeltaSet(palette, white, 4.5, palette.source, { rest: 0, focus: null }).focus).to.be.null;
    });
});
