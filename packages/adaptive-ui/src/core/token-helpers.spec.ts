import chai from "chai";
import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";
import { DesignTokenRegistry, DesignTokenType, TypedCSSDesignToken, TypedDesignToken } from "./adaptive-design-tokens.js";
import { rgbColor } from "./color/color.js";
import { StyleProperty } from "./modules/types.js";
import {
    createTokenColor,
    createTokenDimension,
    createTokenFontFamily,
    createTokenFontSize,
    createTokenFontStyle,
    createTokenFontVariations,
    createTokenFontWeight,
    createTokenLineHeight,
    createTokenNonCss,
    createTokenNumber,
    createTokenNumberNonStyling,
    createTokenPaint,
    createTokenRecipe,
    createTyped,
} from "./token-helpers.js";

const { expect } = chai;

describe("token-helpers", () => {
    describe("createTyped", () => {
        it("should create a typed css design token", () => {
            const token = createTyped<string>("helpers-test.typed", DesignTokenType.dimension, StyleProperty.gap);

            expect(token).to.be.instanceOf(TypedCSSDesignToken);
            expect(token.type).to.equal("dimension");
            expect(token.intendedFor).to.deep.equal([StyleProperty.gap]);
        });
    });

    describe("createTokenColor", () => {
        it("should create a color token", () => {
            const token = createTokenColor("helpers-test.color", StyleProperty.backgroundFill);

            expect(token).to.be.instanceOf(TypedCSSDesignToken);
            expect(token.type).to.equal("color");
            expect(token.intendedFor).to.deep.equal([StyleProperty.backgroundFill]);
        });

        it("should create a color token without an intended style property", () => {
            expect(createTokenColor("helpers-test.color-none").intendedFor).to.be.undefined;
        });
    });

    describe("createTokenNonCss", () => {
        it("should create a typed token that is not a css token", () => {
            const token = createTokenNonCss<number>("helpers-test.nc", DesignTokenType.number, StyleProperty.opacity);

            expect(token).to.be.instanceOf(TypedDesignToken);
            expect(token).not.to.be.instanceOf(CSSDesignToken);
            expect(token.type).to.equal("number");
            expect(token.intendedFor).to.deep.equal([StyleProperty.opacity]);
        });
    });

    describe("createTokenRecipe", () => {
        it("should create a recipe token with the evaluate function as the default", () => {
            const evaluate = () => "result";
            const token = createTokenRecipe<number, string>("helpers-test.recipe", StyleProperty.shadow, evaluate);

            expect(token.name).to.equal("helpers-test.recipe.recipe");
            expect(token.type).to.equal("recipe");
            expect(token.intendedFor).to.deep.equal([StyleProperty.shadow]);
            expect(token.default!.evaluate).to.equal(evaluate);
        });

        it("should not be a css token", () => {
            const token = createTokenRecipe<number, string>("helpers-test.recipe2", StyleProperty.shadow, () => "");

            expect(token).not.to.be.instanceOf(CSSDesignToken);
        });
    });

    describe("typed token factories", () => {
        const cases: Array<[string, (name: string) => TypedCSSDesignToken<any> | TypedDesignToken<any>, string, StyleProperty[] | undefined, boolean]> = [
            ["createTokenDimension", n => createTokenDimension(n), "dimension", undefined, true],
            ["createTokenFontFamily", createTokenFontFamily, "fontFamily", [StyleProperty.fontFamily], true],
            ["createTokenFontSize", createTokenFontSize, "dimension", [StyleProperty.fontSize], true],
            ["createTokenFontStyle", createTokenFontStyle, "fontStyle", [StyleProperty.fontStyle], true],
            ["createTokenFontVariations", createTokenFontVariations, "fontVariations", [StyleProperty.fontVariationSettings], true],
            ["createTokenFontWeight", createTokenFontWeight, "fontWeight", [StyleProperty.fontWeight], true],
            ["createTokenLineHeight", createTokenLineHeight, "dimension", [StyleProperty.lineHeight], true],
            ["createTokenNumber", n => createTokenNumber(n), "number", undefined, true],
            ["createTokenNumberNonStyling", n => createTokenNumberNonStyling(n), "number", undefined, false],
            ["createTokenPaint", n => createTokenPaint(n), "paint", undefined, true],
        ];

        cases.forEach(([fn, factory, type, intendedFor, css]) => {
            it(`${fn} should create a ${css ? "css " : ""}token of type ${type}`, () => {
                const name = `helpers-test.${fn}`;
                const token = factory(name);

                expect(token.name).to.equal(name);
                expect(token.type).to.equal(type);
                expect(token.intendedFor).to.deep.equal(intendedFor);
                expect(token instanceof CSSDesignToken).to.equal(css);
                expect(DesignTokenRegistry.Shared.get(name)).to.equal(token);
            });
        });

        it("should pass the intended style property for optional factories", () => {
            expect(createTokenDimension("helpers-test.dim-for", StyleProperty.width).intendedFor).to.deep.equal([StyleProperty.width]);
            expect(createTokenNumber("helpers-test.num-for", StyleProperty.opacity).intendedFor).to.deep.equal([StyleProperty.opacity]);
            expect(
                createTokenNumberNonStyling("helpers-test.nonstyle-for", [StyleProperty.opacity, StyleProperty.gap]).intendedFor
            ).to.deep.equal([StyleProperty.opacity, StyleProperty.gap]);
            expect(createTokenPaint("helpers-test.paint-for", StyleProperty.foregroundFill).intendedFor).to.deep.equal([
                StyleProperty.foregroundFill,
            ]);
        });

        it("should hold values of their type", () => {
            expect(createTokenPaint("helpers-test.paint-value").withDefault(rgbColor(1, 0, 0)).default).to.deep.equal(rgbColor(1, 0, 0));
            expect(createTokenFontWeight("helpers-test.weight-value").withDefault(700).default).to.equal(700);
        });
    });
});
