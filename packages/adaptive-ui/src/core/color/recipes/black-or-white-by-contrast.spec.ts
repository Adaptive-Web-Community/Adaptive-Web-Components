import chai from "chai";
import { Color } from "../color.js";
import { _black, _white } from "../utilities/color-constants.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

const { expect } = chai;

const middleGrey = Color.parse("#808080")!;

describe("blackOrWhiteByContrast", (): void => {
    it("should return black when the reference is white and defaulting to white", (): void => {
        const small = blackOrWhiteByContrast(_white, 4.5, false);
        const large = blackOrWhiteByContrast(_white, 3, false);

        expect(small.color).to.equal(_black.color);
        expect(large.color).to.equal(_black.color);
    });

    it("should return white when the reference is black and defaulting to black", (): void => {
        expect(blackOrWhiteByContrast(_black, 4.5, true).color).to.equal(_white.color);
        expect(blackOrWhiteByContrast(_black, 3, true).color).to.equal(_white.color);
    });

    it("should return black when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, true);

        expect(result.color).to.equal(_black.color);
    });

    it("should return white when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, false);

        expect(result.color).to.equal(_white.color);
    });

    it("should return highest contrast when neither black nor white pass", (): void => {
        const resultDefaultWhite = blackOrWhiteByContrast(middleGrey, 7, false);
        const resultDefaultBlack = blackOrWhiteByContrast(middleGrey, 7, true);

        expect(resultDefaultWhite.color).to.equal(_black.color);
        expect(resultDefaultBlack.color).to.equal(_black.color);
    });

    it("should return white when it has the highest contrast and neither pass", (): void => {
        const darkGrey = Color.parse("#404040")!;
        const unreachable = 100;

        expect(blackOrWhiteByContrast(darkGrey, unreachable, false).color).to.equal(_white.color);
        expect(blackOrWhiteByContrast(darkGrey, unreachable, true).color).to.equal(_white.color);
    });

    it("should only return the exact black or white colors", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, true);

        expect(result).to.equal(_black);
    });

    it("should meet the minimum contrast when possible", (): void => {
        ["#000000", "#333333", "#808080", "#cccccc", "#ffffff", "#0078D4"].forEach(hex => {
            const color = Color.parse(hex)!;

            [3, 4.5].forEach(minContrast => {
                [true, false].forEach(defaultBlack => {
                    const result = blackOrWhiteByContrast(color, minContrast, defaultBlack);
                    const best = Math.max(color.contrast(_black), color.contrast(_white));

                    expect(color.contrast(result), `${hex} ${minContrast} ${defaultBlack}`).to.be.gte(
                        Math.min(minContrast, best)
                    );
                });
            });
        });
    });
});
