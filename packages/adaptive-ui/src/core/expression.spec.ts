import chai from "chai";
import { px } from "design-token-library";
import { add, divide, evaluate, formatExpression, max, min, multiply, Operand, pow, ref, round, subtract } from "./expression.js";

const { expect } = chai;

// A token of a library has a name, which is what a reference is by.
const token = (name: string) => ({ name, $value: undefined });
const property = (name: string) => `--${name.replace(/\./g, "-")}`;
const values: Record<string, Operand> = {
    "a.size": px(16),
    "a.ratio": 1.5,
    "a.double": multiply(ref(token("a.size")), 2),
    "a.snap": px(4),
    "a.rem": { value: 1, unit: "rem" },
};
const resolve = (token: string) => {
    if (!(token in values)) {
        throw new Error(`There is no token named ${token}`);
    }
    return values[token];
};

describe("ref", () => {
    it("should refer to a token by its name", () => {
        expect(ref(token("a.size"))).to.deep.equal({ ref: "a.size" });
    });

    it("should only refer to a token", () => {
        // @ts-expect-error a name is not a token
        expect(() => ref("a.size")).to.throw("A reference is to a token of a library");
        // Something with a value is a token as far as the types go, but is not one of a library.
        expect(() => ref({ $value: 1 })).to.throw("A reference is to a token of a library");
    });
});

describe("formatExpression", () => {
    it("should write numbers and dimensions", () => {
        expect(formatExpression(1.5, property)).to.equal("1.5");
        expect(formatExpression(px(16), property)).to.equal("16px");
    });

    it("should write a reference as the custom property of the token", () => {
        expect(formatExpression(ref(token("a.size")), property)).to.equal("var(--a-size)");
    });

    it("should write the operators in a calc", () => {
        expect(formatExpression(add(px(1), px(2)), property)).to.equal("calc(1px + 2px)");
        expect(formatExpression(subtract(px(3), px(2), px(1)), property)).to.equal("calc(3px - 2px - 1px)");
        expect(formatExpression(multiply(ref(token("a.size")), ref(token("a.ratio"))), property)).to.equal("calc(var(--a-size) * var(--a-ratio))");
        expect(formatExpression(divide(ref(token("a.size")), 2), property)).to.equal("calc(var(--a-size) / 2)");
    });

    it("should keep the order of operators inside operators with parentheses", () => {
        expect(formatExpression(multiply(add(3, 1), px(4)), property)).to.equal("calc((3 + 1) * 4px)");
        expect(formatExpression(subtract(multiply(3, px(4)), px(1)), property)).to.equal("calc((3 * 4px) - 1px)");
    });

    it("should write the functions as they are", () => {
        expect(formatExpression(pow(ref(token("a.ratio")), 2), property)).to.equal("pow(var(--a-ratio), 2)");
        expect(formatExpression(round(ref(token("a.size")), px(2)), property)).to.equal("round(var(--a-size), 2px)");
        expect(formatExpression(min(px(1), px(2)), property)).to.equal("min(1px, 2px)");
        expect(formatExpression(max(px(1), px(2)), property)).to.equal("max(1px, 2px)");
    });

    it("should write operators in a function without a calc", () => {
        expect(formatExpression(round(multiply(ref(token("a.size")), 1.5), px(2)), property)).to.equal("round(var(--a-size) * 1.5, 2px)");
    });

    it("should write a function in an operator", () => {
        expect(formatExpression(multiply(ref(token("a.size")), pow(ref(token("a.ratio")), 2)), property)).to.equal(
            "calc(var(--a-size) * pow(var(--a-ratio), 2))"
        );
    });
});

