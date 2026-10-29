import chai from "chai";
import { DesignToken, hex, Library, px, recipes, refs, toCSS, toProperties } from "design-token-library";
import { Color, formatColor } from "./color/color.js";
import { createPaletteOkhsl } from "./color/palette-okhsl.js";
import { Palette, PaletteDirection } from "./color/palette.js";
import { deltaColorSet } from "./color/recipes/delta-color-set.js";
import { InteractiveSet, InteractiveState } from "./interactive.js";
import { adaptiveConverters } from "./token-css.js";
import { AdaptiveDesignToken, InteractiveDeltaTokens, interactiveDeltas, InteractiveToken, PaletteToken } from "./token-types.js";

const { expect } = chai;

interface Tokens {
    context: DesignToken.Color;
    base: DesignToken.Color;
    palette: PaletteToken;
    fill: {
        // The deltas are a group of delta tokens, and nothing more.
        deltas: InteractiveDeltaTokens;
        // A recipe that only needs some of the states has only those.
        liftDeltas: InteractiveDeltaTokens<InteractiveState.hover | InteractiveState.active>;
        interactive: InteractiveToken<Color>;
    };
    control: {
        // A value that is fixed.
        radius: DesignToken.Dimension;
        // The same kind of value, that changes by state.
        corner: InteractiveToken<DesignToken.Values.Dimension>;
        // A value that is only for one state, with no rest.
        ring: InteractiveToken<Color>;
        // A value that is for two, with no rest.
        lift: InteractiveToken<DesignToken.Values.Dimension>;
    };
}

let calls = 0;

// The recipe is a function of the values, so it runs once for all of the states.
const testRecipes = recipes({
    palette: (base: Color) => createPaletteOkhsl(base),
    fill: (palette: Palette, reference: Color, deltas: InteractiveSet<number>) => {
        calls++;
        return deltaColorSet(palette, reference, deltas, { direction: PaletteDirection.darker });
    },
});
const tokens = refs<Tokens>();

const create = () =>
    Library.create<Tokens>({
        context: { $type: DesignToken.Type.Color, $value: hex("#a0a0a0") },
        base: { $type: DesignToken.Type.Color, $value: hex("#808080") },
        palette: { $type: AdaptiveDesignToken.palette, $value: testRecipes.palette(tokens.base) },
        fill: {
            deltas: {
                $type: AdaptiveDesignToken.delta,
                rest: { $value: -2 },
                hover: { $value: -3 },
                active: { $value: -1 },
                focus: { $value: -3 },
                disabled: { $value: -1 },
            },
            liftDeltas: { $type: AdaptiveDesignToken.delta, hover: { $value: -2 }, active: { $value: 0 } },
            interactive: {
                $type: AdaptiveDesignToken.interactive,
                $value: testRecipes.fill(tokens.palette, tokens.context, interactiveDeltas(tokens.fill.deltas)),
            },
        },
        control: {
            radius: { $type: DesignToken.Type.Dimension, $value: px(4) },
            corner: {
                $type: AdaptiveDesignToken.interactive,
                $value: { rest: px(2), hover: px(4), active: px(2), focus: px(4), disabled: px(0) },
            },
            ring: { $type: AdaptiveDesignToken.interactive, $value: { focus: hex("#0000ff") } },
            lift: { $type: AdaptiveDesignToken.interactive, $value: { hover: px(-2), active: px(0) } },
        },
    });

const css = (library: ReturnType<typeof create>) => toCSS(library, { converters: adaptiveConverters(library) });

