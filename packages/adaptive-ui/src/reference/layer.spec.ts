import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { hex, toCSS } from "design-token-library";
import { formatColor } from "../core/color/color.js";
import { StyleProperty } from "../core/modules/types.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { adaptiveConverters } from "../core/token-css.js";
import { createLayerLibrary, LayerBaseLuminance } from "./layer.js";

const { expect } = chai;

const snapshot = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/reference/parity.snapshot.json"), "utf8")
);

type Library = ReturnType<typeof createLayerLibrary>;

const positions = ["minus4", "minus3", "minus2", "minus1", "base", "plus1", "plus2", "plus3", "plus4"] as const;
const states = ["rest", "hover", "active", "focus", "disabled"] as const;
const luminances: Record<string, number> = { light: LayerBaseLuminance.LightMode, dark: LayerBaseLuminance.DarkMode };

// The layer that is the context for the content within it, as the nesting of the parity snapshot has them.
const nesting: Record<string, (library: Library) => string> = {
    "0-base": library => formatColor(library.tokens.color.layer.fill.ramp.base.$value),
    "1-fixed-plus1": library => formatColor(library.tokens.color.layer.fill.ramp.plus1.$value),
    "2-interactive": library => formatColor(library.tokens.color.layer.fill.interactive.$value.rest!),
};

describe("layers", () => {
    describe("compared to the parity snapshot", () => {
        Object.keys(snapshot.scenarios).forEach(key => {
            const [baseName, mode, level] = key.split("/");
            const scenario = snapshot.scenarios[key];

            it(`should have the layers of ${key}`, () => {
                let library = createLayerLibrary();
                const base = snapshot.palettes[baseName].bases["color.neutral.base"];
                if (baseName !== "default") {
                    library = library.extend({
                        color: { neutral: { base: { $value: hex(base) } }, accent: { base: { $value: hex(base) } } },
                    });
                }
                library = library.extend({ color: { layer: { fill: { ramp: { baseLuminance: { $value: luminances[mode] } } } } } });

                // Each level is the library of the one before, extended with the layer as the context.
                for (const name of Object.keys(nesting)) {
                    library = library.extend({ color: { context: { $value: hex(nesting[name](library)) } } });
                    if (name === level) {
                        break;
                    }
                }

                const { fill } = library.tokens.color.layer;
                expect(formatColor(library.tokens.color.context.$value)).to.equal(scenario.context);
                positions.forEach(position => {
                    expect(formatColor(fill.ramp[position].$value), position).to.equal(scenario.layers[`color.layer.fill.ramp.${position}`]);
                });
                states.forEach(state => {
                    expect(formatColor(fill.interactive.$value[state]!), state).to.equal(scenario.layers[`color.layer.fill.interactive.${state}`]);
                });
            });
        });
    });

    it("should differ between light and dark layers", () => {
        const light = createLayerLibrary();
        const dark = light.extend({ color: { layer: { fill: { ramp: { baseLuminance: { $value: LayerBaseLuminance.DarkMode } } } } } });

        expect(formatColor(dark.tokens.color.layer.fill.ramp.base.$value)).not.to.equal(
            formatColor(light.tokens.color.layer.fill.ramp.base.$value)
        );
    });

    describe("the rest delta", () => {
        it("should be the step between the fixed layers and the rest of the interactive fill", () => {
            const library = createLayerLibrary();
            const tuned = library.extend({ color: { layer: { fill: { restDelta: { $value: -4 } } } } });
            const { fill } = tuned.tokens.color.layer;

            expect(fill.interactiveDeltas.rest.$value).to.equal(-4);
            expect(formatColor(fill.ramp.minus1.$value)).not.to.equal(formatColor(library.tokens.color.layer.fill.ramp.minus1.$value));
            expect(formatColor(fill.interactive.$value.rest!)).not.to.equal(
                formatColor(library.tokens.color.layer.fill.interactive.$value.rest!)
            );
        });

        it("should have the deltas the tokens had", () => {
            const { fill } = createLayerLibrary().tokens.color.layer;

            expect(fill.restDelta.$value).to.equal(-2);
            expect([fill.interactiveDeltas.hover, fill.interactiveDeltas.active, fill.interactiveDeltas.focus, fill.interactiveDeltas.disabled].map(d => d.$value)).to.deep.equal([-3, -1, -3, -1]);
        });
    });

    describe("the palette", () => {
        it("should be the neutral palette until it is set, and follow it", () => {
            const library = createLayerLibrary();
            const before = formatColor(library.tokens.color.layer.fill.ramp.minus2.$value);

            expect(library.tokens.color.layer.palette.$value).to.deep.equal(library.tokens.color.neutral.palette.$value);
            library.tokens.color.neutral.base.set(hex("#336699"));
            expect(formatColor(library.tokens.color.layer.fill.ramp.minus2.$value)).not.to.equal(before);
        });
    });

    describe("the interactive fill", () => {
        it("should follow the context", () => {
            const library = createLayerLibrary();
            const before = formatColor(library.tokens.color.layer.fill.interactive.$value.rest!);

            library.tokens.color.context.set(hex("#808080"));

            expect(formatColor(library.tokens.color.layer.fill.interactive.$value.rest!)).not.to.equal(before);
        });

        it("should be in the CSS as the rest and a property for each state", () => {
            const library = createLayerLibrary();
            const css = toCSS(library, { converters: adaptiveConverters(library) });

            expect(css).to.match(/--color-layer-fill-interactive:#[0-9a-f]{6};--color-layer-fill-interactive-hover:#[0-9a-f]{6};/);
            expect(css).to.include("--color-layer-fill-interactive-disabled:");
        });

        it("should not write the deltas to CSS, which only a recipe reads", () => {
            const library = createLayerLibrary();
            const css = toCSS(library, { converters: adaptiveConverters(library) });

            expect(css).not.to.include("--color-layer-fill-restDelta");
            expect(css).not.to.include("--color-layer-fill-interactiveDeltas");
        });
    });

    it("should be intended for the background fill", () => {
        const { fill } = createLayerLibrary().tokens.color.layer;

        expect(getIntendedFor(fill.ramp.base)).to.deep.equal([StyleProperty.backgroundFill]);
        expect(getIntendedFor(fill.interactive)).to.deep.equal([StyleProperty.backgroundFill]);
    });

    it("should have the names the tokens had", () => {
        const { layer } = createLayerLibrary().tokens.color;

        expect(layer.palette.name).to.equal("color.layer.palette");
        expect(layer.fill.ramp.plus1.name).to.equal("color.layer.fill.ramp.plus1");
        expect(layer.fill.ramp.baseLuminance.name).to.equal("color.layer.fill.ramp.baseLuminance");
        expect(layer.fill.interactive.name).to.equal("color.layer.fill.interactive");
    });
});
