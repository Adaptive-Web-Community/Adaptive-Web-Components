import chai from "chai";
import { StyleProperty, StylePropertyShorthand } from "./properties.js";

const { expect } = chai;

describe("StyleProperty", () => {
    it("should have values that match their keys", () => {
        Object.entries(StyleProperty).forEach(([key, value]) => {
            expect(value).to.equal(key);
        });
    });
});

describe("StylePropertyShorthand", () => {
    it("should only contain valid StyleProperty values", () => {
        const valid = Object.values(StyleProperty) as string[];

        Object.entries(StylePropertyShorthand).forEach(([key, props]) => {
            props.forEach(prop => expect(valid, `${key} includes ${prop}`).to.include(prop));
        });
    });

    it("should not contain duplicates", () => {
        Object.entries(StylePropertyShorthand).forEach(([key, props]) => {
            expect(new Set(props).size, key).to.equal(props.length);
        });
    });

    it("should expand `all` side shorthands to four sides in top, right, bottom, left order", () => {
        expect(StylePropertyShorthand.borderFill).to.deep.equal([
            "borderFillTop", "borderFillRight", "borderFillBottom", "borderFillLeft",
        ]);
        expect(StylePropertyShorthand.borderThickness).to.deep.equal([
            "borderThicknessTop", "borderThicknessRight", "borderThicknessBottom", "borderThicknessLeft",
        ]);
        expect(StylePropertyShorthand.borderStyle).to.deep.equal([
            "borderStyleTop", "borderStyleRight", "borderStyleBottom", "borderStyleLeft",
        ]);
        expect(StylePropertyShorthand.margin).to.deep.equal([
            "marginTop", "marginRight", "marginBottom", "marginLeft",
        ]);
        expect(StylePropertyShorthand.padding).to.deep.equal([
            "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        ]);
    });

    it("should expand corner radius to each corner", () => {
        expect(StylePropertyShorthand.cornerRadius).to.deep.equal([
            "cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft",
        ]);
    });

    it("should expand horizontal and vertical shorthands", () => {
        expect(StylePropertyShorthand.marginHorizontal).to.deep.equal(["marginRight", "marginLeft"]);
        expect(StylePropertyShorthand.marginVertical).to.deep.equal(["marginTop", "marginBottom"]);
        expect(StylePropertyShorthand.paddingHorizontal).to.deep.equal(["paddingRight", "paddingLeft"]);
        expect(StylePropertyShorthand.paddingVertical).to.deep.equal(["paddingTop", "paddingBottom"]);
    });

});