describe("evaluate", () => {
    it("should be a number or dimension as it is", () => {
        expect(evaluate(1.5, resolve)).to.equal(1.5);
        expect(evaluate(px(16), resolve)).to.deep.equal(px(16));
    });

    it("should get the value of a token", () => {
        expect(evaluate(ref(token("a.size")), resolve)).to.deep.equal(px(16));
    });

    it("should get the value of a token that is an expression", () => {
        expect(evaluate(ref(token("a.double")), resolve)).to.deep.equal(px(32));
    });

    it("should add and subtract numbers and dimensions of the same unit", () => {
        expect(evaluate(add(1, 2, 3), resolve)).to.equal(6);
        expect(evaluate(add(px(1), px(2)), resolve)).to.deep.equal(px(3));
        expect(evaluate(subtract(px(5), px(2), px(1)), resolve)).to.deep.equal(px(2));
    });

    it("should multiply a dimension by a number and divide it by a number or dimension", () => {
        expect(evaluate(multiply(px(4), 3), resolve)).to.deep.equal(px(12));
        expect(evaluate(multiply(3, px(4)), resolve)).to.deep.equal(px(12));
        expect(evaluate(divide(px(12), 3), resolve)).to.deep.equal(px(4));
        expect(evaluate(divide(px(12), px(4)), resolve)).to.equal(3);
    });

    it("should follow the order of the expression", () => {
        // (3 * 4px) - 1px
        expect(evaluate(subtract(multiply(3, px(4)), px(1)), resolve)).to.deep.equal(px(11));
    });

    it("should do the math functions", () => {
        expect(evaluate(pow(2, 3), resolve)).to.equal(8);
        expect(evaluate(min(px(3), px(2)), resolve)).to.deep.equal(px(2));
        expect(evaluate(max(4, 5, 1), resolve)).to.equal(5);
        expect(evaluate(round(px(21.6), px(2)), resolve)).to.deep.equal(px(22));
        expect(evaluate(round(px(12.5), px(1)), resolve)).to.deep.equal(px(13));
    });

    it("should use the tokens in an expression", () => {
        // round(16px * 1.5, 4px)
        expect(evaluate(round(multiply(ref(token("a.size")), ref(token("a.ratio"))), ref(token("a.snap"))), resolve)).to.deep.equal(px(24));
    });

    it("should only round the result, like the browser", () => {
        // 1.25^3 is 1.953125, and 16 * 1.953125 is 31.25, where rounding the power first would make it 31.2496.
        expect(evaluate(multiply(px(16), pow(1.25, 3)), resolve)).to.deep.equal(px(31.25));
    });

    it("should not have the noise of numbers in a computer", () => {
        expect(evaluate(multiply(px(16), 1.21), resolve)).to.deep.equal(px(19.36));
        expect(evaluate(add(0.1, 0.2), resolve)).to.equal(0.3);
    });

    it("should not do what CSS does not", () => {
        expect(() => evaluate(add(1, px(1)), resolve)).to.throw("Can't add a number and a dimension");
        expect(() => evaluate(add(px(1), { value: 1, unit: "rem" }), resolve)).to.throw("Can't add px and rem");
        expect(() => evaluate(multiply(px(1), px(2)), resolve)).to.throw("Can't multiply two dimensions");
        expect(() => evaluate(divide(1, px(2)), resolve)).to.throw("Can't divide a number by a dimension");
        expect(() => evaluate(divide(px(1), { value: 1, unit: "rem" }), resolve)).to.throw("Can't divide px and rem");
        expect(() => evaluate(pow(px(1), 2), resolve)).to.throw("Can't use a dimension for pow");
        expect(() => evaluate(round(px(5), ref(token("a.rem"))), resolve)).to.throw("Can't round px and rem");
    });

    it("should not go on forever for tokens that use each other", () => {
        const loop = (name: string): Operand => (name === "x" ? add(ref(token("y")), 1) : add(ref(token("x")), 1));

        expect(() => evaluate(ref(token("x")), loop)).to.throw("Circular reference: x → y → x");
    });

    it("should say when there is no token", () => {
        expect(() => evaluate(ref(token("a.none")), resolve)).to.throw("There is no token named a.none");
    });
});
