import chai from "chai";
import { DesignToken, hex, Library } from "design-token-library";
import { Color } from "./color/color.js";
import { formerNames, getFormerNames, getIntendedFor, intendedFor, tokenMetadata, withFormerNames } from "./token-metadata.js";
import { resolveTokenName, tokenNames } from "./token-names.js";
import { AdaptiveDesignToken, InteractiveToken } from "./token-types.js";
import { StyleProperty } from "./styles/properties.js";

const { expect } = chai;

interface Tokens {
    color: {
        context: DesignToken.Color;
        neutral: {
            base: DesignToken.Color;
            fill: { subtleInverse: InteractiveToken<Color> };
        };
        focusStroke: { $root: DesignToken.Color; outer: DesignToken.Color };
        deltas: { $extensions?: Record<string, unknown>; fill: { stealth: { rest: DesignToken.Number } } };
        old: DesignToken.Color;
    };
}

const red = hex("#ff0000");
const create = () =>
    Library.create<Tokens>({
        color: {
            context: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("fill-color") },
            neutral: {
                base: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("neutral-base-color") },
                fill: {
                    subtleInverse: {
                        $type: AdaptiveDesignToken.interactive,
                        $value: { rest: red, hover: red, disabled: red },
                        $extensions: tokenMetadata({ intendedFor: [StyleProperty.backgroundFill] }),
                    },
                },
            },
            focusStroke: {
                $root: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("color.focusStroke.value") },
                outer: { $type: DesignToken.Type.Color, $value: red },
            },
            deltas: {
                $extensions: formerNames("color.shared"),
                fill: { stealth: { rest: { $type: DesignToken.Type.Number, $value: 0, $extensions: formerNames("color.shared.fill.stealth.restDelta") } } },
            },
            old: { $type: DesignToken.Type.Color, $value: red, $deprecated: "Use color.context." },
        },
    });

const resolve = (name: string) => resolveTokenName(tokenNames(create()), name);

describe("token metadata", () => {
    it("should have the style properties and the former names of a token together", () => {
        const extensions = tokenMetadata({ intendedFor: [StyleProperty.foregroundFill], formerNames: ["a", "b"] });

        expect(getIntendedFor({ $extensions: extensions })).to.deep.equal([StyleProperty.foregroundFill]);
        expect(getFormerNames({ $extensions: extensions })).to.deep.equal(["a", "b"]);
        expect(extensions).to.deep.equal({ "adaptive-ui": { intendedFor: [StyleProperty.foregroundFill], formerNames: ["a", "b"] } });
        expect(tokenMetadata({ formerNames: ["a"] })).to.deep.equal({ "adaptive-ui": { formerNames: ["a"] } });
    });

    it("should have no former names for a token without them", () => {
        expect(getFormerNames({})).to.deep.equal([]);
        expect(getFormerNames(create().tokens.color.focusStroke.outer)).to.deep.equal([]);
    });
});

describe("withFormerNames", () => {
    it("should give each token the names of its path, after those it had, and keep its other metadata", () => {
        const shared = intendedFor(StyleProperty.backgroundFill);
        const config = withFormerNames(
            {
                a: { $type: DesignToken.Type.Color, $value: red, $extensions: shared },
                group: {
                    $type: DesignToken.Type.Color,
                    b: { $value: red, $extensions: tokenMetadata({ formerNames: ["first"] }) },
                    c: { $value: red },
                },
            },
            path => (path.join(".") === "group.c" ? [] : [`old-${path.join("-")}`])
        );

        expect(config.a.$extensions).to.deep.equal(tokenMetadata({ intendedFor: [StyleProperty.backgroundFill], formerNames: ["old-a"] }));
        expect(getFormerNames(config.group.b)).to.deep.equal(["first", "old-group-b"]);
        expect(config.group.c).not.to.have.property("$extensions");
        expect(shared).to.deep.equal(intendedFor(StyleProperty.backgroundFill));
    });

    it("should give names to the root of a group, which is a token", () => {
        const config = withFormerNames(
            { group: { $root: { $type: DesignToken.Type.Color, $value: red }, child: { $type: DesignToken.Type.Color, $value: red } } },
            path => [`old-${path.join("-")}`]
        );

        const library = Library.create(config);

        expect(getFormerNames(library.tokens.group.$root)).to.deep.equal(["old-group-$root"]);
        expect(resolveTokenName(tokenNames(library), "old-group-$root")).to.include({ name: "group", renamed: true });
    });

    it("should find the tokens of a library by those names", () => {
        const library = Library.create(
            withFormerNames({ a: { b: { $type: DesignToken.Type.Color, $value: red } } }, ([group, key]) => [`${group}-${key}-color`])
        );

        expect(resolveTokenName(tokenNames(library), "a-b-color")).to.include({ name: "a.b", renamed: true });
    });
});

