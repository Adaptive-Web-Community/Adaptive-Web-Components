import { parseColorHexRGB } from "@microsoft/fast-colors";
import chai from "chai";
import { SwatchRGB } from "../swatch.js";
import { _black, _white } from "../utilities/color-constants.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

const { expect } = chai;

const middleGrey = SwatchRGB.from(parseColorHexRGB("#808080")!);

describe("blackOrWhiteByContrast", (): void => {
    it("should return black when background does not meet contrast ratio with white", (): void => {
        const small = blackOrWhiteByContrast(_white, 4.5, false) as SwatchRGB;
        const large = blackOrWhiteByContrast(_white, 3, false) as SwatchRGB;

        expect(small.r).to.equal(_black.r);
        expect(small.g).to.equal(_black.g);
        expect(small.b).to.equal(_black.b);

        expect(large.r).to.equal(_black.r);
        expect(large.g).to.equal(_black.g);
        expect(large.b).to.equal(_black.b);
    });

    it("should return black when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, true) as SwatchRGB;

        expect(result.r).to.equal(_black.r);
        expect(result.g).to.equal(_black.g);
        expect(result.b).to.equal(_black.b);
    });

    it("should return white when default if either pass", (): void => {
        const result = blackOrWhiteByContrast(middleGrey, 3, false) as SwatchRGB;

        expect(result.r).to.equal(_white.r);
        expect(result.g).to.equal(_white.g);
        expect(result.b).to.equal(_white.b);
    });

    it("should return highest contrast when neither black nor white pass", (): void => {
        const resultDefaultWhite = blackOrWhiteByContrast(middleGrey, 7, false) as SwatchRGB;
        const resultDefaultBlack = blackOrWhiteByContrast(middleGrey, 7, true) as SwatchRGB;

        expect(resultDefaultWhite.r).to.equal(_black.r);
        expect(resultDefaultWhite.g).to.equal(_black.g);
        expect(resultDefaultWhite.b).to.equal(_black.b);

        expect(resultDefaultBlack.r).to.equal(_black.r);
        expect(resultDefaultBlack.g).to.equal(_black.g);
        expect(resultDefaultBlack.b).to.equal(_black.b);
    });
});
