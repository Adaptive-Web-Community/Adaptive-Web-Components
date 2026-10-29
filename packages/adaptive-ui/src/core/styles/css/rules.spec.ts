import chai from "chai";
import { DesignToken, hex, Library, px, recipes, refs, toCSS } from "design-token-library";
import { formatColor } from "../../color/color.js";
import { InteractiveState } from "../../interactive.js";
import { shadow } from "../../shadow/shadow.js";
import { adaptiveConverters } from "../../token-css.js";
import { AdaptiveDesignToken, InteractiveToken } from "../../token-types.js";
import { StyleValues } from "../properties.js";
import { onFill } from "../on-fill.js";
import { CssRule, formatRules, libraryTokenProperties, onFillCSS, renderRules } from "./rules.js";
import { Interactivity } from "../anatomy.js";
import { SelectorParameters } from "./selector.js";

const { expect } = chai;

interface Tokens {
    fill: {
        $root: DesignToken.Color;
        interactive: InteractiveToken<DesignToken.Values.Color>;
        hoverOnly: InteractiveToken<DesignToken.Values.Color>;
    };
    radius: DesignToken.Dimension;
}

const tokens = refs<Tokens>();
const library = Library.create<Tokens>({
    fill: {
        $root: { $type: DesignToken.Type.Color, $value: hex("#808080") },
        interactive: {
            $type: AdaptiveDesignToken.interactive,
            $value: { rest: hex("#808080"), hover: hex("#707070"), active: hex("#909090"), disabled: hex("#c0c0c0") },
        },
        hoverOnly: { $type: AdaptiveDesignToken.interactive, $value: { hover: hex("#707070") } },
    },
    radius: { $type: DesignToken.Type.Dimension, $value: px(4) },
});
const resolve = libraryTokenProperties(library);

const render = (properties: Record<string, StyleValues>, params: SelectorParameters = {}): CssRule[] =>
    renderRules(Object.entries(properties), params, resolve);

