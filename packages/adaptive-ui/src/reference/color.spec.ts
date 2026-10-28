import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DesignToken, hex, Library, recipes, refs, toCSS } from "design-token-library";
import { Color, formatColor } from "../core/color/color.js";
import { createPaletteOkhsl } from "../core/color/palette-okhsl.js";
import { closestSwatchIndex, swatchAt } from "../core/color/palette.js";
import { blackOrWhiteByContrast } from "../core/color/recipes/black-or-white-by-contrast.js";
import { white } from "../core/color/utilities/color-constants.js";
import { StyleProperty, StylePropertyShorthand } from "../core/styles/properties.js";
import { InteractiveColorSet } from "../core/color/interactive-set.js";
import { adaptiveConverters } from "../core/token-css.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { AdaptiveDesignToken, InteractiveToken, PaletteToken, WcagContrastLevel } from "../core/token-types.js";
import {
    blackOrWhiteReadable,
    color as colorConfig,
    ColorLibraryTokens,
    ColorSetTokens,
    createColorLibrary,
    createColorSets,
} from "./color.js";
import { paletteRecipes } from "./palette.js";

const { expect } = chai;

const snapshot = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/reference/parity.snapshot.json"), "utf8")
);

type ColorLibrary = ReturnType<typeof createColorLibrary>;

const families = ["neutral", "accent", "highlight", "critical", "warning", "success", "info"] as const;
const fills = ["stealth", "subtle", "subtleInverse", "ideal", "discernible", "readable"] as const;
const strokes = ["safety", "stealth", "subtle", "discernible", "readable", "strong"] as const;
const states = ["rest", "hover", "active", "focus", "disabled"] as const;
const luminances: Record<string, number> = { light: 0.95, dark: 0.15 };

// The sets that the recipes make have a color for every state.
const format = (set: InteractiveColorSet) => Object.fromEntries(states.map(state => [state, formatColor(set[state]!)]));

// The layer that is the context for the content within it, as the nesting of the parity snapshot has them.
// The color itself and not its hex, since a recipe that is at its minimum contrast can go to the next color with a rounded context.
const nesting: Record<string, (library: ColorLibrary) => Color> = {
    "0-base": library => library.tokens.color.layer.fill.ramp.base.$value,
    "1-fixed-plus1": library => library.tokens.color.layer.fill.ramp.plus1.$value,
    "2-interactive": library => library.tokens.color.layer.fill.interactive.$value.rest!,
};

