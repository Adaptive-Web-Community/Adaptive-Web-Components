import chai from "chai";
import { DesignToken, Library, px, toCSS } from "design-token-library";
import { evaluate, multiply, ref } from "./expression.js";
import { adaptiveConverters, propertyResolver, tokenResolver } from "./token-css.js";
import { AdaptiveDesignToken, ExpressionToken } from "./token-types.js";

const { expect } = chai;

interface Tokens {
    size: DesignToken.Dimension;
    ratio: DesignToken.Number;
    group: { $type: DesignToken.Type.Dimension; $root: DesignToken.Dimension; other: DesignToken.Dimension };
    derived: ExpressionToken;
}

const create = () =>
    Library.create<Tokens>({
        size: { $type: DesignToken.Type.Dimension, $value: px(16) },
        ratio: { $type: DesignToken.Type.Number, $value: 1.5 },
        group: {
            $type: DesignToken.Type.Dimension,
            $root: { $value: px(2) },
            other: { $value: px(3) },
        },
        derived: { $type: AdaptiveDesignToken.expression, $value: t => multiply(ref(t.size), ref(t.ratio)) },
    });

describe("propertyResolver", () => {
    it("should get the name of the custom property from the name of the token", () => {
        const property = propertyResolver(create());

        expect(property("size")).to.equal("--size");
        expect(property("group.other")).to.equal("--group-other");
    });

    it("should name the root of a group for the group, as the library does", () => {
        expect(propertyResolver(create())("group.$root")).to.equal("--group");
    });

    it("should name a custom property the way the library is told to", () => {
        const property = propertyResolver(create(), { name: token => `x-${token.name.replace(/\./g, "-")}` });

        expect(property("group.other")).to.equal("--x-group-other");
    });

    it("should say when there is no token", () => {
        expect(() => propertyResolver(create())("group.none")).to.throw("There is no token named group.none");
    });
});

describe("adaptiveConverters", () => {
    it("should write the calculation of a token with the custom properties of the library", () => {
        const library = create();
        const css = toCSS(library, { converters: adaptiveConverters(library) });

        expect(css).to.include("--derived:calc(var(--size) * var(--ratio));");
        expect(css).to.include("--group:2px;--group-other:3px;");
    });

    it("should write the custom properties the way the library is told to", () => {
        const library = create();
        const options = { name: (token: { name: string }) => `x-${token.name.replace(/\./g, "-")}` };
        const css = toCSS(library, { converters: adaptiveConverters(library, options), ...options });

        expect(css).to.include("--x-derived:calc(var(--x-size) * var(--x-ratio));");
    });

    it("should write a value that is not a calculation", () => {
        const library = create();

        library.tokens.derived.set(px(5));

        expect(toCSS(library, { converters: adaptiveConverters(library) })).to.include("--derived:5px;");
    });
});

describe("tokenResolver", () => {
    it("should get the value of a token by name", () => {
        const resolve = tokenResolver(create());

        expect(resolve("size")).to.deep.equal(px(16));
        expect(resolve("group.other")).to.deep.equal(px(3));
        expect(resolve("group.$root")).to.deep.equal(px(2));
    });

    it("should be what evaluates the value of a token that is a calculation", () => {
        const library = create();

        expect(evaluate(library.tokens.derived.$value, tokenResolver(library))).to.deep.equal(px(24));

        library.tokens.ratio.set(2);

        expect(evaluate(library.tokens.derived.$value, tokenResolver(library))).to.deep.equal(px(32));
    });

    it("should say when there is no token", () => {
        expect(() => tokenResolver(create())("group.none")).to.throw("There is no token named group.none");
        expect(() => tokenResolver(create())("none")).to.throw("There is no token named none");
    });
});
