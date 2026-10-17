import chai from "chai";
import {
    bodyFontFamily,
    bodyFontStyle,
    bodyFontWeight,
    fontFamily,
    fontStyle,
    fontWeight,
    labelFontFamily,
    labelFontStyle,
    labelFontWeight,
    StandardFontWeight,
    typeRampDefault,
} from "./deprecated.js";
import { createTypographyLibrary } from "./typography.js";

const { expect } = chai;

describe("deprecated typography tokens", () => {
    const { typography } = createTypographyLibrary().tokens;

    it("should be the tokens of the typography group with the names they had", () => {
        expect(fontFamily.name).to.equal("typography.fontFamily.default");
        expect(bodyFontFamily.name).to.equal("typography.fontFamily.body");
        expect(labelFontFamily.name).to.equal("typography.fontFamily.label");
        expect(fontWeight.name).to.equal("typography.fontWeight.default");
        expect(bodyFontWeight.name).to.equal("typography.fontWeight.body");
        expect(labelFontWeight.name).to.equal("typography.fontWeight.label");
        expect(fontStyle.name).to.equal("typography.fontStyle.default");
        expect(bodyFontStyle.name).to.equal("typography.fontStyle.body");
        expect(labelFontStyle.name).to.equal("typography.fontStyle.label");
        expect(typeRampDefault.fontSize.base.name).to.equal("typography.ramp.default.fontSize.base");
    });

    it("should have the values of the tokens of a library", () => {
        expect(fontFamily.$value).to.deep.equal(typography.fontFamily.default.$value);
        expect(bodyFontWeight.$value).to.equal(typography.fontWeight.body.$value);
        expect(labelFontStyle.$value).to.equal(typography.fontStyle.label.$value);
        expect(typeRampDefault.lineHeight.plus1.$value).to.deep.equal(typography.ramp.default.lineHeight.plus1.$value);
    });

    it("should keep the standard font weights", () => {
        expect(StandardFontWeight.Normal).to.equal(400);
        expect(StandardFontWeight.Black).to.equal(900);
    });
});
