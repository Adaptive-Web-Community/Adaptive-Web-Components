import chai from "chai";
import { stylePropertyToCssProperty } from "./css.js";
import { StyleProperty } from "../properties.js";

const { expect } = chai;

describe("stylePropertyToCssProperty", () => {
    it("should map every StyleProperty to a css property", () => {
        Object.values(StyleProperty).forEach(property => {
            const css = stylePropertyToCssProperty(property);

            expect(css, property).to.be.a("string");
            expect(css, property).to.match(/^[a-z]+(-[a-z]+)*$/);
        });
    });

    it("should map fills", () => {
        expect(stylePropertyToCssProperty(StyleProperty.backgroundFill)).to.equal("background");
        expect(stylePropertyToCssProperty(StyleProperty.foregroundFill)).to.equal("color");
    });

    it("should map borders", () => {
        expect(stylePropertyToCssProperty(StyleProperty.borderFillTop)).to.equal("border-top-color");
        expect(stylePropertyToCssProperty(StyleProperty.borderFillRight)).to.equal("border-right-color");
        expect(stylePropertyToCssProperty(StyleProperty.borderFillBottom)).to.equal("border-bottom-color");
        expect(stylePropertyToCssProperty(StyleProperty.borderFillLeft)).to.equal("border-left-color");
        expect(stylePropertyToCssProperty(StyleProperty.borderThicknessTop)).to.equal("border-top-width");
        expect(stylePropertyToCssProperty(StyleProperty.borderThicknessRight)).to.equal("border-right-width");
        expect(stylePropertyToCssProperty(StyleProperty.borderThicknessBottom)).to.equal("border-bottom-width");
        expect(stylePropertyToCssProperty(StyleProperty.borderThicknessLeft)).to.equal("border-left-width");
        expect(stylePropertyToCssProperty(StyleProperty.borderStyleTop)).to.equal("border-top-style");
        expect(stylePropertyToCssProperty(StyleProperty.borderStyleRight)).to.equal("border-right-style");
        expect(stylePropertyToCssProperty(StyleProperty.borderStyleBottom)).to.equal("border-bottom-style");
        expect(stylePropertyToCssProperty(StyleProperty.borderStyleLeft)).to.equal("border-left-style");
    });

    it("should map corner radius from the corner position", () => {
        expect(stylePropertyToCssProperty(StyleProperty.cornerRadiusTopLeft)).to.equal("border-top-left-radius");
        expect(stylePropertyToCssProperty(StyleProperty.cornerRadiusTopRight)).to.equal("border-top-right-radius");
        expect(stylePropertyToCssProperty(StyleProperty.cornerRadiusBottomRight)).to.equal("border-bottom-right-radius");
        expect(stylePropertyToCssProperty(StyleProperty.cornerRadiusBottomLeft)).to.equal("border-bottom-left-radius");
    });

    it("should map typography", () => {
        expect(stylePropertyToCssProperty(StyleProperty.fontFamily)).to.equal("font-family");
        expect(stylePropertyToCssProperty(StyleProperty.fontSize)).to.equal("font-size");
        expect(stylePropertyToCssProperty(StyleProperty.fontWeight)).to.equal("font-weight");
        expect(stylePropertyToCssProperty(StyleProperty.fontStyle)).to.equal("font-style");
        expect(stylePropertyToCssProperty(StyleProperty.fontVariationSettings)).to.equal("font-variation-settings");
        expect(stylePropertyToCssProperty(StyleProperty.letterSpacing)).to.equal("letter-spacing");
        expect(stylePropertyToCssProperty(StyleProperty.lineHeight)).to.equal("line-height");
    });

    it("should map spacing and sizing", () => {
        expect(stylePropertyToCssProperty(StyleProperty.marginTop)).to.equal("margin-top");
        expect(stylePropertyToCssProperty(StyleProperty.marginRight)).to.equal("margin-right");
        expect(stylePropertyToCssProperty(StyleProperty.marginBottom)).to.equal("margin-bottom");
        expect(stylePropertyToCssProperty(StyleProperty.marginLeft)).to.equal("margin-left");
        expect(stylePropertyToCssProperty(StyleProperty.paddingTop)).to.equal("padding-top");
        expect(stylePropertyToCssProperty(StyleProperty.paddingRight)).to.equal("padding-right");
        expect(stylePropertyToCssProperty(StyleProperty.paddingBottom)).to.equal("padding-bottom");
        expect(stylePropertyToCssProperty(StyleProperty.paddingLeft)).to.equal("padding-left");
        expect(stylePropertyToCssProperty(StyleProperty.gap)).to.equal("gap");
        expect(stylePropertyToCssProperty(StyleProperty.height)).to.equal("height");
        expect(stylePropertyToCssProperty(StyleProperty.minHeight)).to.equal("min-height");
        expect(stylePropertyToCssProperty(StyleProperty.maxHeight)).to.equal("max-height");
        expect(stylePropertyToCssProperty(StyleProperty.width)).to.equal("width");
        expect(stylePropertyToCssProperty(StyleProperty.minWidth)).to.equal("min-width");
        expect(stylePropertyToCssProperty(StyleProperty.maxWidth)).to.equal("max-width");
    });

    it("should map layout", () => {
        expect(stylePropertyToCssProperty(StyleProperty.layoutInner)).to.equal("display");
        expect(stylePropertyToCssProperty(StyleProperty.layoutDirection)).to.equal("flex-direction");
        expect(stylePropertyToCssProperty(StyleProperty.layoutMainAxisAlignItems)).to.equal("justify-content");
        expect(stylePropertyToCssProperty(StyleProperty.layoutCrossAxisAlignItems)).to.equal("align-items");
        expect(stylePropertyToCssProperty(StyleProperty.layoutWrap)).to.equal("flex-wrap");
    });

    it("should map effects and interaction", () => {
        expect(stylePropertyToCssProperty(StyleProperty.opacity)).to.equal("opacity");
        expect(stylePropertyToCssProperty(StyleProperty.cursor)).to.equal("cursor");
        expect(stylePropertyToCssProperty(StyleProperty.shadow)).to.equal("box-shadow");
    });

    it("should map outlines", () => {
        expect(stylePropertyToCssProperty(StyleProperty.outlineColor)).to.equal("outline-color");
        expect(stylePropertyToCssProperty(StyleProperty.outlineOffset)).to.equal("outline-offset");
        expect(stylePropertyToCssProperty(StyleProperty.outlineStyle)).to.equal("outline-style");
        expect(stylePropertyToCssProperty(StyleProperty.outlineThickness)).to.equal("outline-width");
    });

    it("should map each StyleProperty to a unique css property", () => {
        const seen = new Map<string, string>();
        Object.values(StyleProperty).forEach(property => {
            const css = stylePropertyToCssProperty(property);
            expect(seen.has(css), `${property} and ${seen.get(css)} both map to ${css}`).to.be.false;
            seen.set(css, property);
        });
    });
});
