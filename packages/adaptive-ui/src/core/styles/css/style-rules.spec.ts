import chai from "chai";
import { DesignToken, hex, Library, pathOf, refs } from "design-token-library";
import { AdaptiveDesignToken, InteractiveToken } from "../../token-types.js";
import { ComponentAnatomy, Focus, Interactivity } from "../anatomy.js";
import { onFill } from "../on-fill.js";
import { StyleRules } from "../rule.js";
import { Treatment } from "../treatment.js";
import { libraryTreatments, treatment, TreatmentToken } from "../treatment-token.js";
import { formatRules, libraryTokenProperties } from "./rules.js";
import { AnatomyTreatments, renderStyleRules, styleRulesOnFills } from "./style-rules.js";

const { expect } = chai;

interface Tokens {
    focus: DesignToken.Color;
    fill: InteractiveToken<DesignToken.Values.Color>;
    // The treatments of the anatomy that the specs apply, and some to refer to from a rule.
    treatments: {
        disabled: TreatmentToken;
        focusIndicator: TreatmentToken;
        focusStates: TreatmentToken;
        focusOnFill: TreatmentToken;
        focusReset: TreatmentToken;
        disabledOnFill: TreatmentToken;
        shape: { $root: TreatmentToken; round: TreatmentToken };
    };
}

const tokens = refs<Tokens>();
const library = Library.create<Tokens>({
    focus: { $type: DesignToken.Type.Color, $value: hex("#0000ff") },
    fill: { $type: AdaptiveDesignToken.interactive, $value: { rest: hex("#ffffff"), hover: hex("#eeeeee"), focus: hex("#dddddd") } },
    treatments: {
        disabled: treatment({ properties: { cursor: "not-allowed" } }),
        focusIndicator: treatment({ properties: { outlineColor: tokens.focus, outlineStyle: "solid" } }),
        focusStates: treatment({ properties: { backgroundFill: tokens.fill, outlineStyle: { rest: "none" }, opacity: { focus: 1 } } }),
        focusOnFill: treatment({ properties: { foregroundFill: onFill(tokens.focus, { fill: tokens.fill }) } }),
        focusReset: treatment({ properties: { outlineStyle: "none" } }),
        disabledOnFill: treatment({ properties: { backgroundFill: tokens.fill, foregroundFill: onFill(tokens.focus) } }),
        shape: {
            $root: treatment({ properties: { cornerRadius: "4px" } }),
            round: treatment({ properties: { cornerRadius: "999px" } }),
        },
    },
});
const treatments = libraryTreatments(library);

type Parts = { control: string };
const anatomy = (overrides: Partial<ComponentAnatomy<any, any>> = {}): ComponentAnatomy<any, any> => ({
    interactivity: Interactivity.disabledAttribute,
    conditions: {},
    parts: { control: ".control" },
    ...overrides,
});

const disabled = tokens.treatments.disabled;
const render = (styleRules: StyleRules, componentAnatomy?: ComponentAnatomy<any, any>, anatomyTreatments?: AnatomyTreatments): string[] =>
    formatRules(renderStyleRules(styleRules, { tokens: libraryTokenProperties(library), treatments, anatomy: componentAnatomy, anatomyTreatments }))
        .split("\n")
        .filter(line => line !== "");

describe("renderStyleRules", () => {
    it("should render each rule, its treatments and then its properties", () => {
        const shape: Treatment = { properties: { opacity: 0.5, cursor: "default" } };

        expect(render([{ treatments: [shape], properties: { cursor: "pointer" } }])).to.deep.equal([":host { opacity: 0.5; cursor: pointer; }"]);
    });

    it("should read a treatment of the library that a rule refers to, a group standing for its root", () => {
        expect(render([{ treatments: [tokens.treatments.shape] }])).to.deep.equal([":host { border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; }"]);
        expect(render([{ treatments: [tokens.treatments.shape, tokens.treatments.shape.round, { properties: { opacity: 0.5 } }] }])).to.deep.equal([
            ":host { border-top-left-radius: 999px; border-top-right-radius: 999px; border-bottom-right-radius: 999px; border-bottom-left-radius: 999px; opacity: 0.5; }",
        ]);
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
        const focusIndicator = tokens.treatments.focusIndicator;

        it("should apply the focus indicator to the focus target, in the focus state", () => {
            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator })).to.deep.equal([
                ":host(:focus-visible) { outline-color: var(--focus); outline-style: solid; }",
            ]);
        });

        it("should take the focus of a set or of an interactive token, and leave out a set without one", () => {
            const indicator = tokens.treatments.focusStates;

            expect(render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator: indicator })).to.deep.equal([
                ":host(:focus-visible) { background: var(--fill-focus); opacity: 1; }",
            ]);
        });

        it("should not take a value on a fill, which has no focus of its own", () => {
            const indicator = tokens.treatments.focusOnFill;

            expect(() => render([], anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() }), { focusIndicator: indicator })).to.throw(
                "The foregroundFill of a treatment of the focus is a value on a fill"
            );
        });

        it("should apply the focus reset to the reset target", () => {
            const focusReset = tokens.treatments.focusReset;
            const rules = render(
                [],
                anatomy({ interactivity: Interactivity.never, focus: Focus.partWithin<Parts>(".indicator" as "control", ".input" as "control") }),
                { focusReset }
            );

            expect(rules).to.include(" .input:focus-visible { outline-style: none; }");
        });

        it("should not apply without a focus, or the reset without a reset target", () => {
            const focusReset = tokens.treatments.focusReset;

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

describe("styleRulesOnFills", () => {
    const fillTreatment: Treatment = { properties: { backgroundFill: tokens.fill } };
    const foreground: Treatment = { properties: { foregroundFill: onFill(tokens.focus) } };

    it("should be the values on a fill of the rules, on the background fill of the treatments they are composed with", () => {
        expect(styleRulesOnFills([{ treatments: [fillTreatment, foreground] }, { properties: { opacity: 0.5 } }], { treatments })).to.deep.equal([
            { token: tokens.focus, fill: tokens.fill },
        ]);
    });

    it("should leave out a value without a background fill, which is the token itself", () => {
        expect(styleRulesOnFills([{ treatments: [foreground] }], { treatments })).to.deep.equal([]);
    });

    it("should have those of the treatments of the anatomy", () => {
        const values = styleRulesOnFills([], { treatments, anatomy: anatomy(), anatomyTreatments: { disabled: tokens.treatments.disabledOnFill } });

        // A ref read from a treatment of the library is a new one, so it is compared by its path.
        expect(values.map(({ token, fill }) => [pathOf(token), pathOf(fill)])).to.deep.equal([[["focus"], ["fill"]]]);
    });
});
