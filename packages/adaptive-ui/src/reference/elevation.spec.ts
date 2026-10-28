import chai from "chai";
import { DesignToken, override, toCSS } from "design-token-library";
import { Color, formatColor, rgbColor, withAlpha } from "../core/color/color.js";
import { StyleProperty } from "../core/styles/properties.js";
import { shadow } from "../core/shadow/index.js";
import { adaptiveConverters } from "../core/token-css.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { createElevationLibrary, elevationRecipes, elevationShadow } from "./elevation.js";

const { expect } = chai;

describe("elevationShadow", () => {
    const grey = rgbColor(0.2, 0.2, 0.2);

    it("should be an ambient shadow and a directional one from the size", () => {
        expect(elevationShadow(grey, 8)).to.deep.equal([shadow(withAlpha(grey, 0.12), 0, 0, 2), shadow(withAlpha(grey, 0.14), 0, 4, 8)]);
    });

    it("should be darker above 16", () => {
        expect(elevationShadow(grey, 16)).to.deep.equal([shadow(withAlpha(grey, 0.12), 0, 0, 2), shadow(withAlpha(grey, 0.14), 0, 8, 16)]);
        expect(elevationShadow(grey, 17)).to.deep.equal([shadow(withAlpha(grey, 0.2), 0, 0, 2), shadow(withAlpha(grey, 0.24), 0, 8.5, 17)]);
    });
});

describe("elevation", () => {
    it("should cast the shadows in the rest of the strong neutral stroke", () => {
        const library = createElevationLibrary();

        expect(library.tokens.elevation.color.$value).to.deep.equal(library.tokens.color.neutral.stroke.strong.$value.rest);
    });

    it("should have the shadow of each level from its size, as before", () => {
        const { elevation } = createElevationLibrary().tokens;
        const color = elevation.color.$value;

        expect(elevation.tooltip.$root.$value).to.deep.equal(elevationShadow(color, 8));
        expect(elevation.flyout.$root.$value).to.deep.equal(elevationShadow(color, 16));
        expect(elevation.dialog.$root.$value).to.deep.equal(elevationShadow(color, 32));
    });

    it("should have the shadow of each state of a card from its size", () => {
        const { elevation } = createElevationLibrary().tokens;
        const card = elevation.card.$root.$value;
        const color = elevation.color.$value;

        expect(card.rest).to.deep.equal(elevationShadow(color, 4));
        expect(card.hover).to.deep.equal(elevationShadow(color, 6));
        expect(card.active).to.deep.equal(elevationShadow(color, 2));
        expect(card.focus).to.deep.equal(elevationShadow(color, 4));
        expect(card.disabled).to.deep.equal(elevationShadow(color, 0));
    });

    it("should follow a change to a size or to the color", () => {
        const base = createElevationLibrary();
        const red = { colorSpace: "srgb" as const, components: [1, 0, 0] as [number, number, number] };
        const tuned = base.extend({
            elevation: { color: { $value: red }, card: { deltas: { hover: { $value: 12 } } }, dialog: { size: { $value: 40 } } },
        });
        const { elevation } = tuned.tokens;

        expect(elevation.card.$root.$value.hover).to.deep.equal(elevationShadow(red, 12));
        expect(elevation.dialog.$root.$value).to.deep.equal(elevationShadow(red, 40));
        expect(base.tokens.elevation.dialog.$root.$value).to.deep.equal(elevationShadow(base.tokens.elevation.color.$value, 32));
    });

    it("should take another recipe for every shadow", () => {
        const flat = (color: Color, size: number): DesignToken.Values.Readonly.Shadow => shadow(withAlpha(color, 0.5), 0, size);
        const library = createElevationLibrary().extend({}, { recipes: [override(elevationRecipes.elevationShadow, flat)] });
        const { elevation } = library.tokens;

        expect(elevation.tooltip.$root.$value).to.deep.equal(flat(elevation.color.$value, 8));
        expect(elevation.card.$root.$value.hover).to.deep.equal(flat(elevation.color.$value, 6));
    });

    it("should be intended for the shadow where the type doesn't say so", () => {
        const { elevation } = createElevationLibrary().tokens;

        expect(getIntendedFor(elevation.tooltip.$root)).to.deep.equal([]);
        expect(getIntendedFor(elevation.card.$root)).to.deep.equal([StyleProperty.shadow]);
    });

    describe("CSS", () => {
        const library = createElevationLibrary();
        const css = toCSS(library, { converters: adaptiveConverters(library) });

        it("should write a level as a box-shadow of two layers", () => {
            expect(css).to.include(`--elevation-tooltip:0px 0px 2px 0px `);
            expect(css).to.match(/--elevation-tooltip:0px 0px 2px 0px [^,;]+, 0px 4px 8px 0px [^;]+;/);
        });

        it("should write the card as the rest and a property for each state", () => {
            expect(css).to.match(/--elevation-card:0px 0px 2px 0px [^;]+;--elevation-card-hover:0px 0px 2px 0px [^,;]+, 0px 3px 6px 0px /);
            expect(css).to.include("--elevation-card-disabled:");
        });

        it("should write the color of the shadows", () => {
            expect(css).to.include(`--elevation-color:${formatColor(library.tokens.elevation.color.$value)};`);
        });

        it("should not write the sizes, which only the recipe reads", () => {
            expect(css).not.to.include("--elevation-dialog-size");
            expect(css).not.to.include("--elevation-card-deltas");
        });
    });
});