describe("color sets", () => {
    describe("compared to the parity snapshot", () => {
        Object.keys(snapshot.scenarios).forEach(key => {
            const [baseName, mode, level] = key.split("/");
            const scenario = snapshot.scenarios[key];

            it(`should have the sets of ${key}`, () => {
                let library = createColorLibrary();
                const base = snapshot.palettes[baseName].bases["color.neutral.base"];
                if (baseName !== "default") {
                    library = library.extend({
                        color: { neutral: { base: { $value: hex(base) } }, accent: { base: { $value: hex(base) } } },
                    });
                }
                library = library.extend({ color: { layer: { fill: { ramp: { baseLuminance: { $value: luminances[mode] } } } } } });

                for (const name of Object.keys(nesting)) {
                    library = library.extend({ color: { context: { $value: nesting[name](library) } } });
                    if (name === level) {
                        break;
                    }
                }

                const { focusStroke } = library.tokens.color;
                expect(formatColor(focusStroke.$root.$value), "focus stroke").to.equal(scenario.recipes["color.focusStroke.recipe"]);
                expect(formatColor(focusStroke.outer.$value), "outer").to.equal(scenario.recipes["color.focusStroke.outer.recipe"]);
                expect(formatColor(focusStroke.inner.$value), "inner").to.equal(scenario.recipes["color.focusStroke.inner.recipe"]);

                const { color } = library.tokens;
                families.forEach(family => {
                    fills.forEach(fill => {
                        expect(format(color[family].fill[fill].$value), `${family}.fill.${fill}`).to.deep.equal(
                            scenario.recipes[`color.${family}.fill.${fill}.recipe`]
                        );
                    });
                    strokes.forEach(stroke => {
                        expect(format(color[family].stroke[stroke].$value), `${family}.stroke.${stroke}`).to.deep.equal(
                            scenario.recipes[`color.${family}.stroke.${stroke}.recipe`]
                        );
                    });
                });
            });
        });
    });

    describe("the deltas", () => {
        it("should have the numbers they had, with the focus the rest", () => {
            const { deltas } = createColorLibrary().tokens.color;
            const values = (group: (typeof deltas)["fill"]["subtle"]) => states.map(state => group[state].$value);

            expect(values(deltas.fill.stealth)).to.deep.equal([0, 3, 2, 0, 0]);
            expect(values(deltas.fill.subtle)).to.deep.equal([3, 4, 2, 3, 3]);
            expect(values(deltas.fill.ideal)).to.deep.equal([0, -2, 2, 0, 3]);
            expect(values(deltas.fill.discernible)).to.deep.equal([0, 6, 3, 0, 3]);
            expect(values(deltas.fill.readable)).to.deep.equal([0, -2, 2, 0, 3]);
            expect(values(deltas.stroke.safety)).to.deep.equal([0, 6, -6, 0, 0]);
            expect(values(deltas.stroke.stealth)).to.deep.equal([0, 6, -6, 0, 0]);
            expect(values(deltas.stroke.subtle)).to.deep.equal([0, 4, -2, 0, 8]);
            expect(values(deltas.stroke.discernible)).to.deep.equal([0, 8, -4, 0, 8]);
            expect(values(deltas.stroke.readable)).to.deep.equal([0, 6, -6, 0, 8]);
            expect(values(deltas.stroke.strong)).to.deep.equal([0, 10, -10, 0, 8]);
        });

        it("should follow the rest for the focus until the focus is set", () => {
            const { color } = createColorLibrary().tokens;
            const before = formatColor(color.accent.fill.subtle.$value.focus!);

            color.deltas.fill.subtle.rest.set(5);

            expect(color.deltas.fill.subtle.focus.$value).to.equal(5);
            expect(formatColor(color.accent.fill.subtle.$value.focus!)).not.to.equal(before);
            color.deltas.fill.subtle.focus.set(1);
            color.deltas.fill.subtle.rest.set(6);
            expect(color.deltas.fill.subtle.focus.$value).to.equal(1);
        });

        it("should make a change to a delta a change to the sets of every palette", () => {
            const { color } = createColorLibrary().tokens;
            const before = [color.accent.fill.subtle.$value.hover!, color.critical.fill.subtle.$value.hover!].map(formatColor);

            color.deltas.fill.subtle.hover.set(10);

            expect([color.accent.fill.subtle.$value.hover!, color.critical.fill.subtle.$value.hover!].map(formatColor)).not.to.deep.equal(before);
        });

        it("should have the inverse of the subtle fill go the other way, with the same disabled", () => {
            const { color } = createColorLibrary().tokens;
            const palette = color.accent.palette.$value;
            const reference = color.context.$value;
            const index = closestSwatchIndex(palette, reference);

            // The context is white, so the subtle fill goes darker by 3 and its inverse goes lighter, to the end of the palette.
            expect(color.accent.fill.subtle.$value.rest!).to.deep.equal(swatchAt(palette, index + 3));
            expect(color.accent.fill.subtleInverse.$value.rest!).to.deep.equal(swatchAt(palette, index - 3));
            expect(color.accent.fill.subtleInverse.$value.disabled!).to.deep.equal(color.accent.fill.subtle.$value.disabled!);
        });
    });

    describe("the disabled values", () => {
        it("should be shared, a delta for the fills and one for the strokes, and have the deltas of the recipes follow them", () => {
            const { color } = createColorLibrary().tokens;

            expect([color.disabled.fillDelta.$value, color.disabled.strokeDelta.$value]).to.deep.equal([3, 8]);
            expect(color.deltas.fill.readable.disabled.$value).to.equal(3);
            expect(color.deltas.stroke.strong.disabled.$value).to.equal(8);

            color.disabled.fillDelta.set(5);
            color.disabled.strokeDelta.set(10);

            expect(color.deltas.fill.ideal.disabled.$value).to.equal(5);
            expect(color.deltas.stroke.discernible.disabled.$value).to.equal(10);
        });

        it("should be none for the recipes that have no color at rest", () => {
            const { color } = createColorLibrary().tokens;

            expect(color.deltas.fill.stealth.disabled.$value).to.equal(0);
            expect(color.deltas.stroke.stealth.disabled.$value).to.equal(0);
            expect(color.deltas.stroke.safety.disabled.$value).to.equal(0);
            expect(formatColor(color.accent.fill.stealth.$value.disabled!)).to.equal("transparent");
        });

        it("should have a palette that is the palette of the layers until it is set, so it blends into its background", () => {
            const { color } = createColorLibrary().tokens;
            const own = createPaletteOkhsl("#336699");

            expect(color.disabled.palette.$value).to.deep.equal(color.layer.palette.$value);
            color.layer.palette.set(own);
            expect(color.disabled.palette.$value).to.deep.equal(own);
            expect(color.layer.palette.$value).to.deep.equal(own);
            expect(formatColor(color.accent.fill.subtle.$value.disabled!)).to.equal(
                formatColor(swatchAt(own, closestSwatchIndex(own, color.context.$value) + 3))
            );
        });

        it("should have a palette of its own once it is set", () => {
            const { color } = createColorLibrary().tokens;
            const own = createPaletteOkhsl("#336699");

            color.disabled.palette.set(own);

            expect(color.disabled.palette.$value).to.deep.equal(own);
            expect(color.layer.palette.$value).to.deep.equal(color.neutral.palette.$value);
        });

        it("should have the name the token had", () => {
            expect(createColorLibrary().tokens.color.disabled.palette.name).to.equal("color.disabled.palette");
        });
    });

    describe("the WCAG level", () => {
        it("should have the minimum contrasts they had, for AA and for AAA", () => {
            const library = createColorLibrary();
            const { minContrast, level } = library.tokens.color.wcagContrast;
            const values = () => [minContrast.safety, minContrast.subtle, minContrast.ideal, minContrast.discernible, minContrast.readable].map(t => t.$value);

            expect(level.$value).to.equal(WcagContrastLevel.aa);
            expect(values()).to.deep.equal([0, 1.5, 2, 3, 4.5]);
            expect(minContrast.strong.$value).to.equal(12);
            level.set(WcagContrastLevel.aaa);
            expect(values()).to.deep.equal([3, 3, 3, 4.5, 7]);
            expect(minContrast.strong.$value).to.equal(12);
        });

        it("should make the safety strokes transparent at AA and colors at AAA", () => {
            const { color } = createColorLibrary().tokens;

            expect(formatColor(color.accent.stroke.safety.$value.rest!)).to.equal("transparent");
            color.wcagContrast.level.set(WcagContrastLevel.aaa);
            expect(formatColor(color.accent.stroke.safety.$value.rest!)).not.to.equal("transparent");
        });

        it("should change the sets that have a contrast", () => {
            const { color } = createColorLibrary().tokens;
            const before = formatColor(color.accent.stroke.readable.$value.rest!);

            color.wcagContrast.level.set(WcagContrastLevel.aaa);

            expect(formatColor(color.accent.stroke.readable.$value.rest!)).not.to.equal(before);
        });
    });

    describe("the neutral sets", () => {
        it("should be opaque, and semitransparent over the context when as an overlay", () => {
            const { color } = createColorLibrary().tokens;
            color.context.set(hex("#336699"));

            expect(color.neutral.asOverlay.$value).to.equal(false);
            const opaque = color.neutral.fill.subtle.$value.rest!;
            expect(opaque!.alpha ?? 1).to.equal(1);

            color.neutral.asOverlay.set(true);

            const overlay = color.neutral.fill.subtle.$value.rest!;
            expect(overlay!.alpha).to.be.lessThan(1);
            expect(color.accent.fill.subtle.$value.rest!.alpha ?? 1).to.equal(1);
        });
    });

    describe("the focus stroke", () => {
        it("should have the accent palette and the discernible contrast until they are set", () => {
            const { focusStroke, accent, wcagContrast } = createColorLibrary().tokens.color;

            expect(focusStroke.palette.$value).to.deep.equal(accent.palette.$value);
            expect(focusStroke.minContrast.$value).to.equal(wcagContrast.minContrast.discernible.$value);
        });

        it("should follow its palette and its minimum contrast", () => {
            const { focusStroke } = createColorLibrary().tokens.color;
            const before = formatColor(focusStroke.$root.$value);

            focusStroke.minContrast.set(7);
            expect(formatColor(focusStroke.$root.$value)).not.to.equal(before);
            focusStroke.palette.set(createPaletteOkhsl("#336699"));
            expect(focusStroke.palette.$value).to.deep.equal(createPaletteOkhsl("#336699"));
        });

        it("should have the names the tokens had, and be intended for strokes", () => {
            const { focusStroke } = createColorLibrary().tokens.color;

            expect(focusStroke.$root.name).to.equal("color.focusStroke.$root");
            expect(focusStroke.palette.name).to.equal("color.focusStroke.palette");
            expect(focusStroke.outer.name).to.equal("color.focusStroke.outer");
            expect(getIntendedFor(focusStroke.$root)).to.deep.equal([...StylePropertyShorthand.borderFill, StyleProperty.outlineColor]);
            expect(getIntendedFor(focusStroke.inner)).to.deep.equal([...StylePropertyShorthand.borderFill]);
        });
    });

    describe("the sets", () => {
        it("should have the names the tokens had", () => {
            const { color } = createColorLibrary().tokens;

            expect(color.accent.fill.stealth.name).to.equal("color.accent.fill.stealth");
            expect(color.critical.stroke.strong.name).to.equal("color.critical.stroke.strong");
            expect(color.neutral.fill.subtleInverse.name).to.equal("color.neutral.fill.subtleInverse");
        });

        it("should be intended for the fills and the strokes they are for", () => {
            const { color } = createColorLibrary().tokens;

            expect(getIntendedFor(color.accent.fill.ideal)).to.deep.equal([StyleProperty.backgroundFill]);
            expect(getIntendedFor(color.accent.stroke.subtle)).to.deep.equal([...StylePropertyShorthand.borderFill]);
            expect(getIntendedFor(color.accent.stroke.readable)).to.deep.equal([...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill]);
        });

        it("should follow the palette, and the context", () => {
            const { color } = createColorLibrary().tokens;
            const before = formatColor(color.accent.fill.readable.$value.rest!);

            color.accent.base.set(hex("#336699"));
            const afterPalette = formatColor(color.accent.fill.readable.$value.rest!);
            color.context.set(hex("#202020"));

            expect(afterPalette).not.to.equal(before);
            expect(formatColor(color.accent.fill.readable.$value.rest!)).not.to.equal(afterPalette);
        });

        it("should be in the CSS as the rest and a property for each state", () => {
            const library = createColorLibrary();
            const css = toCSS(library, { converters: adaptiveConverters(library) });

            expect(css).to.match(/--color-accent-fill-readable:#[0-9a-f]{6};--color-accent-fill-readable-hover:#[0-9a-f]{6};/);
            expect(css).to.include("--color-accent-stroke-strong-disabled:");
        });

        it("should not write what only a recipe reads to CSS: the deltas, the minimum contrasts, the level, and the switches", () => {
            const library = createColorLibrary();
            const css = toCSS(library, { converters: adaptiveConverters(library) });

            expect(css).not.to.include("--color-deltas-");
            expect(css).not.to.include("--color-disabled-fillDelta");
            expect(css).not.to.include("--color-wcagContrast-minContrast-");
            expect(css).not.to.include("--color-focusStroke-minContrast");
            expect(css).not.to.include("--color-wcagContrast-level");
            expect(css).not.to.include("--color-neutral-asOverlay");
        });
    });

    describe("a palette of a system", () => {
        type Tokens = ColorLibraryTokens & {
            brand: { primary: DesignToken.Color };
            color: { brand: { palette: PaletteToken; foreground: InteractiveToken<Color>; restOnly: InteractiveToken<Color> } & ColorSetTokens };
        };

        const tokens = refs<Tokens>();
        // A background that has only a rest.
        const restOf = recipes({ restOf: (set: InteractiveColorSet): InteractiveColorSet => ({ rest: set.rest }) }).restOf;
        const create = () =>
            Library.create<Tokens>({
                brand: { primary: { $type: DesignToken.Type.Color, $value: hex("#336699") } },
                color: {
                    ...colorConfig,
                    brand: {
                        palette: {
                            $type: AdaptiveDesignToken.palette,
                            $value: paletteRecipes.paletteFrom(tokens.brand.primary, tokens.color.paletteOptions.stepSize),
                        },
                        ...createColorSets<Tokens>({ palette: tokens.color.brand.palette }),
                        foreground: blackOrWhiteReadable<Tokens>(tokens.color.brand.fill.readable),
                        restOnly: blackOrWhiteReadable<Tokens>(restOf(tokens.color.brand.fill.readable)),
                    },
                },
            });

        it("should have the sets that the default palettes have, made by createColorSets, and follow its color", () => {
            const { brand, color } = create().tokens;
            const palette = createPaletteOkhsl(hex("#336699"));
            const reference = color.context.$value;

            expect(color.brand.fill.subtle.$value.rest!).to.deep.equal(
                swatchAt(color.brand.palette.$value, closestSwatchIndex(color.brand.palette.$value, reference) + 3)
            );
            expect(color.brand.palette.$value).to.deep.equal(palette);
            const before = formatColor(color.brand.fill.readable.$value.rest!);
            brand.primary.set(hex("#F26C0D"));
            expect(formatColor(color.brand.fill.readable.$value.rest!)).not.to.equal(before);
        });

        it("should have the same sets as the accent for the same color", () => {
            const library = create();
            const { color } = library.tokens;
            color.accent.base.set(hex("#336699"));

            expect(format(color.brand.stroke.discernible.$value)).to.deep.equal(format(color.accent.stroke.discernible.$value));
        });

        it("should have a foreground that is black or white for each state of its background", () => {
            const { color } = create().tokens;
            const { foreground, fill } = color.brand;

            expect(foreground.$value.rest!).to.deep.equal(
                blackOrWhiteByContrast(fill.readable.$value.rest!, color.wcagContrast.minContrast.readable.$value, false)
            );
            expect(foreground.name).to.equal("color.brand.foreground");
            expect(getIntendedFor(foreground)).to.deep.equal([StyleProperty.foregroundFill]);
        });

        it("should have only the states that its background has, and leave out the others", () => {
            const { color } = create().tokens;

            expect(color.brand.restOnly.$value).to.deep.equal({ rest: color.brand.foreground.$value.rest });
            expect(Object.keys(color.brand.restOnly.$value)).to.deep.equal(["rest"]);
        });

        it("should have the disabled foreground at 30% alpha, as it was", () => {
            const { color } = create().tokens;

            expect(color.brand.foreground.$value.disabled!.alpha).to.equal(0.3);
            expect(color.brand.foreground.$value.rest!.alpha ?? 1).to.equal(1);
        });
    });
});

