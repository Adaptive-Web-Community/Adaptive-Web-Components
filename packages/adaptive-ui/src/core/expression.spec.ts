import chai from "chai";
import { DesignToken, hex, Library, px, ref, refs } from "design-token-library";
import { add, divide, evaluate, formatExpression, max, min, multiply, Operand, pow, Reference, round, subtract } from "./expression.js";
import { AdaptiveDesignToken, ExpressionToken } from "./token-types.js";

const { expect } = chai;

interface Tokens {
    a: {
        $type: typeof AdaptiveDesignToken.expression;
        size: ExpressionToken;
        ratio: ExpressionToken;
        double: ExpressionToken;
        snap: ExpressionToken;
        rem: ExpressionToken;
        x: ExpressionToken;
        y: ExpressionToken;
    };
    group: { $type: typeof AdaptiveDesignToken.expression; $root: ExpressionToken };
    color: DesignToken.Color;
}

const a = refs<Tokens>().a;
const create = () =>
    Library.create<Tokens>({
        a: {
            $type: AdaptiveDesignToken.expression,
            size: { $value: px(16) },
            ratio: { $value: 1.5 },
            double: { $value: multiply(a.size, 2) },
            snap: { $value: px(4) },
            rem: { $value: { value: 1, unit: "rem" } },
            // Tokens that use each other, which the library doesn't see, since an expression has the paths of the tokens.
            x: { $value: add(a.y, 1) },
            y: { $value: add(a.x, 1) },
        },
        group: { $type: AdaptiveDesignToken.expression, $root: { $value: px(2) } },
        color: { $type: DesignToken.Type.Color, $value: hex("#ffffff") },
    });
const library = create();
const property = (name: string) => `--${name.replace(/\./g, "-")}`;
// A token by its path, as an expression keeps the ref of one.
const token = (path: string): Reference => ({ ref: path });

describe("an expression", () => {
    it("should keep the path of a ref of the library", () => {
        expect(multiply(a.size, 2)).to.deep.equal({ fn: "multiply", args: [{ ref: "a.size" }, 2] });
        expect(multiply(ref<Operand, Library.TokenValues<Tokens>>("a.size"), 2)).to.deep.equal(multiply(a.size, 2));
    });

    it("should keep the references in the value of a token, which the library doesn't resolve", () => {
        expect(library.tokens.a.double.$value).to.deep.equal({ fn: "multiply", args: [{ ref: "a.size" }, 2] });
    });
});

describe("formatExpression", () => {
    it("should write numbers and dimensions", () => {
        expect(formatExpression(1.5, property)).to.equal("1.5");
        expect(formatExpression(px(16), property)).to.equal("16px");
    });

    it("should write a reference as the custom property of the token", () => {
        expect(formatExpression(token("a.size"), property)).to.equal("var(--a-size)");
    });

    it("should write the operators in a calc", () => {
        expect(formatExpression(add(px(1), px(2)), property)).to.equal("calc(1px + 2px)");
        expect(formatExpression(subtract(px(3), px(2), px(1)), property)).to.equal("calc(3px - 2px - 1px)");
        expect(formatExpression(multiply(a.size, a.ratio), property)).to.equal("calc(var(--a-size) * var(--a-ratio))");
        expect(formatExpression(divide(a.size, 2), property)).to.equal("calc(var(--a-size) / 2)");
    });

    it("should keep the order of operators inside operators with parentheses", () => {
        expect(formatExpression(multiply(add(3, 1), px(4)), property)).to.equal("calc((3 + 1) * 4px)");
        expect(formatExpression(subtract(multiply(3, px(4)), px(1)), property)).to.equal("calc((3 * 4px) - 1px)");
    });

    it("should write the functions as they are", () => {
        expect(formatExpression(pow(a.ratio, 2), property)).to.equal("pow(var(--a-ratio), 2)");
        expect(formatExpression(round(a.size, px(2)), property)).to.equal("round(var(--a-size), 2px)");
        expect(formatExpression(min(px(1), px(2)), property)).to.equal("min(1px, 2px)");
        expect(formatExpression(max(px(1), px(2)), property)).to.equal("max(1px, 2px)");
    });

    it("should write operators in a function without a calc", () => {
        expect(formatExpression(round(multiply(a.size, 1.5), px(2)), property)).to.equal("round(var(--a-size) * 1.5, 2px)");
    });

    it("should write a function in an operator", () => {
        expect(formatExpression(multiply(a.size, pow(a.ratio, 2)), property)).to.equal(
            "calc(var(--a-size) * pow(var(--a-ratio), 2))"
        );
    });
});

