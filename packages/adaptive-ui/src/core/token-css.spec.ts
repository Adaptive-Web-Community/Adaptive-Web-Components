import chai from "chai";
import { DesignToken, hex, Library, px, refs, toCSS } from "design-token-library";
import { linearGradient } from "./color/gradient.js";
import { multiply } from "./expression.js";
import { adaptiveConverters, propertyResolver } from "./token-css.js";
import { AdaptiveDesignToken, ExpressionToken, PaintToken } from "./token-types.js";

const { expect } = chai;

interface Tokens {
    size: DesignToken.Dimension;
    ratio: DesignToken.Number;
    group: { $type: DesignToken.Type.Dimension; $root: DesignToken.Dimension; other: DesignToken.Dimension };
    derived: ExpressionToken;
}

const tokens = refs<Tokens>();
const create = () =>
    Library.create<Tokens>({
        size: { $type: DesignToken.Type.Dimension, $value: px(16) },
        ratio: { $type: DesignToken.Type.Number, $value: 1.5 },
        group: {
            $type: DesignToken.Type.Dimension,
            $root: { $value: px(2) },
            other: { $value: px(3) },
        },
        derived: { $type: AdaptiveDesignToken.expression, $value: multiply(tokens.size, tokens.ratio) },
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

    it("should write a paint as a color, or a gradient with its kind and angle", () => {
        interface PaintTokens {
            solid: PaintToken;
            gradient: PaintToken;
        }
        const red = hex("#ff0000");
        const blue = hex("#0000ff");
        const library = Library.create<PaintTokens>({
            solid: { $type: AdaptiveDesignToken.paint, $value: red },
            gradient: {
                $type: AdaptiveDesignToken.paint,
                $value: linearGradient(
                    [
                        { color: red, position: { value: 0, unit: "%" } },
                        { color: blue, position: { value: 1, unit: "%" } },
                    ],
                    90
                ),
            },
        });
        const css = toCSS(library, { converters: adaptiveConverters(library) });

        expect(css).to.include("--solid:#ff0000;");
        expect(css).to.include("--gradient:linear-gradient(90deg, #ff0000 0%, #0000ff 100%);");
    });
});