describe("an interactive token", () => {
    describe("of the colors of a recipe", () => {
        it("has the colors of the recipe for each state", () => {
            const library = create();
            const { palette, context } = library.tokens;
            const expected = deltaColorSet(palette.$value, context.$value, { rest: -2, hover: -3, active: -1, focus: -3, disabled: -1 }, { direction: 1 });

            expect(library.tokens.fill.interactive.$value).to.deep.equal(expected);
        });

        it("is calculated once for the set, whatever states are read", () => {
            const library = create();
            calls = 0;

            const { rest, hover, active, focus, disabled } = library.tokens.fill.interactive.$value;
            library.tokens.fill.interactive.$value.hover;

            expect([rest, hover, active, focus, disabled].every(color => color)).to.be.true;
            expect(calls).to.equal(1);
        });

        it("reads deltas that are tokens a consumer can change, which changes the set", () => {
            const base = create();
            const tuned = base.extend({ fill: { deltas: { hover: { $value: -6 } } } });
            const before = base.tokens.fill.interactive.$value;
            const after = tuned.tokens.fill.interactive.$value;

            expect(formatColor(after.hover!)).not.to.equal(formatColor(before.hover!));
            expect(formatColor(after.rest!)).to.equal(formatColor(before.rest!));
        });

        it("follows a change to what it reads", () => {
            const library = create();
            const before = formatColor(library.tokens.fill.interactive.$value.rest!);

            library.tokens.context.set(hex("#404040"));

            expect(formatColor(library.tokens.fill.interactive.$value.rest!)).not.to.equal(before);
        });
    });

    describe("the deltas", () => {
        it("are the refs of the states that the group has, for a recipe", () => {
            const { deltas, liftDeltas } = tokens.fill;

            expect(interactiveDeltas(deltas)).to.deep.equal({
                rest: deltas.rest,
                hover: deltas.hover,
                active: deltas.active,
                focus: deltas.focus,
                disabled: deltas.disabled,
            });
            expect(interactiveDeltas(liftDeltas, [InteractiveState.hover, InteractiveState.active])).to.deep.equal({
                hover: liftDeltas.hover,
                active: liftDeltas.active,
            });
        });

        it("are the numbers of the states when a recipe gets them", () => {
            const deltasOf = recipes({ deltas: (deltas: InteractiveSet<number>) => deltas });
            interface DeltaTokens {
                lift: InteractiveDeltaTokens<InteractiveState.hover | InteractiveState.active>;
                set: InteractiveToken<number>;
            }
            const lift = refs<DeltaTokens>().lift;
            const library = Library.create<DeltaTokens>({
                lift: { $type: AdaptiveDesignToken.delta, hover: { $value: -2 }, active: { $value: 0 } },
                set: {
                    $type: AdaptiveDesignToken.interactive,
                    $value: deltasOf.deltas(interactiveDeltas(lift, [InteractiveState.hover, InteractiveState.active])),
                },
            });

            expect(library.tokens.set.$value).to.deep.equal({ hover: -2, active: 0 });
        });
    });

    describe("for any value", () => {
        it("has a dimension for the states, and can't be given a single one", () => {
            const { corner } = create().tokens.control;
            const hover: DesignToken.Values.Dimension | null | undefined = corner.$value.hover;

            create().extend({
                control: {
                    // @ts-expect-error an interactive token has values for the states
                    corner: { $value: px(6) },
                },
            });
            expect(hover).to.deep.equal(px(4));
        });
    });

    describe("CSS", () => {
        const library = create();
        const output = css(library);

        it("writes the rest state as the base property and the others next to it", () => {
            expect(output).to.match(/--fill-interactive:#[0-9a-f]{6};--fill-interactive-hover:#[0-9a-f]{6};--fill-interactive-active:/);
            expect(output).to.include("--control-corner:2px;--control-corner-hover:4px;--control-corner-active:2px;--control-corner-focus:4px;--control-corner-disabled:0px;");
        });

        it("does not write the deltas, which only a recipe reads", () => {
            expect(output).not.to.include("--fill-deltas");
            expect(output).not.to.include("--fill-liftDeltas");
        });

        it("writes a fixed value as the base property only", () => {
            expect(output).to.include("--control-radius:4px;");
            expect(output).not.to.include("--control-radius-hover");
        });
    });

    describe("with only some of the states", () => {
        const library = create();
        const output = css(library);

        it("has only the states that the recipe gives, and the others are not there", () => {
            const { ring, lift } = library.tokens.control;

            expect(ring.$value).to.deep.equal({ focus: hex("#0000ff") });
            expect("rest" in ring.$value).to.be.false;
            expect(lift.$value).to.deep.equal({ hover: px(-2), active: px(0) });
        });

        it("writes only the states that have a value, and the property of a set with no rest is empty", () => {
            expect(output).to.include("--control-ring:;--control-ring-focus:#0000ff;");
            expect(output).to.include("--control-lift:;--control-lift-hover:-2px;--control-lift-active:0px;");
            expect(output).not.to.include("--control-ring-hover");
        });

        it("does not write a state that is cleared on purpose, with null", () => {
            const cleared = library.extend({ control: { corner: { $value: { rest: px(2), hover: null, disabled: px(0) } } } });
            const text = css(cleared);

            expect(text).to.include("--control-corner:2px;--control-corner-disabled:0px;");
            expect(text).not.to.include("--control-corner-hover");
        });

        it("keeps a state that it doesn't mention, as a value that is spread over it would", () => {
            const { corner } = library.tokens.control;
            const next = { ...corner.$value, hover: px(8) };

            expect(next).to.deep.equal({ rest: px(2), hover: px(8), active: px(2), focus: px(4), disabled: px(0) });
            expect({ ...corner.$value, hover: null }.hover).to.be.null;
        });
    });
});
