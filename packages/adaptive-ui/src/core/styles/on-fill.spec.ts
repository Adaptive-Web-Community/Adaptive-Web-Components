import chai from "chai";
import { DesignToken, hex, Library, pathOf, recipes, refs } from "design-token-library";
import { Color, formatColor } from "../color/color.js";
import { linearGradient } from "../color/gradient.js";
import { InteractiveSet } from "../interactive.js";
import { AdaptiveDesignToken, InteractiveToken } from "../token-types.js";
import {
    deserializeOnFill,
    isOnFill,
    isSerializableOnFill,
    onFill,
    onFillsOf,
    resolveOnFills,
    serializeOnFill,
    valueOnFill,
} from "./on-fill.js";
import { StyleValues } from "./properties.js";

const { expect } = chai;

interface Tokens {
    context: DesignToken.Color;
    // Black or white for the context, and a set that is the context at rest and its inverse on hover, both relative to the context.
    contrast: DesignToken.Color;
    stroke: InteractiveToken<Color>;
    fill: {
        $root: DesignToken.Color;
        interactive: InteractiveToken<Color>;
    };
}

const isDark = (color: Color) => Number(color.components[0]) < 0.5;
const testRecipes = recipes({
    contrast: (context: Color): Color => (isDark(context) ? hex("#ffffff") : hex("#000000")),
    stroke: (context: Color): InteractiveSet<Color> => ({
        rest: context,
        hover: isDark(context) ? hex("#ffffff") : hex("#000000"),
        disabled: hex("#c0c0c0"),
    }),
});

const tokens = refs<Tokens>();
const create = () =>
    Library.create<Tokens>({
        context: { $type: DesignToken.Type.Color, $value: hex("#ffffff") },
        contrast: { $type: DesignToken.Type.Color, $value: testRecipes.contrast(tokens.context) },
        stroke: { $type: AdaptiveDesignToken.interactive, $value: testRecipes.stroke(tokens.context) },
        fill: {
            $root: { $type: DesignToken.Type.Color, $value: hex("#202020") },
            interactive: {
                $type: AdaptiveDesignToken.interactive,
                $value: { rest: hex("#202020"), hover: hex("#e0e0e0"), active: hex("#303030"), disabled: hex("#808080") },
            },
        },
    });

const formatSet = (set: InteractiveSet<unknown>) =>
    Object.fromEntries(Object.entries(set).map(([state, color]) => [state, color === null ? null : formatColor(color as Color)]));

describe("onFill", () => {
    it("should be the token, the fill, and the options as plain data", () => {
        expect(onFill(tokens.contrast)).to.deep.equal({ token: tokens.contrast });
        expect(onFill(tokens.contrast, { fill: tokens.fill.$root, activeFollowsRest: true })).to.deep.equal({
            token: tokens.contrast,
            fill: tokens.fill.$root,
            activeFollowsRest: true,
        });
    });

    it("should be told from the other values of a style property", () => {
        expect(isOnFill(onFill(tokens.contrast))).to.be.true;
        expect(isOnFill(tokens.contrast)).to.be.false;
        expect(isOnFill({ rest: tokens.contrast })).to.be.false;
        expect(isOnFill(hex("#000000"))).to.be.false;
        expect(isOnFill({ token: "contrast" })).to.be.false;
        expect(isOnFill("red")).to.be.false;
    });
});

