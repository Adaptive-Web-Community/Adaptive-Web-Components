import chai from "chai";
import { DesignToken, hex, Library, refs } from "design-token-library";
import { AdaptiveDesignToken, InteractiveToken } from "../../token-types.js";
import { ComponentAnatomy, Focus, Interactivity } from "../anatomy.js";
import { onFill } from "../on-fill.js";
import { StyleRules } from "../rule.js";
import { Treatment } from "../treatment.js";
import { formatRules, libraryTokenProperties } from "./rules.js";
import { AnatomyTreatments, renderStyleRules } from "./style-rules.js";

const { expect } = chai;

interface Tokens {
    focus: DesignToken.Color;
    fill: InteractiveToken<DesignToken.Values.Color>;
}

const tokens = refs<Tokens>();
const library = Library.create<Tokens>({
    focus: { $type: DesignToken.Type.Color, $value: hex("#0000ff") },
    fill: { $type: AdaptiveDesignToken.interactive, $value: { rest: hex("#ffffff"), hover: hex("#eeeeee"), focus: hex("#dddddd") } },
});

type Parts = { control: string };
const anatomy = (overrides: Partial<ComponentAnatomy<any, any>> = {}): ComponentAnatomy<any, any> => ({
    interactivity: Interactivity.disabledAttribute,
    conditions: {},
    parts: { control: ".control" },
    ...overrides,
});

const disabled: Treatment = { properties: { cursor: "not-allowed" } };
const render = (styleRules: StyleRules, componentAnatomy?: ComponentAnatomy<any, any>, treatments?: AnatomyTreatments): string[] =>
    formatRules(renderStyleRules(styleRules, { tokens: libraryTokenProperties(library), anatomy: componentAnatomy, treatments }))
        .split("\n")
        .filter(line => line !== "");

