import chai from "chai";
import { cssDirective, ElementStyles } from "@microsoft/fast-element";
import { Color } from "../color/color.js";
import { createTokenDimension, createTokenPaint } from "../token-helpers.js";
import { ElementStylesRenderer } from "./element-styles-renderer.js";
import { Styles } from "./styles.js";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "./types.js";

const { expect } = chai;

let tokenCount = 0;
const uniqueName = (prefix: string) => `renderer-test-${prefix}-${tokenCount++}`;

/** Renders the styles and returns each rule's css. */
function render(styles: Styles, target = {}, interactivity?: any): string[] {
    const rendered = new ElementStylesRenderer(styles).render(target, interactivity);
    return rendered.styles as string[];
}

/** Collapses whitespace for comparison, keeping leading spaces that are part of the selector. */
const norm = (rules: string[]) => rules.map(r => r.replace(/\s+/g, " ").trimEnd());

describe("ElementStylesRenderer", () => {
    describe("render", () => {
        it("should return ElementStyles", () => {
            const result = new ElementStylesRenderer(Styles.fromProperties({ cursor: "pointer" })).render({});

            expect(result).to.be.instanceOf(ElementStyles);
        });

        it("should render a string value as a single rule", () => {
            const rules = norm(render(Styles.fromProperties({ cursor: "pointer" })));

            expect(rules).to.deep.equal([":host { cursor: pointer; }"]);
        });

        it("should render a number value as a string", () => {
            const rules = norm(render(Styles.fromProperties({ opacity: 0.5 })));

            expect(rules).to.deep.equal([":host { opacity: 0.5; }"]);
        });

        it("should render a number value of zero", () => {
            const rules = norm(render(Styles.fromProperties({ opacity: 0 })));

            expect(rules).to.deep.equal([":host { opacity: 0; }"]);
        });

        it("should render a design token as a custom property reference", () => {
            const token = createTokenDimension(uniqueName("dim")).withDefault("4px");
            const rules = norm(render(Styles.fromProperties({ gap: token })));

            expect(rules).to.deep.equal([`:host { gap: var(--${token.name}); }`]);
        });

        it("should render a css directive using its css", () => {
            const rules = norm(render(Styles.fromProperties({ outlineColor: Color.fromRgb(1, 0, 0) })));

            expect(rules).to.deep.equal([":host { outline-color: #ff0000; }"]);
        });

        it("should convert StyleProperty keys to css property names", () => {
            const rules = norm(render(Styles.fromProperties({ paddingLeft: "4px", cornerRadiusTopLeft: "2px" })));

            expect(rules).to.deep.equal([":host { padding-left: 4px; border-top-left-radius: 2px; }"]);
        });

        it("should expand shorthand properties", () => {
            const rules = norm(render(Styles.fromProperties({ paddingHorizontal: "4px" })));

            expect(rules).to.deep.equal([":host { padding-right: 4px; padding-left: 4px; }"]);
        });

        it("should pass through custom css property names", () => {
            const rules = norm(render(Styles.fromProperties({ "--custom-prop": "1" })));

            expect(rules).to.deep.equal([":host { --custom-prop: 1; }"]);
        });

        it("should add `fill: currentcolor` with a foreground fill in the rest state", () => {
            const rules = norm(render(Styles.fromProperties({ foregroundFill: "red" })));

            expect(rules).to.deep.equal([":host { color: red; fill: currentcolor; }"]);
        });

        it("should combine properties with the same selector into one rule", () => {
            const rules = norm(render(Styles.fromProperties({ cursor: "pointer", opacity: 1 })));

            expect(rules).to.have.length(1);
            expect(rules[0]).to.equal(":host { cursor: pointer; opacity: 1; }");
        });

        it("should target the context and part", () => {
            const rules = norm(render(Styles.fromProperties({ cursor: "pointer" }), { context: ".root", part: ".label" }));

            expect(rules).to.deep.equal([".root .label { cursor: pointer; }"]);
        });

        it("should apply a context condition", () => {
            const rules = norm(render(Styles.fromProperties({ cursor: "pointer" }), { contextCondition: "[checked]" }));

            expect(rules).to.deep.equal([":host([checked]) { cursor: pointer; }"]);
        });

        it("should render no rules for no properties", () => {
            expect(render(Styles.fromProperties({}))).to.deep.equal([]);
        });

        it("should not apply interactivity to a single value", () => {
            const rules = norm(render(Styles.fromProperties({ cursor: "pointer" }), {}, Interactivity.disabledAttribute));

            expect(rules).to.deep.equal([":host { cursor: pointer; }"]);
        });
    });

    describe("render with multiple renders", () => {
        it("should render the same result each time", () => {
            const renderer = new ElementStylesRenderer(Styles.fromProperties({ cursor: "pointer" }));
            const first = norm(renderer.render({}).styles as string[]);
            const second = norm(renderer.render({}).styles as string[]);

            expect(first).to.deep.equal([":host { cursor: pointer; }"]);
            expect(second).to.deep.equal(first);
        });

        it("should not include rules from a previous render with a different target", () => {
            const renderer = new ElementStylesRenderer(Styles.fromProperties({ cursor: "pointer" }));

            renderer.render({ context: ".a" });
            const result = norm(renderer.render({ context: ".b" }).styles as string[]);

            expect(result).to.deep.equal([".b { cursor: pointer; }"]);
        });
    });

    describe("render with behaviors", () => {
        it("should attach behaviors added by css directives to the styles", () => {
            const behavior = { addedCallback: () => undefined, removedCallback: () => undefined } as any;
            @cssDirective()
            class BehaviorDirective {
                createCSS(add: (b: any) => void) {
                    add(behavior);
                    return "red";
                }
            }
            const directive = new BehaviorDirective();
            const result = new ElementStylesRenderer(Styles.fromProperties({ outlineColor: directive })).render({});

            expect(result.behaviors).to.deep.equal([behavior]);
            expect(norm(result.styles as string[])).to.deep.equal([":host { outline-color: red; }"]);
        });

        it("should not have behaviors when no directive adds one", () => {
            const result = new ElementStylesRenderer(Styles.fromProperties({ cursor: "pointer" })).render({});

            expect(result.behaviors).to.be.null;
        });
    });

    describe("render with interactive values", () => {
        const rest = "red";
        const hover = "green";
        const active = "blue";
        const focus = "yellow";
        const disabled = "grey";
        const values = { rest, hover, active, focus, disabled };

        it("should only render rest without interactivity", () => {
            const rules = norm(render(Styles.fromProperties({ outlineColor: values })));

            expect(rules).to.deep.equal([":host { outline-color: red; }"]);
        });

        it("should render each state with the interactivity definition", () => {
            const rules = norm(
                render(Styles.fromProperties({ outlineColor: values }), {}, Interactivity.disabledAttribute)
            );

            expect(rules).to.have.members([
                ":host { outline-color: red; }",
                ":host(:not([disabled]):focus-visible) { outline-color: yellow; }",
                ":host(:not([disabled]):hover) { outline-color: green; }",
                ":host(:not([disabled]):active) { outline-color: blue; }",
                ":host([disabled]) { outline-color: grey; }",
            ]);
            expect(rules).to.have.length(5);
        });

        it("should render interactive states on a part", () => {
            const rules = norm(
                render(Styles.fromProperties({ outlineColor: values }), { part: ".control" }, Interactivity.disabledAttribute)
            );

            expect(rules).to.have.members([
                " .control { outline-color: red; }",
                ":host(:not([disabled])) .control:hover { outline-color: green; }",
                ":host(:not([disabled])) .control:active { outline-color: blue; }",
                ":host(:not([disabled])) .control:focus-visible { outline-color: yellow; }",
                ":host([disabled]) .control { outline-color: grey; }",
            ]);
        });

        it("should skip states that are not provided", () => {
            const rules = norm(
                render(
                    Styles.fromProperties({ outlineColor: { rest, hover: undefined, active: null, focus: undefined, disabled: undefined } }),
                    {},
                    Interactivity.disabledAttribute
                )
            );

            expect(rules).to.deep.equal([":host { outline-color: red; }"]);
        });

        it("should not render the disabled state when the component cannot be disabled", () => {
            const rules = norm(
                render(Styles.fromProperties({ outlineColor: values }), {}, Interactivity.hrefAttribute)
            );

            expect(rules.some(r => r.includes("grey"))).to.be.false;
            expect(rules).to.include(":host([href]:hover) { outline-color: green; }");
        });

        it("should not render hover, active, or focus when the component is never interactive", () => {
            const rules = norm(render(Styles.fromProperties({ outlineColor: values }), {}, Interactivity.never));

            expect(rules).to.deep.equal([":host { outline-color: red; }"]);
        });

        it("should apply the focus state without interactive conditions when ignoring interactivity", () => {
            const rules = norm(
                render(
                    Styles.fromProperties({ outlineColor: { focus: "yellow" } as any }),
                    { ignoreInteractivity: true },
                    Interactivity.disabledAttribute
                )
            );

            expect(rules).to.deep.equal([":host(:focus-visible) { outline-color: yellow; }"]);
        });

        it("should add `fill: currentcolor` only for the foreground rest state", () => {
            const rules = norm(
                render(Styles.fromProperties({ foregroundFill: values }), {}, Interactivity.disabledAttribute)
            );

            expect(rules).to.include(":host { color: red; fill: currentcolor; }");
            expect(rules).to.include(":host(:not([disabled]):hover) { color: green; }");
            expect(rules.filter(r => r.includes("fill:"))).to.have.length(1);
        });

        it("should render design tokens as custom properties for interactive values", () => {
            const token = createTokenPaint(uniqueName("paint"));
            const rules = norm(
                render(Styles.fromProperties({ backgroundFill: { rest: token, hover: null, active: null, focus: null, disabled: null } }))
            );

            expect(rules).to.deep.equal([`:host { background: var(--${token.name}); }`]);
        });
    });

    describe("static styles", () => {
        it("should convert focus state styles when set", () => {
            const original = ElementStylesRenderer.focusStateStyles;
            const styles = Styles.fromProperties({ outlineStyle: "solid" });

            try {
                ElementStylesRenderer.focusStateStyles = styles;

                expect(ElementStylesRenderer.focusStateStyles).to.equal(styles);
            } finally {
                (ElementStylesRenderer as any)._focusStateStyles = original;
                (ElementStylesRenderer as any)._focusStateStylesAdjusted = undefined;
            }
        });

        it("should convert focus reset styles when set", () => {
            const original = ElementStylesRenderer.focusResetStyles;
            const styles = Styles.fromProperties({ outlineStyle: "none" });

            try {
                ElementStylesRenderer.focusResetStyles = styles;

                expect(ElementStylesRenderer.focusResetStyles).to.equal(styles);
            } finally {
                (ElementStylesRenderer as any)._focusResetStyles = original;
                (ElementStylesRenderer as any)._focusResetStylesAdjusted = undefined;
            }
        });
    });

    describe("renderStyleRules", () => {
        type Parts = { control: string };
        const anatomy = (overrides: Partial<ComponentAnatomy<any, any>> = {}): ComponentAnatomy<any, any> => ({
            interactivity: Interactivity.disabledAttribute,
            conditions: {},
            parts: { control: ".control" },
            ...overrides,
        });

        let savedDisabled: Styles;
        let savedFocusState: Styles;
        let savedFocusReset: Styles;

        beforeEach(() => {
            const r = ElementStylesRenderer as any;
            savedDisabled = ElementStylesRenderer.disabledStyles;
            savedFocusState = r._focusStateStyles;
            savedFocusReset = r._focusResetStyles;
            ElementStylesRenderer.disabledStyles = undefined as any;
            r._focusStateStyles = undefined;
            r._focusStateStylesAdjusted = undefined;
            r._focusResetStyles = undefined;
            r._focusResetStylesAdjusted = undefined;
        });

        afterEach(() => {
            const r = ElementStylesRenderer as any;
            ElementStylesRenderer.disabledStyles = savedDisabled;
            r._focusStateStyles = savedFocusState;
            r._focusStateStylesAdjusted = undefined;
            r._focusResetStyles = savedFocusReset;
            r._focusResetStylesAdjusted = undefined;
        });

        const rulesOf = (styles: ElementStyles) => norm(styles.styles.flatMap(s => (s instanceof ElementStyles ? s.styles : [s])) as string[]);

        it("should return ElementStyles containing the base styles", () => {
            const base = new ElementStyles([":host { display: block; }"]);
            const result = ElementStylesRenderer.renderStyleRules([base], []);

            expect(result).to.be.instanceOf(ElementStyles);
            expect(result.styles[0]).to.equal(base);
        });

        it("should render each rule after the base styles", () => {
            const rules: StyleRules = [
                { properties: { cursor: "pointer" } },
                { target: { part: ".label" }, properties: { opacity: 1 } },
            ];
            const result = ElementStylesRenderer.renderStyleRules([], rules);

            expect(rulesOf(result)).to.deep.equal([":host { cursor: pointer; }", " .label { opacity: 1; }"]);
        });

        it("should not modify the default base styles between calls", () => {
            const a = ElementStylesRenderer.renderStyleRules(undefined, [{ properties: { cursor: "pointer" } }]);
            const b = ElementStylesRenderer.renderStyleRules(undefined, [{ properties: { opacity: 1 } }]);

            expect(rulesOf(a)).to.deep.equal([":host { cursor: pointer; }"]);
            expect(rulesOf(b)).to.deep.equal([":host { opacity: 1; }"]);
        });

        it("should apply the anatomy interactivity to the rules", () => {
            const rules: StyleRules = [
                { properties: { outlineColor: { rest: "red", hover: "green", active: null, focus: null, disabled: "grey" } as any } },
            ];
            const result = rulesOf(ElementStylesRenderer.renderStyleRules([], rules, anatomy()));

            expect(result).to.include(":host { outline-color: red; }");
            expect(result).to.include(":host(:not([disabled]):hover) { outline-color: green; }");
            expect(result).to.include(":host([disabled]) { outline-color: grey; }");
        });

        it("should apply the anatomy context to rules without a context", () => {
            const rules: StyleRules = [
                { properties: { cursor: "pointer" } },
                { target: { context: ".explicit" }, properties: { opacity: 1 } },
            ];
            const result = rulesOf(ElementStylesRenderer.renderStyleRules([], rules, anatomy({ context: ".root" })));

            expect(result).to.deep.equal([".root { cursor: pointer; }", ".explicit { opacity: 1; }"]);
        });

        it("should drop the part when it is the same as the anatomy context", () => {
            const rules: StyleRules = [{ target: { part: ".root" }, properties: { cursor: "pointer" } }];
            const result = rulesOf(ElementStylesRenderer.renderStyleRules([], rules, anatomy({ context: ".root" })));

            expect(result).to.deep.equal([".root { cursor: pointer; }"]);
        });

        it("should freeze the anatomy", () => {
            const a = anatomy();

            ElementStylesRenderer.renderStyleRules([], [], a);

            expect(Object.isFrozen(a)).to.be.true;
            expect(Object.isFrozen(a.interactivity)).to.be.true;
        });

        describe("disabled styles", () => {
            const disabledStyles = () => Styles.fromProperties({ cursor: "not-allowed" });

            it("should apply to the context when the component can be disabled", () => {
                ElementStylesRenderer.disabledStyles = disabledStyles();
                const result = rulesOf(ElementStylesRenderer.renderStyleRules([], [], anatomy()));

                expect(result).to.deep.equal([":host([disabled]) { cursor: not-allowed; }"]);
            });

            it("should apply to all children when the focus target is a part", () => {
                ElementStylesRenderer.disabledStyles = disabledStyles();
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules([], [], anatomy({ focus: Focus.partFocused<Parts>("control") }))
                );

                expect(result).to.include(":host([disabled]) * { cursor: not-allowed; }");
            });

            it("should not apply when the component cannot be disabled", () => {
                ElementStylesRenderer.disabledStyles = disabledStyles();
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules([], [], anatomy({ interactivity: Interactivity.hrefAttribute }))
                );

                expect(result).to.deep.equal([]);
            });

            it("should not apply when there is no anatomy", () => {
                ElementStylesRenderer.disabledStyles = disabledStyles();

                expect(rulesOf(ElementStylesRenderer.renderStyleRules([], []))).to.deep.equal([]);
            });

            it("should not apply when no disabled styles are configured", () => {
                expect(rulesOf(ElementStylesRenderer.renderStyleRules([], [], anatomy()))).to.deep.equal([]);
            });
        });

        describe("cursor", () => {
            it("should not set a cursor for a component without focus or an explicit cursor part", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules([], [], anatomy({ interactivity: Interactivity.hrefAttribute }))
                );

                expect(result).to.deep.equal([]);
            });

            it("should use the pointer cursor on the context for a focusable context", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.contextFocused() })
                    )
                );

                expect(result).to.deep.equal([":host([href]) { cursor: pointer; }"]);
            });

            it("should apply the cursor to the focus target part", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({ interactivity: Interactivity.hrefAttribute, focus: Focus.partFocused<Parts>(".control" as any) })
                    )
                );

                expect(result).to.include(":host([href]) .control { cursor: pointer; }");
            });

            it("should use an explicit cursor definition", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({
                            interactivity: Interactivity.hrefAttribute,
                            cursor: { part: ".label", cursorType: "text" },
                        })
                    )
                );

                expect(result).to.deep.equal([":host([href]) .label { cursor: text; }"]);
            });

            it("should default an explicit cursor definition to pointer on the focus target", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({
                            interactivity: Interactivity.hrefAttribute,
                            focus: Focus.partFocused<Parts>(".control" as any),
                            cursor: {},
                        })
                    )
                );

                expect(result).to.deep.equal([":host([href]) .control { cursor: pointer; }"]);
            });

            it("should not set a cursor when explicitly disabled", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({
                            interactivity: Interactivity.hrefAttribute,
                            focus: Focus.contextFocused(),
                            cursor: false,
                        })
                    )
                );

                expect(result).to.deep.equal([]);
            });

            it("should not set a cursor for a component that is not interactive", () => {
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() })
                    )
                );

                expect(result).to.deep.equal([]);
            });
        });

        describe("focus styles", () => {
            it("should apply the focus state styles to the focus target", () => {
                ElementStylesRenderer.focusStateStyles = Styles.fromProperties({ outlineStyle: "solid" });
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() })
                    )
                );

                expect(result).to.deep.equal([":host(:focus-visible) { outline-style: solid; }"]);
            });

            it("should apply the focus state styles to a part", () => {
                ElementStylesRenderer.focusStateStyles = Styles.fromProperties({ outlineStyle: "solid" });
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({ interactivity: Interactivity.never, focus: Focus.partFocused<Parts>(".control" as any) })
                    )
                );

                expect(result).to.deep.equal([" .control:focus-visible { outline-style: solid; }"]);
            });

            it("should apply the focus reset styles to the reset target", () => {
                ElementStylesRenderer.focusResetStyles = Styles.fromProperties({ outlineStyle: "none" });
                const result = rulesOf(
                    ElementStylesRenderer.renderStyleRules(
                        [],
                        [],
                        anatomy({
                            interactivity: Interactivity.never,
                            focus: Focus.partWithin<Parts>(".indicator" as any, ".input" as any),
                        })
                    )
                );

                expect(result).to.include(" .input:focus-visible { outline-style: none; }");
            });

            it("should not apply focus styles without a focus definition", () => {
                ElementStylesRenderer.focusStateStyles = Styles.fromProperties({ outlineStyle: "solid" });
                ElementStylesRenderer.focusResetStyles = Styles.fromProperties({ outlineStyle: "none" });

                expect(
                    rulesOf(ElementStylesRenderer.renderStyleRules([], [], anatomy({ interactivity: Interactivity.never })))
                ).to.deep.equal([]);
            });

            it("should not apply the reset styles without a reset target", () => {
                ElementStylesRenderer.focusResetStyles = Styles.fromProperties({ outlineStyle: "none" });

                expect(
                    rulesOf(
                        ElementStylesRenderer.renderStyleRules(
                            [],
                            [],
                            anatomy({ interactivity: Interactivity.never, focus: Focus.contextFocused() })
                        )
                    )
                ).to.deep.equal([]);
            });
        });

        it("should render generated rules before the provided rules", () => {
            ElementStylesRenderer.disabledStyles = Styles.fromProperties({ cursor: "not-allowed" });
            const result = rulesOf(
                ElementStylesRenderer.renderStyleRules([], [{ properties: { opacity: 1 } }], anatomy())
            );

            expect(result).to.deep.equal([":host([disabled]) { cursor: not-allowed; }", ":host { opacity: 1; }"]);
        });
    });
});