describe("a value on a fill written as data", () => {
    it("should have the names of the token and the fill, and the option", () => {
        expect(serializeOnFill(onFill(tokens.contrast))).to.deep.equal({ token: "contrast" });
        expect(serializeOnFill(onFill(tokens.contrast, { fill: tokens.fill.$root, activeFollowsRest: true }))).to.deep.equal({
            token: "contrast",
            fill: "fill.$root",
            activeFollowsRest: true,
        });
    });

    it("should be read as refs to the tokens it names", () => {
        const value = deserializeOnFill({ token: "fill.interactive", fill: "fill.$root", activeFollowsRest: false });

        expect(pathOf(value.token)).to.deep.equal(["fill", "interactive"]);
        expect(pathOf(value.fill)).to.deep.equal(["fill", "$root"]);
        expect(value.activeFollowsRest).to.be.false;
        expect(deserializeOnFill({ token: "contrast" })).to.have.keys("token");
    });

    it("should make the same value when it is read back", () => {
        const value = deserializeOnFill(serializeOnFill({ token: tokens.contrast, fill: tokens.fill.interactive }));

        expect(formatSet(valueOnFill(create(), value, tokens.context))).to.deep.equal(
            formatSet(valueOnFill(create(), { token: tokens.contrast, fill: tokens.fill.interactive }, tokens.context))
        );
    });

    it("should be told from a name and the other values written as data", () => {
        expect(isSerializableOnFill({ token: "contrast" })).to.be.true;
        expect(isSerializableOnFill("contrast")).to.be.false;
        expect(isSerializableOnFill({ token: tokens.contrast })).to.be.false;
        expect(isSerializableOnFill(null)).to.be.false;
    });
});

describe("resolveOnFills", () => {
    it("should put a value on a fill on the background fill", () => {
        const properties = resolveOnFills([
            ["backgroundFill", tokens.fill.interactive],
            ["foregroundFill", onFill(tokens.contrast)],
        ]);

        expect(properties.get("foregroundFill")).to.deep.equal({ token: tokens.contrast, fill: tokens.fill.interactive });
    });

    it("should put a value on a fill on the background fill that comes after it", () => {
        const properties = resolveOnFills([
            ["foregroundFill", onFill(tokens.contrast)],
            ["backgroundFill", tokens.fill.$root],
        ]);

        expect(properties.get("foregroundFill")).to.deep.equal({ token: tokens.contrast, fill: tokens.fill.$root });
    });

    it("should keep a fill that is given, and the options", () => {
        const value = onFill(tokens.contrast, { fill: tokens.fill.$root, activeFollowsRest: true });
        const properties = resolveOnFills([
            ["backgroundFill", tokens.fill.interactive],
            ["foregroundFill", value],
        ]);

        expect(properties.get("foregroundFill")).to.equal(value);
        expect(resolveOnFills([["backgroundFill", tokens.fill.interactive], ["foregroundFill", onFill(tokens.contrast, { activeFollowsRest: true })]]).get("foregroundFill")).to.deep.equal({
            token: tokens.contrast,
            fill: tokens.fill.interactive,
            activeFollowsRest: true,
        });
    });

    it("should be the token itself, in the context, without a background fill", () => {
        const properties = resolveOnFills([["foregroundFill", onFill(tokens.contrast)]]);

        expect(properties.get("foregroundFill")).to.equal(tokens.contrast);
    });

    it("should not pair a value with a background fill that isn't a token", () => {
        expect(() => resolveOnFills([["backgroundFill", "red"], ["foregroundFill", onFill(tokens.contrast)]])).to.throw(
            "The foregroundFill is on the background fill, which isn't a token"
        );
        expect(() => resolveOnFills([["backgroundFill", { rest: tokens.fill.$root }], ["foregroundFill", onFill(tokens.contrast)]])).to.throw();
    });

    it("should keep the other values", () => {
        const values: [string, StyleValues][] = [
            ["backgroundFill", tokens.fill.interactive],
            ["opacity", 0.5],
        ];

        expect([...resolveOnFills(values)]).to.deep.equal(values);
    });
});

describe("onFillsOf", () => {
    it("should be the values on a fill, with their fills", () => {
        expect(
            onFillsOf([
                ["backgroundFill", tokens.fill.interactive],
                ["foregroundFill", onFill(tokens.contrast)],
                ["borderFillTop", onFill(tokens.stroke, { fill: tokens.fill.$root })],
                ["opacity", 0.5],
            ])
        ).to.deep.equal([
            { token: tokens.contrast, fill: tokens.fill.interactive },
            { token: tokens.stroke, fill: tokens.fill.$root },
        ]);
    });

    it("should leave out one that is the token itself", () => {
        expect(onFillsOf([["foregroundFill", onFill(tokens.contrast)]])).to.deep.equal([]);
    });
});

