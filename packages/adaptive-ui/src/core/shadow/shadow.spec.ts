import chai from "chai";
import { DesignTokenMultiValue, DesignTokenRegistry } from "../adaptive-design-tokens.js";
import { Color } from "../color/color.js";
import { StyleProperty } from "../modules/types.js";
import { createTokenShadow, Shadow } from "./index.js";

const { expect } = chai;

const black = Color.fromRgb(0, 0, 0);
const translucent = Color.fromRgb(0, 0, 0, 0.5);

describe("Shadow", () => {
    it("should store the values", () => {
        const shadow = new Shadow(black, 1, 2, 3, 4);

        expect(shadow.color).to.equal(black);
        expect(shadow.xOffset).to.equal(1);
        expect(shadow.yOffset).to.equal(2);
        expect(shadow.blurRadius).to.equal(3);
        expect(shadow.spread).to.equal(4);
    });

    it("should create css with offsets and color", () => {
        expect(new Shadow(black, 1, 2).createCSS()).to.equal("1px 2px #000000");
    });

    it("should include blur radius", () => {
        expect(new Shadow(black, 1, 2, 3).createCSS()).to.equal("1px 2px 3px #000000");
    });

    it("should include blur radius and spread", () => {
        expect(new Shadow(black, 1, 2, 3, 4).createCSS()).to.equal("1px 2px 3px 4px #000000");
    });

    it("should write a zero blur radius when there is a spread", () => {
        expect(new Shadow(black, 1, 2, 0, 3).createCSS()).to.equal("1px 2px 0px 3px #000000");
        expect(new Shadow(black, 1, 2, undefined, 3).createCSS()).to.equal("1px 2px 0px 3px #000000");
    });

    it("should omit a zero blur radius and spread", () => {
        expect(new Shadow(black, 1, 2, 0, 0).createCSS()).to.equal("1px 2px #000000");
    });

    it("should support negative values", () => {
        expect(new Shadow(black, -1, -2, 3, -4).createCSS()).to.equal("-1px -2px 3px -4px #000000");
    });

    it("should write zero offsets", () => {
        expect(new Shadow(black, 0, 0, 4).createCSS()).to.equal("0px 0px 4px #000000");
    });

    it("should use the css representation of a semitransparent color", () => {
        expect(new Shadow(translucent, 0, 2, 4).createCSS()).to.equal("0px 2px 4px rgba(0, 0, 0, 0.5)");
    });
});

describe("createTokenShadow", () => {
    it("should create a shadow token", () => {
        const token = createTokenShadow("shadow-test.token");

        expect(token.name).to.equal("shadow-test.token");
        expect(token.type).to.equal("shadow");
        expect(token.intendedFor).to.deep.equal([StyleProperty.shadow]);
        expect(DesignTokenRegistry.Shared.get("shadow-test.token")).to.equal(token);
    });

    it("should hold a single shadow, multiple shadows, or a string", () => {
        const single = createTokenShadow("shadow-test.single").withDefault(new Shadow(black, 1, 1));
        const multi = createTokenShadow("shadow-test.multi").withDefault(
            new DesignTokenMultiValue<Shadow>(new Shadow(black, 1, 1), new Shadow(black, 2, 2, 4))
        );
        const text = createTokenShadow("shadow-test.string").withDefault("none");

        expect((single.default as Shadow).createCSS()).to.equal("1px 1px #000000");
        expect((multi.default as DesignTokenMultiValue<Shadow>).createCSS()).to.equal("1px 1px #000000, 2px 2px 4px #000000");
        expect(text.default).to.equal("none");
    });
});
