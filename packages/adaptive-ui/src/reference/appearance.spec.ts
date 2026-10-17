import chai from "chai";
import { px } from "design-token-library";
import { createAppearanceLibrary } from "./appearance.js";

const { expect } = chai;

describe("appearance", () => {
    it("should have the values and the names the tokens had", () => {
        const { global, shape } = createAppearanceLibrary().tokens;

        expect(global.designUnit.$value).to.deep.equal(px(4));
        expect(shape.cornerRadius.default.$value).to.deep.equal(px(4));
        expect(shape.cornerRadius.layer.$value).to.deep.equal(px(8));
        expect(shape.strokeThickness.default.$value).to.deep.equal(px(1));
        expect(shape.strokeThickness.focus.$value).to.deep.equal(px(2));
        expect(global.designUnit.name).to.equal("global.designUnit");
        expect(shape.cornerRadius.default.name).to.equal("shape.cornerRadius.default");
        expect(shape.cornerRadius.layer.name).to.equal("shape.cornerRadius.layer");
        expect(shape.strokeThickness.focus.name).to.equal("shape.strokeThickness.focus");
    });
});
