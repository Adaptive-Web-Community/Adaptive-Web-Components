import chai from "chai";
import { convert, DesignToken } from "design-token-library";
import { rgbColor } from "../color/color.js";
import { Shadow, ShadowValue } from "./deprecated.js";
import { shadow } from "./shadow.js";

const { expect } = chai;

describe("deprecated shadow names", () => {
    it("should make a shadow layer with new Shadow", () => {
        const black = rgbColor(0, 0, 0);

        expect(new Shadow(black, 1, 2, 3, 4)).to.deep.equal(shadow(black, 1, 2, 3, 4));
        expect(new Shadow(black, 1, 2)).to.deep.equal(shadow(black, 1, 2));
    });

    it("should be usable as the type of a shadow", () => {
        const value: ShadowValue = new Shadow(rgbColor(0, 0, 0), 0, 4, 8);

        expect(convert(DesignToken.Type.Shadow, value)).to.match(/^0px 4px 8px 0px /);
    });
});