describe("resolveTokenName", () => {
    it("should find a token by its name, which isn't renamed", () => {
        expect(resolve("color.context")).to.deep.equal({ path: ["color", "context"], name: "color.context", renamed: false, deprecated: false });
    });

    it("should find a token by a name it had, and say that it was renamed", () => {
        expect(resolve("fill-color")).to.deep.equal({ path: ["color", "context"], name: "color.context", renamed: true, deprecated: false });
        expect(resolve("neutral-base-color")?.name).to.equal("color.neutral.base");
    });

    it("should find a token by its custom property, with or without the first group, as 0.x named them", () => {
        expect(resolve("color-neutral-fill-subtle-inverse")?.name).to.equal("color.neutral.fill.subtleInverse");
        expect(resolve("neutral-fill-subtle-inverse")).to.include({ name: "color.neutral.fill.subtleInverse", renamed: true });
        expect(resolve("focus-stroke-outer")?.name).to.equal("color.focusStroke.outer");
    });

    it("should find a state of an interactive token, which is current with a dot", () => {
        expect(resolve("color.neutral.fill.subtleInverse.hover")).to.deep.equal({
            path: ["color", "neutral", "fill", "subtleInverse"],
            name: "color.neutral.fill.subtleInverse.hover",
            state: "hover",
            renamed: false,
            deprecated: false,
        });
        expect(resolve("neutral-fill-subtle-inverse-disabled")).to.include({ name: "color.neutral.fill.subtleInverse.disabled", renamed: true });
    });

    it("should not find a state of a token that isn't interactive", () => {
        expect(resolve("color.context.rest")).to.be.undefined;
    });

    it("should find the token of a set by its name with `value`, as 0.14 named it", () => {
        expect(resolve("neutral-fill-subtle-inverse-value")).to.include({ name: "color.neutral.fill.subtleInverse", renamed: true });
        expect(resolve("neutral-fill-subtle-inverse-value")?.state).to.be.undefined;
    });

    it("should find the root of a group by the name of the group, and by a name it had", () => {
        expect(resolve("color.focusStroke")).to.deep.equal({
            path: ["color", "focusStroke", "$root"],
            name: "color.focusStroke",
            renamed: false,
            deprecated: false,
        });
        expect(resolve("color.focusStroke.$root")?.renamed).to.be.false;
        expect(resolve("color.focusStroke.value")).to.include({ name: "color.focusStroke", renamed: true });
        expect(resolve("focus-stroke")?.name).to.equal("color.focusStroke");
    });

    it("should find a token under a name its group had", () => {
        expect(resolve("color.shared.fill.stealth.rest")).to.include({ name: "color.deltas.fill.stealth.rest", renamed: true });
        expect(resolve("color.shared.fill.stealth.restDelta")).to.include({ name: "color.deltas.fill.stealth.rest", renamed: true });
        expect(resolve("color-shared-fill-stealth-rest")?.name).to.equal("color.deltas.fill.stealth.rest");
    });

    it("should say that a token is deprecated, and why", () => {
        expect(resolve("color.old")).to.include({ name: "color.old", deprecated: "Use color.context.", renamed: false });
    });

    it("should find nothing for a name that isn't a token's", () => {
        expect(resolve("color.missing")).to.be.undefined;
        expect(resolve("color")).to.be.undefined;
        expect(resolve("missing-value")).to.be.undefined;
    });
});

describe("tokenNames", () => {
    it("should not give one name to two tokens", () => {
        const library = Library.create({
            a: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("old") },
            b: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("old") },
        });

        expect(() => tokenNames(library)).to.throw('The name "old" is of both a and b');
    });

    it("should find neither of two tokens by a kebab case that both have", () => {
        const library = Library.create({
            a: { bC: { $type: DesignToken.Type.Color, $value: red } },
            aB: { c: { $type: DesignToken.Type.Color, $value: red } },
        });
        const index = tokenNames(library);

        expect(resolveTokenName(index, "a-b-c")).to.be.undefined;
        expect(resolveTokenName(index, "a.bC")?.name).to.equal("a.bC");
    });

    it("should prefer a name to a kebab case that is the same", () => {
        const library = Library.create({
            x: { $type: DesignToken.Type.Color, $value: red, $extensions: formerNames("a-b") },
            a: { b: { $type: DesignToken.Type.Color, $value: red } },
        });

        expect(resolveTokenName(tokenNames(library), "a-b")?.name).to.equal("x");
    });
});
