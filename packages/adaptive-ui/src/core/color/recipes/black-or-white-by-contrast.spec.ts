import chai from "chai";
import { parseColor } from "../color.js";
import { black, white } from "../utilities/color-constants.js";
import { contrast } from "../utilities/relative-luminance.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

const { expect } = chai;

const middleGrey = parseColor("#808080")!;

describe("blackOrWhiteByContrast", (): void => {
    it("should return black when the reference is white and defaulting to white", (): void => {
        const small = blackOrWhiteByContrast(white, 4.5, false);
        const large = blackOrWhiteByContrast(white, 3, false);

        expect(small).to.equal(black);
        expect(large).to.equal(black);
    });

    it("should return white when the reference is black and defaulting to black", (): void => {
        expect(blackOrWhiteByContrast(black, 4.5, true)).to.equal(white);
        expect(blackOrWhiteByContrast(black, 3, true)).to.equal(white);
    });

    it("should return black when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, true);

        expect(result).to.equal(black);
    });

    it("should return white when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, false);

        expect(result).to.equal(white);
    });

    it("should return highest contrast when neither black nor white pass", (): void => {
        const resultDefaultWhite = blackOrWhiteByContrast(middleGrey, 7, false);
        const resultDefaultBlack = blackOrWhiteByContrast(middleGrey, 7, true);

        expect(resultDefaultWhite).to.equal(black);
        expect(resultDefaultBlack).to.equal(black);
    });

    it("should return white when it has the highest contrast and neither pass", (): void => {
        const darkGrey = parseColor("#404040")!;
        const unreachable = 100;

        expect(blackOrWhiteByContrast(darkGrey, unreachable, false)).to.equal(white);
        expect(blackOrWhiteByContrast(darkGrey, unreachable, true)).to.equal(white);
    });

    it("should only return the exact black or white colors", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, true);

        expect(result).to.equal(black);
    });

    it("should meet the minimum contrast when possible", (): void => {
        ["#000000", "#333333", "#808080", "#cccccc", "#ffffff", "#0078D4"].forEach(hex => {
            const color = parseColor(hex)!;

            [3, 4.5].forEach(minContrast => {
                [true, false].forEach(defaultBlack => {
                    const result = blackOrWhiteByContrast(color, minContrast, defaultBlack);
                    const best = Math.max(contrast(color, black), contrast(color, white));

                    expect(contrast(color, result), `${hex} ${minContrast} ${defaultBlack}`).to.be.gte(
                        Math.min(minContrast, best)
                    );
                });
            });
        });
    });
});
