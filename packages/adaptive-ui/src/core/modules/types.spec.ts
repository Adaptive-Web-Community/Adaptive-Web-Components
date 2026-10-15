import chai from "chai";
import {
    Focus,
    Interactivity,
    StyleProperty,
    StylePropertyShorthand,
} from "./types.js";

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

describe("Interactivity", () => {
    it("should define interactive and disabled conditions for an attribute", () => {
        expect(Interactivity.disabledAttribute).to.deep.equal({ interactive: ":not([disabled])", disabled: "[disabled]" });
    });

    it("should define interactive and disabled conditions for a class", () => {
        expect(Interactivity.disabledClass).to.deep.equal({ interactive: ":not(.disabled)", disabled: ".disabled" });
    });

    it("should define an interactive condition for href only", () => {
        expect(Interactivity.hrefAttribute).to.deep.equal({ interactive: "[href]" });
    });

    it("should define always interactive as an empty condition", () => {
        expect(Interactivity.always).to.deep.equal({ interactive: "" });
    });

    it("should define never interactive as no conditions", () => {
        expect(Interactivity.never).to.deep.equal({});
    });
});

describe("Focus", () => {
    it("should focus the context", () => {
        expect(Focus.contextFocused()).to.deep.equal({ focusTarget: { ignoreInteractivity: true } });
    });

    it("should show focus on a part when the context has focus", () => {
        const focus = Focus.contextChildFocused(".indicator");

        expect(focus.focusTarget).to.deep.equal({ stateOnContext: true, part: ".indicator", ignoreInteractivity: true });
        expect(focus.resetTarget).to.deep.equal({ ignoreInteractivity: true });
    });

    it("should focus a part", () => {
        const focus = Focus.partFocused(".control");

        expect(focus.focusTarget).to.deep.equal({ part: ".control", ignoreInteractivity: true });
        expect(focus.resetTarget).to.be.undefined;
    });

    it("should show focus on a part when another part has focus within", () => {
        const focus = Focus.partWithin(".indicator", ".input");

        expect(focus.focusTarget).to.deep.equal({
            part: ".indicator",
            focus: ":focus-within",
            ignoreInteractivity: true,
        });
        expect(focus.resetTarget).to.deep.equal({ part: ".input", ignoreInteractivity: true });
    });

    it("should return a new definition each time", () => {
        expect(Focus.contextFocused()).not.to.equal(Focus.contextFocused());
    });
});