describe("renderRules", () => {
    it("should write a value of CSS at rest, on the host by default", () => {
        expect(render({ cursor: "pointer", opacity: 0.5 })).to.deep.equal([
            { selector: ":host", declarations: { cursor: "pointer", opacity: "0.5" } },
        ]);
    });

    it("should write a property of Adaptive UI as its CSS property", () => {
        expect(render({ backgroundFill: "red", cornerRadiusTopLeft: "2px" })[0].declarations).to.deep.equal({
            background: "red",
            "border-top-left-radius": "2px",
        });
    });

    it("should write a ref to a token as the var() of its custom property, as the library names it", () => {
        expect(render({ backgroundFill: tokens.fill.$root, cornerRadiusTopLeft: tokens.radius })[0].declarations).to.deep.equal({
            background: "var(--fill)",
            "border-top-left-radius": "var(--radius)",
        });
    });

    it("should write a value of a token type as the library writes it", () => {
        const [rule] = render({ backgroundFill: hex("#336699"), cornerRadiusTopLeft: px(3), shadow: shadow(hex("#000000"), 0, 2, 4) });

        expect(rule.declarations).to.deep.equal({
            background: formatColor(hex("#336699")),
            "border-top-left-radius": "3px",
            "box-shadow": `0px 2px 4px 0px ${formatColor(hex("#000000"))}`,
        });
    });

    it("should write a ref to an interactive token as a rule for each state that it has and the element has", () => {
        const rules = render({ backgroundFill: tokens.fill.interactive }, Interactivity.disabledAttribute);

        expect(rules).to.deep.equal([
            { selector: ":host", declarations: { background: "var(--fill-interactive)" } },
            { selector: ":host(:not([disabled]):hover)", declarations: { background: "var(--fill-interactive-hover)" } },
            { selector: ":host(:not([disabled]):active)", declarations: { background: "var(--fill-interactive-active)" } },
            { selector: ":host([disabled])", declarations: { background: "var(--fill-interactive-disabled)" } },
        ]);
    });

    it("should write only the rest of an interactive token for an element that isn't interactive", () => {
        expect(render({ backgroundFill: tokens.fill.interactive })).to.deep.equal([
            { selector: ":host", declarations: { background: "var(--fill-interactive)" } },
        ]);
    });

    it("should not write a rest for an interactive token that has none", () => {
        expect(render({ backgroundFill: tokens.fill.hoverOnly }, Interactivity.disabledAttribute)).to.deep.equal([
            { selector: ":host(:not([disabled]):hover)", declarations: { background: "var(--fill-hoverOnly-hover)" } },
        ]);
    });

    it("should write a value for each state, of values or refs, in the order rest, focus, hover, active, disabled", () => {
        const rules = render(
            { backgroundFill: { disabled: "grey", hover: tokens.fill.$root, rest: "white", focus: "blue" } },
            Interactivity.disabledAttribute
        );

        expect(rules.map(rule => rule.selector)).to.deep.equal([
            ":host",
            ":host(:not([disabled]):focus-visible)",
            ":host(:not([disabled]):hover)",
            ":host([disabled])",
        ]);
        expect(rules[2].declarations).to.deep.equal({ background: "var(--fill)" });
    });

    it("should write a ref to an interactive token in a set as the value of the token in that state", () => {
        const rules = render(
            { foregroundFill: { rest: tokens.fill.interactive, hover: tokens.fill.$root, disabled: tokens.fill.interactive } },
            Interactivity.disabledAttribute
        );

        expect(rules.map(rule => rule.declarations.color)).to.deep.equal([
            "var(--fill-interactive)",
            "var(--fill)",
            "var(--fill-interactive-disabled)",
        ]);
    });

    it("should leave out a state of a set that refers to an interactive token that doesn't have the state", () => {
        const rules = render({ backgroundFill: { rest: tokens.fill.hoverOnly, hover: tokens.fill.hoverOnly } }, Interactivity.disabledAttribute);

        expect(rules).to.deep.equal([
            { selector: ":host(:not([disabled]):hover)", declarations: { background: "var(--fill-hoverOnly-hover)" } },
        ]);
    });

    it("should leave out a state that is null", () => {
        const rules = render({ backgroundFill: { rest: "white", hover: null } }, Interactivity.disabledAttribute);

        expect(rules).to.have.length(1);
    });

    it("should keep the rules in the order of the states, whatever order the properties give them", () => {
        const rules = render(
            { backgroundFill: { rest: "white", active: "grey" }, foregroundFill: { rest: "black", hover: "blue", active: "navy" } },
            Interactivity.disabledAttribute
        );

        expect(rules.map(rule => rule.selector)).to.deep.equal([":host", ":host(:not([disabled]):hover)", ":host(:not([disabled]):active)"]);
    });

    it("should make one rule of the states that have the same selector, where the later state wins", () => {
        const rules = render(
            { backgroundFill: { rest: "white", hover: "grey", active: "black" }, opacity: { hover: 0.5 } },
            { ...Interactivity.disabledAttribute, part: "::before" }
        );

        expect(rules).to.deep.equal([
            { selector: "::before", declarations: { background: "white" } },
            { selector: ":host(:not([disabled]))::before", declarations: { background: "black", opacity: "0.5" } },
        ]);
    });

    it("should merge the declarations of one state into one rule, in the order of the properties", () => {
        const rules = render({ backgroundFill: tokens.fill.interactive, cursor: "pointer" }, Interactivity.disabledAttribute);

        expect(rules[0]).to.deep.equal({ selector: ":host", declarations: { background: "var(--fill-interactive)", cursor: "pointer" } });
    });

    it("should set the fill of icons to the current color at rest with a foreground fill", () => {
        const rules = render({ foregroundFill: tokens.fill.interactive }, Interactivity.disabledAttribute);

        expect(rules[0].declarations).to.deep.equal({ color: "var(--fill-interactive)", fill: "currentcolor" });
        expect(rules[1].declarations).to.deep.equal({ color: "var(--fill-interactive-hover)" });
    });

    it("should make the selectors of the target", () => {
        const rules = render({ backgroundFill: "red" }, { part: ".control", contextCondition: "[appearance='accent']" });

        expect(rules[0].selector).to.equal(":host([appearance='accent']) .control");
    });

    it("should name the custom properties as the library is asked to", () => {
        const prefixed = libraryTokenProperties(library, { name: token => `ds-${token.name.split(".").join("-")}` });
        const [rule] = renderRules([["cornerRadiusTopLeft", tokens.radius]], {}, prefixed);

        expect(rule.declarations["border-top-left-radius"]).to.equal("var(--ds-radius)");
    });

    it("should refer only to custom properties that the library writes", () => {
        const css = toCSS(library, { converters: adaptiveConverters(library) });
        const rules = render(
            { backgroundFill: tokens.fill.interactive, foregroundFill: tokens.fill.hoverOnly, cornerRadiusTopLeft: tokens.radius },
            Interactivity.disabledAttribute
        );
        const referenced = formatRules(rules)
            .match(/var\((--[^)]+)\)/g)!
            .map(v => v.slice(4, -1));

        expect(referenced).to.have.length(6);
        referenced.forEach(property => expect(css).to.include(`${property}:`));
    });
});

describe("libraryTokenProperties", () => {
    it("should have the states that an interactive token has", () => {
        expect(resolve(["fill", "interactive"])).to.deep.equal({
            property: "--fill-interactive",
            states: [InteractiveState.rest, InteractiveState.hover, InteractiveState.active, InteractiveState.disabled],
        });
        expect(resolve(["fill", "$root"])).to.deep.equal({ property: "--fill" });
    });

    it("should throw for a path that isn't a token", () => {
        expect(() => resolve(["fill", "missing"])).to.throw("There is no token named fill.missing");
    });
});