describe("valueOnFill", () => {
    it("should be the token in the context of each state of the fill", () => {
        const value = valueOnFill(create(), { token: tokens.contrast, fill: tokens.fill.interactive }, tokens.context);

        expect(formatSet(value)).to.deep.equal({ rest: "#ffffff", hover: "#000000", active: "#ffffff", disabled: "#000000" });
    });

    it("should be the rest of an interactive token, and its disabled in the disabled state", () => {
        const value = valueOnFill(create(), { token: tokens.stroke, fill: tokens.fill.interactive }, tokens.context);

        expect(formatSet(value)).to.deep.equal({ rest: "#202020", hover: "#e0e0e0", active: "#303030", disabled: "#c0c0c0" });
    });

    it("should be the rest only, on a fill that is a color", () => {
        const value = valueOnFill(create(), { token: tokens.contrast, fill: tokens.fill.$root }, tokens.context);

        expect(formatSet(value)).to.deep.equal({ rest: "#ffffff" });
    });

    it("should not have a state that the fill doesn't have, and clear one that it clears", () => {
        const library = create();
        library.tokens.fill.interactive.set({ rest: hex("#202020"), hover: null });

        expect(formatSet(valueOnFill(library, { token: tokens.contrast, fill: tokens.fill.interactive }, tokens.context))).to.deep.equal({
            rest: "#ffffff",
            hover: null,
        });
    });

    it("should follow the fill and the token", () => {
        const library = create();
        const value = () => formatSet(valueOnFill(library, { token: tokens.contrast, fill: tokens.fill.$root }, tokens.context));

        library.tokens.fill.$root.set(hex("#f0f0f0"));
        expect(value()).to.deep.equal({ rest: "#000000" });
    });

    it("should not change the context of the library", () => {
        const library = create();
        valueOnFill(library, { token: tokens.contrast, fill: tokens.fill.interactive }, tokens.context);

        expect(formatColor(library.tokens.context.$value)).to.equal("#ffffff");
        expect(formatColor(library.tokens.contrast.$value)).to.equal("#000000");
    });

    it("should keep the value of the rest in the active state when the rest and the hover have the same, if asked", () => {
        const library = create();
        library.tokens.fill.interactive.set({ rest: hex("#202020"), hover: hex("#303030"), active: hex("#e0e0e0") });
        const value = (activeFollowsRest: boolean) =>
            formatSet(valueOnFill(library, { token: tokens.contrast, fill: tokens.fill.interactive, activeFollowsRest }, tokens.context));

        expect(value(false)).to.deep.equal({ rest: "#ffffff", hover: "#ffffff", active: "#000000" });
        expect(value(true)).to.deep.equal({ rest: "#ffffff", hover: "#ffffff", active: "#ffffff" });
    });

    it("should not keep the rest in the active state when the rest and the hover differ", () => {
        const value = valueOnFill(create(), { token: tokens.contrast, fill: tokens.fill.interactive, activeFollowsRest: true }, tokens.context);

        expect(formatSet(value).active).to.equal("#ffffff");
        expect(formatSet(value).hover).to.equal("#000000");
    });

    it("should not make a value in the context of a gradient", () => {
        const library = create();
        const gradient = linearGradient([
            { color: hex("#000000"), position: { value: 0, unit: "%" } },
            { color: hex("#ffffff"), position: { value: 100, unit: "%" } },
        ]);
        // A gradient isn't a color, which the context is, so it is given as the value of the fill on purpose.
        library.tokens.fill.interactive.set({ rest: gradient as unknown as Color });

        expect(() => valueOnFill(library, { token: tokens.contrast, fill: tokens.fill.interactive }, tokens.context)).to.throw(
            "The rest of fill.interactive is a gradient, which can't be the context of contrast"
        );
    });
});