describe("renderStyleRules", () => {
    it("should render each rule, its treatments and then its properties", () => {
        const shape: Treatment = { properties: { opacity: 0.5, cursor: "default" } };

        expect(render([{ treatments: [shape], properties: { cursor: "pointer" } }])).to.deep.equal([":host { opacity: 0.5; cursor: pointer; }"]);
    });

    it("should apply the interactivity of the anatomy to the rules", () => {
        expect(render([{ properties: { backgroundFill: tokens.fill } }], anatomy({ interactivity: Interactivity.disabledAttribute }))).to.deep.equal([
            ":host { background: var(--fill); }",
            ":host(:not([disabled]):focus-visible) { background: var(--fill-focus); }",
            ":host(:not([disabled]):hover) { background: var(--fill-hover); }",
        ]);
    });

    it("should ignore the interactivity of the anatomy for a target that says so, for its focus without the interactive conditions", () => {
        const rules = render(
            [{ target: { ignoreInteractivity: true }, properties: { backgroundFill: { focus: "blue" } } }],
            anatomy({ interactivity: Interactivity.disabledAttribute })
        );

        expect(rules).to.deep.equal([":host(:focus-visible) { background: blue; }"]);
    });

    it("should apply the context of the anatomy to a rule without one, and drop a part that is the context", () => {
        const rules = render(
            [{ properties: { opacity: 1 } }, { target: { part: "button" }, properties: { opacity: 0 } }],
            anatomy({ context: "button", interactivity: Interactivity.never })
        );

        expect(rules).to.deep.equal(["button { opacity: 1; }", "button { opacity: 0; }"]);
    });

    describe("the disabled treatment", () => {
        it("should apply to the context when the component can be disabled", () => {
            expect(render([], anatomy(), { disabled })).to.deep.equal([":host([disabled]) { cursor: not-allowed; }"]);
        });

        it("should apply to all of it when the focus target is a part", () => {
            expect(render([], anatomy({ focus: Focus.partFocused<Parts>("control") }), { disabled })).to.include(
                ":host([disabled]) * { cursor: not-allowed; }"
            );
        });

        it("should not apply when the component can't be disabled, without an anatomy, or without the treatment", () => {
            expect(render([], anatomy({ interactivity: Interactivity.hrefAttribute }), { disabled })).to.deep.equal([]);
            expect(render([], undefined, { disabled })).to.deep.equal([]);
            expect(render([], anatomy())).to.deep.equal([]);
        });
    });

    describe("the cursor", () => {
        it("should not be set for a component without focus or a cursor part", () => {
            expect(render([], anatomy({ interactivity: Interactivity.hrefAttribute }))).to.deep.equal([]);
        });

        it("should be the pointer on the context for a focusable context", () => {
            expect(render([], anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.contextFocused() }))).to.deep.equal([
                ":host([href]) { cursor: pointer; }",
            ]);
        });

        it("should be on the focus target part", () => {
            expect(
                render([], anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.partFocused<Parts>(".control" as "control") }))
            ).to.include(":host([href]) .control { cursor: pointer; }");
        });

        it("should be the one the anatomy says, a pointer on the focus target if it says none", () => {
            expect(render([], anatomy({ interactivity: Interactivity.hrefAttribute, cursor: { part: ".label", cursorType: "text" } }))).to.deep.equal([
                ":host([href]) .label { cursor: text; }",
            ]);
            expect(
                render(
                    [],
                    anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.partFocused<Parts>(".control" as "control"), cursor: {} })
                )
            ).to.deep.equal([":host([href]) .control { cursor: pointer; }"]);
        });

        it("should not be set when the anatomy turns it off, or for a component that isn't interactive", () => {
            expect(render([], anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.contextFocused(), cursor: false }))).to.deep.equal([]);
            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }))).to.deep.equal([]);
        });
    });

    describe("the focus", () => {
        const focusIndicator: Treatment = { properties: { outlineColor: tokens.focus, outlineStyle: "solid" } };

        it("should apply the focus indicator to the focus target, in the focus state", () => {
            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator })).to.deep.equal([
                ":host(:focus-visible) { outline-color: var(--focus); outline-style: solid; }",
            ]);
        });

        it("should take the focus of a set or of an interactive token, and leave out a set without one", () => {
            const indicator: Treatment = { properties: { backgroundFill: tokens.fill, outlineStyle: { rest: "none" }, opacity: { focus: 1 } } };

            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator: indicator })).to.deep.equal([
                ":host(:focus-visible) { background: var(--fill-focus); opacity: 1; }",
            ]);
        });

        it("should not take a value on a fill, which has no focus of its own", () => {
            const indicator: Treatment = { properties: { foregroundFill: onFill(tokens.focus, { fill: tokens.fill }) } };

            expect(() => render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator: indicator })).to.throw(
                "The foregroundFill of a treatment of the focus is a value on a fill"
            );
        });

        it("should apply the focus reset to the reset target", () => {
            const focusReset: Treatment = { properties: { outlineStyle: "none" } };
            const rules = render(
                [],
                anatomy({ interactivity: Interactivity.never, focus: Focus.partWithin<Parts>(".indicator" as "control", ".input" as "control") }),
                { focusReset }
            );

            expect(rules).to.include(" .input:focus-visible { outline-style: none; }");
        });

        it("should not apply without a focus, or the reset without a reset target", () => {
            const focusReset: Treatment = { properties: { outlineStyle: "none" } };

            expect(render([], anatomy({ interactivity: Interactivity.never }), { focusIndicator, focusReset })).to.deep.equal([]);
            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusReset })).to.deep.equal([]);
        });
    });

    it("should render the rules of the anatomy before the style rules", () => {
        expect(render([{ properties: { opacity: 1 } }], anatomy(), { disabled })).to.deep.equal([
            ":host([disabled]) { cursor: not-allowed; }",
            ":host { opacity: 1; }",
        ]);
    });

    it("should apply the deprecated `styles` of a rule before its treatments", () => {
        const first: Treatment = { properties: { opacity: 0, cursor: "default" } };
        const second: Treatment = { properties: { opacity: 1 } };

        expect(render([{ styles: first, treatments: [second] }])).to.deep.equal([":host { opacity: 1; cursor: default; }"]);
        expect(render([{ styles: [first] }])).to.deep.equal([":host { opacity: 0; cursor: default; }"]);
    });
});
