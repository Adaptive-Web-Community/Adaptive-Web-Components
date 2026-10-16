import chai from "chai";
import { DesignToken, Library, px, refs } from "design-token-library";
import { evaluate, formatExpression, multiply } from "../expression.js";
import { StyleProperty } from "../modules/types.js";
import { propertyResolver } from "../token-css.js";
import { getIntendedFor } from "../token-metadata.js";
import { FontVariationsToken } from "../token-types.js";
import { typeRamp, TypeRampTokens, typeRampPositions, TypeScaleTokens, typeScale } from "./type-ramp.js";

const { expect } = chai;

interface Tokens {
    ramp: TypeRampTokens;
    scale: TypeScaleTokens;
    other: TypeScaleTokens;
}

const config = (n: number) => ({ fontSize: px(n), lineHeight: px(n + 6), lineHeightMultiline: px(n + 10) });

const tokenRefs = refs<Tokens>();
const createLibrary = (scale = typeScale(tokenRefs.scale, px(16), 1.25)) =>
    Library.create<Tokens>({
        ramp: typeRamp({
            minus2: config(8),
            minus1: config(10),
            base: config(14),
            plus1: config(16),
            plus2: config(18),
            plus3: config(20),
            plus4: config(24),
            plus5: config(28),
            plus6: config(32),
        }),
        scale,
        other: typeScale(tokenRefs.other, px(12), 1.1),
    });

// The size of a position of a scale, and its line height, calculated independently of the implementation.
const size = (base: number, multiplier: number, position: number) => base * Math.pow(multiplier, position);
const snap = (value: number, to: number) => Math.round(value / to) * to;
const steps = [-2, -1, 0, 1, 2, 3, 4, 5, 6];

describe("typeRamp", () => {
    const library = createLibrary();
    const ramp = library.tokens.ramp;

    it("should name the tokens from the property and position", () => {
        typeRampPositions.forEach(p => {
            expect(ramp.fontSize[p].name).to.equal(`ramp.fontSize.${p}`);
            expect(ramp.lineHeight[p].name).to.equal(`ramp.lineHeight.${p}`);
            expect(ramp.lineHeightMultiline[p].name).to.equal(`ramp.lineHeightMultiline.${p}`);
            expect(ramp.fontVariations[p].name).to.equal(`ramp.fontVariations.${p}`);
        });
    });

    it("should create every position in order", () => {
        const sizes = typeRampPositions.map(p => ramp.fontSize[p].$value);

        expect(sizes).to.deep.equal([8, 10, 14, 16, 18, 20, 24, 28, 32].map(px));
    });

    it("should map the config of each position to that position", () => {
        expect(ramp.lineHeight.minus2.$value).to.deep.equal(px(14));
        expect(ramp.lineHeight.base.$value).to.deep.equal(px(20));
        expect(ramp.lineHeightMultiline.plus6.$value).to.deep.equal(px(42));
    });

    it("should set the types", () => {
        expect(ramp.fontSize.base.$type).to.equal("expression");
        expect(ramp.lineHeight.base.$type).to.equal("expression");
        expect(ramp.lineHeightMultiline.base.$type).to.equal("expression");
        expect(ramp.fontVariations.base.$type).to.equal("fontVariations");
    });

    it("should set the intended style properties", () => {
        expect(getIntendedFor(ramp.fontSize.base)).to.deep.equal([StyleProperty.fontSize]);
        expect(getIntendedFor(ramp.lineHeight.base)).to.deep.equal([StyleProperty.lineHeight]);
        expect(getIntendedFor(ramp.lineHeightMultiline.base)).to.deep.equal([StyleProperty.lineHeight]);
        expect(getIntendedFor(ramp.fontVariations.base)).to.deep.equal([]);
    });

    it("should default font variations to empty", () => {
        const variations: FontVariationsToken["$value"][] = typeRampPositions.map(p => ramp.fontVariations[p].$value);

        expect(variations).to.deep.equal(typeRampPositions.map(() => ""));
    });

    it("should be a ramp that a position of can be an expression, like a scale is", () => {
        const extended = library.extend({
            ramp: { fontSize: { plus1: { $value: multiply(tokenRefs.ramp.fontSize.base, 2) } } },
        });

        expect(evaluate(extended.tokens.ramp.fontSize.plus1.$value, extended)).to.deep.equal(px(28));
        expect(formatExpression(extended.tokens.ramp.fontSize.plus1.$value, propertyResolver(extended))).to.equal(
            "calc(var(--ramp-fontSize-base) * 2)"
        );
    });

    it("should have a value that can be set", () => {
        const own = createLibrary();

        own.tokens.ramp.fontSize.base.set(px(15));

        expect(own.tokens.ramp.fontSize.base.$value).to.deep.equal(px(15));
        expect(ramp.fontSize.base.$value).to.deep.equal(px(14));
    });
});

