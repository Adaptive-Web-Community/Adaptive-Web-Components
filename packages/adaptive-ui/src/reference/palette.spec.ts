import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DesignToken, hex, Library, refs, toCSS } from "design-token-library";
import { formatColor } from "../core/color/color.js";
import { createPaletteOkhsl } from "../core/color/palette-okhsl.js";
import { StyleProperty } from "../core/modules/types.js";
import { AdaptiveDesignToken, PaletteToken } from "../core/token-types.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { adaptiveConverters } from "../core/token-css.js";
import { createPaletteLibrary, PaletteLibraryTokens, paletteRecipes, palettes } from "./palette.js";

const { expect } = chai;

const snapshot = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/reference/parity.snapshot.json"), "utf8")
);

const names = ["neutral", "accent", "highlight", "critical", "warning", "success", "info"] as const;
const swatches = (palette: { swatches: ReadonlyArray<any> }) => palette.swatches.map(formatColor);

describe("palettes", () => {
    it("should have the base colors they had", () => {
        const { color } = createPaletteLibrary().tokens;
        const bases = snapshot.palettes.default.bases;

        names.forEach(name => {
            expect(formatColor(color[name].base.$value), name).to.equal(bases[`color.${name}.base`]);
        });
    });

    it("should have the palettes they had, for the default and for other base colors", () => {
        Object.entries<any>(snapshot.palettes).forEach(([key, expected]) => {
            const library = createPaletteLibrary();
            // The snapshot sets the neutral and the accent from one color, the others are the default.
            if (key !== "default") {
                const base = hex(expected.bases["color.neutral.base"]);
                library.tokens.color.neutral.base.set(base);
                library.tokens.color.accent.base.set(base);
            }
            names.forEach(name => {
                expect(swatches(library.tokens.color[name].palette.$value), `${key} ${name}`).to.deep.equal(
                    expected.palettes[`color.${name}.palette`]
                );
            });
            expect(swatches(library.tokens.color.disabled.palette.$value), `${key} disabled`).to.deep.equal(
                expected.palettes["color.disabled.palette"]
            );
        });
    });

    it("should be made from the base color, and follow it", () => {
        const { color } = createPaletteLibrary().tokens;
        const before = swatches(color.accent.palette.$value);

        color.accent.base.set(hex("#336699"));

        expect(swatches(color.accent.palette.$value)).not.to.deep.equal(before);
        expect(color.accent.palette.$value).to.deep.equal(createPaletteOkhsl(hex("#336699")));
    });

    it("should follow the options of the palettes", () => {
        const { color } = createPaletteLibrary().tokens;

        color.paletteOptions.stepSize.set(10);

        expect(color.neutral.palette.$value.swatches.length).to.equal(10);
        expect(color.disabled.palette.$value.swatches.length).to.equal(10);
    });

    it("should have the 66 swatches by default, from the step of 1.5 points", () => {
        const { color } = createPaletteLibrary().tokens;

        expect(color.paletteOptions.stepSize.$value).to.equal(1.5);
        expect(color.neutral.palette.$value.swatches.length).to.equal(66);
    });

    it("should have a disabled palette that is the neutral palette until it is set", () => {
        const { color } = createPaletteLibrary().tokens;
        const own = createPaletteOkhsl("#336699");

        expect(color.disabled.palette.$value).to.deep.equal(color.neutral.palette.$value);
        color.disabled.palette.set(own);
        expect(color.disabled.palette.$value).to.deep.equal(own);
    });

    it("should be made by any system for a color of its own, with paletteFrom", () => {
        type Tokens = PaletteLibraryTokens & {
            brand: { primary: DesignToken.Color };
            color: { brand: { palette: PaletteToken } };
        };
        const tokens = refs<Tokens>();
        const library = Library.create<Tokens>({
            color: {
                ...palettes,
                brand: {
                    palette: {
                        $type: AdaptiveDesignToken.palette,
                        $value: paletteRecipes.paletteFrom(tokens.brand.primary, tokens.color.paletteOptions.stepSize),
                    },
                },
            },
            brand: { primary: { $type: DesignToken.Type.Color, $value: hex("#336699") } },
        });
        const { brand, color } = library.tokens;

        expect(brand.primary.$value).to.deep.equal(hex("#336699"));
        expect(color.brand.palette.$value).to.deep.equal(createPaletteOkhsl(hex("#336699")));
        // It follows the color it is made from and the options of the palettes.
        brand.primary.set(hex("#F26C0D"));
        expect(color.brand.palette.$value).to.deep.equal(createPaletteOkhsl(hex("#F26C0D")));
        color.paletteOptions.stepSize.set(10);
        expect(color.brand.palette.$value.swatches.length).to.equal(10);
    });

    it("should have the names the tokens had", () => {
        const { color } = createPaletteLibrary().tokens;

        expect(color.neutral.base.name).to.equal("color.neutral.base");
        expect(color.critical.palette.name).to.equal("color.critical.palette");
        expect(color.paletteOptions.stepSize.name).to.equal("color.paletteOptions.stepSize");
        expect(color.disabled.palette.name).to.equal("color.disabled.palette");
    });

    it("should have base colors intended for the background fill", () => {
        expect(getIntendedFor(createPaletteLibrary().tokens.color.accent.base)).to.deep.equal([StyleProperty.backgroundFill]);
    });

    it("should write the base colors and the options as CSS, and not the palettes", () => {
        const library = createPaletteLibrary();
        const css = toCSS(library, { converters: adaptiveConverters(library) });

        expect(css).to.include("--color-neutral-base:#808080;");
        expect(css).to.include("--color-paletteOptions-stepSize:1.5;");
        expect(css).not.to.include("--color-neutral-palette");
    });
});
