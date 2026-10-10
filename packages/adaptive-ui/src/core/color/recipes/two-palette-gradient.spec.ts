import chai from "chai";
import { Color } from "../color.js";
import { LinearGradient } from "../gradient.js";
import { BasePalette } from "../palette-base.js";
import { PaletteDirectionValue } from "../palette.js";
import { luminanceSwatch } from "../utilities/luminance-swatch.js";
import { twoPaletteGradient } from "./two-palette-gradient.js";

const { expect } = chai;

const greys: Color[] = Array.from({ length: 11 }, (_, i) => luminanceSwatch(1 - i / 10));
const reds: Color[] = Array.from({ length: 11 }, (_, i) => Color.fromRgb(1 - i / 10, 0, 0));
const greyPalette = new BasePalette(greys[5], greys);
// Same luminance order as grey would not hold, so reference lookups use luminance of the reference only.
const redPalette = new BasePalette(reds[5], reds);

describe("twoPaletteGradient", (): void => {
    it("should create a linear gradient", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[2], 1, 45, PaletteDirectionValue.darker);

        expect(gradient).to.be.instanceOf(LinearGradient);
        expect(gradient.type).to.equal("linear");
        expect((gradient as LinearGradient).angle).to.equal(45);
    });

    it("should have a start and end stop from each palette", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[2], 2, 0, PaletteDirectionValue.darker);

        expect(gradient.stops).to.have.length(2);
        expect(gradient.stops[0].color).to.equal(greys[4]);
        expect(gradient.stops[0].position).to.deep.equal({ value: 0, unit: "%" });
        expect(gradient.stops[1].color).to.equal(redPalette.delta(greys[2], 2, PaletteDirectionValue.darker));
        expect(gradient.stops[1].color).not.to.equal(gradient.stops[0].color);
        expect(gradient.stops[1].position).to.deep.equal({ value: 1, unit: "%" });
    });

    it("should default the angle to 0", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[2], 1) as LinearGradient;

        expect(gradient.angle).to.equal(0);
    });

    it("should default the direction based on the reference", (): void => {
        const fromLight = twoPaletteGradient(greyPalette, redPalette, greys[0], 1);
        const fromDark = twoPaletteGradient(greyPalette, redPalette, greys[10], 1);

        expect(fromLight.stops[0].color).to.equal(greys[1]);
        expect(fromDark.stops[0].color).to.equal(greys[9]);
    });

    it("should honor an explicit direction", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[5], 2, undefined, PaletteDirectionValue.lighter);

        expect(gradient.stops[0].color).to.equal(greys[3]);
    });

    it("should write the css with both colors", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[0], 5, 90, PaletteDirectionValue.darker);

        expect(gradient.toString()).to.equal(`linear-gradient(90deg, ${greys[5]} 0%, ${redPalette.get(5)} 100%)`);
    });
});
