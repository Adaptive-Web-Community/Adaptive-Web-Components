import chai from "chai";
import { Color } from "../color.js";
import { _black, _white } from "../utilities/color-constants.js";
import { blackOrWhiteByContrast } from "./black-or-white-by-contrast.js";

const { expect } = chai;

const middleGrey = Color.parse("#808080")!;

describe("blackOrWhiteByContrast", (): void => {
    it("should return black when background does not meet contrast ratio with white", (): void => {
        const small = blackOrWhiteByContrast(_white, 4.5, false);
        const large = blackOrWhiteByContrast(_white, 3, false);

        expect(small.color).to.equal(_black.color);
        expect(large.color).to.equal(_black.color);
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
});