describe("evaluate", () => {
    it("should be a number or dimension as it is", () => {
        expect(evaluate(1.5, library)).to.equal(1.5);
        expect(evaluate(px(16), library)).to.deep.equal(px(16));
    });

    it("should get the value of a token", () => {
        expect(evaluate(token("a.size"), library)).to.deep.equal(px(16));
    });

    it("should get the value of the root of a group", () => {
        expect(evaluate(token("group.$root"), library)).to.deep.equal(px(2));
    });

    it("should use the values that the tokens have now", () => {
        const own = create();

        own.tokens.a.size.set(px(10));

        expect(evaluate(token("a.double"), own)).to.deep.equal(px(20));
    });

    it("should get the value of a token that is an expression", () => {
        expect(evaluate(token("a.double"), library)).to.deep.equal(px(32));
    });

    it("should add and subtract numbers and dimensions of the same unit", () => {
        expect(evaluate(add(1, 2, 3), library)).to.equal(6);
        expect(evaluate(add(px(1), px(2)), library)).to.deep.equal(px(3));
        expect(evaluate(subtract(px(5), px(2), px(1)), library)).to.deep.equal(px(2));
    });

    it("should multiply a dimension by a number and divide it by a number or dimension", () => {
        expect(evaluate(multiply(px(4), 3), library)).to.deep.equal(px(12));
        expect(evaluate(multiply(3, px(4)), library)).to.deep.equal(px(12));
        expect(evaluate(divide(px(12), 3), library)).to.deep.equal(px(4));
        expect(evaluate(divide(px(12), px(4)), library)).to.equal(3);
    });

    it("should follow the order of the expression", () => {
        // (3 * 4px) - 1px
        expect(evaluate(subtract(multiply(3, px(4)), px(1)), library)).to.deep.equal(px(11));
    });

    it("should do the math functions", () => {
        expect(evaluate(pow(2, 3), library)).to.equal(8);
        expect(evaluate(min(px(3), px(2)), library)).to.deep.equal(px(2));
        expect(evaluate(max(4, 5, 1), library)).to.equal(5);
        expect(evaluate(round(px(21.6), px(2)), library)).to.deep.equal(px(22));
        expect(evaluate(round(px(12.5), px(1)), library)).to.deep.equal(px(13));
    });

    it("should use the tokens in an expression", () => {
        // round(16px * 1.5, 4px)
        expect(evaluate(round(multiply(a.size, a.ratio), a.snap), library)).to.deep.equal(px(24));
    });

    it("should only round the result, like the browser", () => {
        // 1.25^3 is 1.953125, and 16 * 1.953125 is 31.25, where rounding the power first would make it 31.2496.
        expect(evaluate(multiply(px(16), pow(1.25, 3)), library)).to.deep.equal(px(31.25));
    });

    it("should not have the noise of numbers in a computer", () => {
        expect(evaluate(multiply(px(16), 1.21), library)).to.deep.equal(px(19.36));
        expect(evaluate(add(0.1, 0.2), library)).to.equal(0.3);
    });

    it("should not do what CSS does not", () => {
        expect(() => evaluate(add(1, px(1)), library)).to.throw("Can't add a number and a dimension");
        expect(() => evaluate(add(px(1), { value: 1, unit: "rem" }), library)).to.throw("Can't add px and rem");
        expect(() => evaluate(multiply(px(1), px(2)), library)).to.throw("Can't multiply two dimensions");
        expect(() => evaluate(divide(1, px(2)), library)).to.throw("Can't divide a number by a dimension");
        expect(() => evaluate(divide(px(1), { value: 1, unit: "rem" }), library)).to.throw("Can't divide px and rem");
        expect(() => evaluate(pow(px(1), 2), library)).to.throw("Can't use a dimension for pow");
        expect(() => evaluate(round(px(5), a.rem), library)).to.throw("Can't round px and rem");
    });

    it("should not go on forever for tokens that use each other", () => {
        expect(() => evaluate(token("a.x"), library)).to.throw("Circular reference: a.x → a.y → a.x");
    });

    it("should say when there is no token", () => {
        expect(() => evaluate(token("a.none"), library)).to.throw("There is no token named a.none");
    });

    it("should say when a token isn't a number, a dimension, or an expression", () => {
        expect(() => evaluate(token("color"), library)).to.throw("The token color is not a number, a dimension, or an expression");
    });
});