describe("typeScale", () => {
    it("should be a ramp, so one can be used where the other is", () => {
        const asRamp: TypeRampTokens = createLibrary().tokens.scale;

        expect(asRamp.fontSize.base.$type).to.equal("expression");
    });

    const library = createLibrary();
    const scale = library.tokens.scale;
    // The value of a token of a library, which is calculated from the tokens it is an expression of.
    const valueIn = (of: typeof library) => (token: { $value: any }) => evaluate(token.$value, of);
    const value = valueIn(library);
    const dimension = (token: { $value: any }) => (value(token) as DesignToken.Values.Dimension).value;
    const css = (token: { $value: any }) => formatExpression(token.$value, propertyResolver(library));

    it("should create tokens for the scale configuration", () => {
        expect(scale.multiplier.name).to.equal("scale.multiplier");
        expect(scale.multiplier.$value).to.equal(1.25);
        expect(scale.lineHeightRatio.name).to.equal("scale.lineHeightRatio");
        expect(scale.lineHeightMultilineRatio.name).to.equal("scale.lineHeightMultilineRatio");
        expect(scale.lineHeightSnap.name).to.equal("scale.lineHeightSnap");
    });

    it("should default the line height configuration", () => {
        expect(scale.lineHeightRatio.$value).to.equal(1.3);
        expect(scale.lineHeightMultilineRatio.$value).to.equal(1.6);
        expect(scale.lineHeightSnap.$value).to.deep.equal(px(2));
    });

    it("should accept the line height configuration", () => {
        const custom = createLibrary(typeScale(tokenRefs.scale, px(10), 1.5, 1.1, 1.9, px(4)));
        const tokens = custom.tokens.scale;

        expect(tokens.lineHeightRatio.$value).to.equal(1.1);
        expect(tokens.lineHeightMultilineRatio.$value).to.equal(1.9);
        expect(tokens.lineHeightSnap.$value).to.deep.equal(px(4));
        expect(valueIn(custom)(tokens.lineHeight.base)).to.deep.equal(px(12));
        expect(valueIn(custom)(tokens.lineHeightMultiline.base)).to.deep.equal(px(20));
    });

    it("should use the base size for the base position", () => {
        expect(scale.fontSize.base.$value).to.deep.equal(px(16));
        expect(value(scale.fontSize.base)).to.deep.equal(px(16));
    });

    it("should scale smaller positions by division", () => {
        expect(value(scale.fontSize.minus1)).to.deep.equal(px(12.8));
        expect(value(scale.fontSize.minus2)).to.deep.equal(px(10.24));
    });

    it("should scale larger positions by multiplication", () => {
        expect(value(scale.fontSize.plus1)).to.deep.equal(px(20));
        expect(value(scale.fontSize.plus2)).to.deep.equal(px(25));
        expect(value(scale.fontSize.plus3)).to.deep.equal(px(31.25));
        expect(value(scale.fontSize.plus4)).to.deep.equal(px(39.0625));
        expect(dimension(scale.fontSize.plus5)).to.be.approximately(48.8281, 0.00005);
        expect(dimension(scale.fontSize.plus6)).to.be.approximately(61.0352, 0.00005);
    });

    it("should calculate every position from the base and the multiplier", () => {
        typeRampPositions.forEach((p, i) => {
            expect(dimension(scale.fontSize[p]), p).to.be.approximately(size(16, 1.25, steps[i]), 0.0001);
        });
    });

    it("should calculate line heights from the font size of each position, rounded to the snap", () => {
        typeRampPositions.forEach((p, i) => {
            const fontSize = size(16, 1.25, steps[i]);

            expect(value(scale.lineHeight[p]), `${p} lineHeight`).to.deep.equal(px(snap(fontSize * 1.3, 2)));
            expect(value(scale.lineHeightMultiline[p]), `${p} lineHeightMultiline`).to.deep.equal(px(snap(fontSize * 1.6, 2)));
        });
    });

    it("should round a line height halfway between multiples up, as CSS does", () => {
        // 10px * 1.25 = 12.5px, halfway between 12px and 13px with a 1px snap.
        const halves = createLibrary(typeScale(tokenRefs.scale, px(10), 1.25, 1.25, 1.25, px(1)));

        expect(valueIn(halves)(halves.tokens.scale.lineHeight.base)).to.deep.equal(px(13));
    });

    describe("as CSS", () => {
        const base = "var(--scale-fontSize-base)";
        const multiplier = "var(--scale-multiplier)";

        it("should be a calculation of the custom properties of the tokens it is calculated from", () => {
            expect(css(scale.fontSize.plus1)).to.equal(`calc(${base} * ${multiplier})`);
            expect(css(scale.fontSize.plus2)).to.equal(`calc(${base} * pow(${multiplier}, 2))`);
            expect(css(scale.fontSize.plus6)).to.equal(`calc(${base} * pow(${multiplier}, 6))`);
            expect(css(scale.fontSize.minus1)).to.equal(`calc(${base} / ${multiplier})`);
            expect(css(scale.fontSize.minus2)).to.equal(`calc(${base} / pow(${multiplier}, 2))`);
        });

        it("should round the line heights to the snap", () => {
            expect(css(scale.lineHeight.plus1)).to.equal(
                "round(var(--scale-fontSize-plus1) * var(--scale-lineHeightRatio), var(--scale-lineHeightSnap))"
            );
            expect(css(scale.lineHeightMultiline.minus2)).to.equal(
                "round(var(--scale-fontSize-minus2) * var(--scale-lineHeightMultilineRatio), var(--scale-lineHeightSnap))"
            );
        });
    });

    it("should set the intended style properties", () => {
        expect(getIntendedFor(scale.fontSize.plus1)).to.deep.equal([StyleProperty.fontSize]);
        expect(getIntendedFor(scale.lineHeight.plus1)).to.deep.equal([StyleProperty.lineHeight]);
        expect(getIntendedFor(scale.lineHeightSnap)).to.deep.equal([]);
    });

    it("should have values that follow the tokens they are calculated from", () => {
        const own = createLibrary();
        const tokens = own.tokens.scale;
        const before = tokens.fontSize.plus1.$value;
        const own_value = valueIn(own);

        tokens.multiplier.set(2);
        tokens.fontSize.base.set(px(20));
        tokens.lineHeightRatio.set(1.5);
        tokens.lineHeightSnap.set(px(1));

        // The expression itself is the same, it is the values of the tokens in it that changed.
        expect(tokens.fontSize.plus1.$value).to.deep.equal(before);
        expect(own_value(tokens.fontSize.plus1)).to.deep.equal(px(40));
        expect(own_value(tokens.lineHeight.plus1)).to.deep.equal(px(60));
        expect(own_value(tokens.fontSize.minus1)).to.deep.equal(px(10));
    });

    it("should change in an extension only", () => {
        const extended = library.extend({ scale: { fontSize: { base: { $value: px(20) } } } });
        const inExtension = valueIn(extended);

        expect(inExtension(extended.tokens.scale.fontSize.plus1)).to.deep.equal(px(25));
        expect(inExtension(extended.tokens.scale.lineHeight.plus1)).to.deep.equal(px(32));
        expect(value(scale.fontSize.plus1)).to.deep.equal(px(20));
    });

    it("should not share tokens between groups", () => {
        expect(dimension(library.tokens.other.fontSize.plus1)).to.be.approximately(13.2, 0.0001);
        expect(value(scale.fontSize.plus1)).to.deep.equal(px(20));
    });

    it("should not be able to round to a snap of another unit", () => {
        const mixed = createLibrary(typeScale(tokenRefs.scale, px(16), 1.25, 1.3, 1.6, { value: 0.125, unit: "rem" }));

        expect(() => valueIn(mixed)(mixed.tokens.scale.lineHeight.base)).to.throw("Can't round px and rem");
    });

    it("should have tokens of the types of the library", () => {
        const type: DesignToken.Type = DesignToken.Type.Number;

        expect(scale.multiplier.$type).to.equal(type);
        expect(scale.fontSize.base.$type).to.equal("expression");
        expect(scale.lineHeightSnap.$type).to.equal(DesignToken.Type.Dimension);
    });
});