describe("values on a fill", () => {
    interface PairTokens {
        context: DesignToken.Color;
        contrast: DesignToken.Color;
        fill: InteractiveToken<DesignToken.Values.Color>;
        other: InteractiveToken<DesignToken.Values.Color>;
    }

    const isDark = (color: DesignToken.Values.Readonly.Color) => Number(color.components[0]) < 0.5;
    const onFillRecipes = recipes({
        contrast: (context: DesignToken.Values.Readonly.Color) => (isDark(context) ? hex("#ffffff") : hex("#000000")),
    });
    const t = refs<PairTokens>();
    const fills = Library.create<PairTokens>({
        context: { $type: DesignToken.Type.Color, $value: hex("#ffffff") },
        contrast: { $type: DesignToken.Type.Color, $value: onFillRecipes.contrast(t.context) },
        fill: { $type: AdaptiveDesignToken.interactive, $value: { rest: hex("#202020"), hover: hex("#e0e0e0"), disabled: hex("#808080") } },
        other: { $type: AdaptiveDesignToken.interactive, $value: { rest: hex("#e0e0e0") } },
    });
    const onFills = libraryTokenProperties(fills, { context: t.context });
    const renderOnFill = (properties: Record<string, StyleValues>): string[] =>
        formatRules(renderRules(Object.entries(properties), Interactivity.disabledAttribute, onFills)).split("\n");

    it("should write a value on a fill as the var() of its custom property in each state that it has", () => {
        expect(renderOnFill({ foregroundFill: onFill(t.contrast, { fill: t.fill }) })).to.deep.equal([
            ":host { color: var(--contrast-on-fill); fill: currentcolor; }",
            ":host(:not([disabled]):hover) { color: var(--contrast-on-fill-hover); }",
            ":host([disabled]) { color: var(--contrast-on-fill-disabled); }",
        ]);
    });

    it("should put a value on a fill on the background fill when it doesn't say its fill", () => {
        expect(renderOnFill({ backgroundFill: t.other, foregroundFill: onFill(t.contrast) })).to.deep.equal([
            ":host { background: var(--other); color: var(--contrast-on-other); fill: currentcolor; }",
        ]);
    });

    it("should be the token itself without a background fill", () => {
        expect(renderOnFill({ foregroundFill: onFill(t.contrast) })).to.deep.equal([":host { color: var(--contrast); fill: currentcolor; }"]);
    });

    it("should need the token of the color context", () => {
        const withoutContext = libraryTokenProperties(fills);

        expect(() => renderRules([["foregroundFill", onFill(t.contrast, { fill: t.fill })]], {}, withoutContext)).to.throw(
            "needs the token of the color context"
        );
        expect(() => renderRules([["foregroundFill", t.contrast]], {}, withoutContext)).not.to.throw();
    });

    describe("onFillCSS", () => {
        it("should write the custom properties of each value on a fill in each state that it has, as the library writes its tokens", () => {
            expect(onFillCSS(fills, [{ token: t.contrast, fill: t.fill }], { context: t.context })).to.equal(
                "--contrast-on-fill:#ffffff;--contrast-on-fill-hover:#000000;--contrast-on-fill-disabled:#000000;"
            );
        });

        it("should be the values in the scope of the library it is given", () => {
            const layer = fills.extend({ fill: { $value: { rest: hex("#f0f0f0") } } });

            expect(onFillCSS(layer, [{ token: t.contrast, fill: t.fill }], { context: t.context })).to.equal("--contrast-on-fill:#000000;");
        });

        it("should write a value once, and name it as the library is asked to", () => {
            const name = (token: { name: string }) => `ds-${token.name.split(".").join("-")}`;
            const values = [
                { token: t.contrast, fill: t.other },
                { token: t.contrast, fill: t.other },
            ];

            expect(onFillCSS(fills, values, { context: t.context, name })).to.equal("--ds-contrast-on-ds-other:#000000;");
            expect(libraryTokenProperties(fills, { context: t.context, name })(["contrast"], ["other"])).to.deep.equal({
                property: "--ds-contrast-on-ds-other",
                states: ["rest"],
            });
        });

        it("should not write the same value with and without activeFollowsRest", () => {
            const values = [
                { token: t.contrast, fill: t.fill },
                { token: t.contrast, fill: t.fill, activeFollowsRest: true },
            ];

            expect(() => onFillCSS(fills, values, { context: t.context })).to.throw("--contrast-on-fill is given both with and without activeFollowsRest");
        });
    });
});

describe("formatRules", () => {
    it("should write a rule a line", () => {
        const css = formatRules([
            { selector: ":host", declarations: { background: "var(--fill)", cursor: "pointer" } },
            { selector: ":host(:hover)", declarations: { background: "red" } },
        ]);

        expect(css).to.equal(":host { background: var(--fill); cursor: pointer; }\n:host(:hover) { background: red; }");
    });
});
