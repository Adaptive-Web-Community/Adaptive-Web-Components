import chai from "chai";
import { Color, formatColor, rgbColor } from "../color.js";
import { formatGradient, LinearGradient } from "../gradient.js";
import { createPalette, PaletteDirection, swatchAt } from "../palette.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { deltaColor } from "./delta-color.js";
import { twoPaletteGradient } from "./two-palette-gradient.js";

const { expect } = chai;

const greys: Color[] = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
const reds: Color[] = Array.from({ length: 11 }, (_, i) => rgbColor(1 - i / 10, 0, 0));
const greyPalette = createPalette(greys[5], greys);
// Same luminance order as grey would not hold, so reference lookups use luminance of the reference only.
const redPalette = createPalette(reds[5], reds);

describe("twoPaletteGradient", (): void => {
    it("should create a linear gradient", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[2], 1, { angle: 45, direction: PaletteDirection.darker });

        expect(gradient.type).to.equal("linear");
        expect((gradient as LinearGradient).angle).to.equal(45);
    });

    it("should have a start and end stop from each palette", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[2], 2, { angle: 0, direction: PaletteDirection.darker });

        expect(gradient.stops).to.have.length(2);
        expect(gradient.stops[0].color).to.equal(greys[4]);
        expect(gradient.stops[0].position).to.deep.equal({ value: 0, unit: "%" });
        expect(gradient.stops[1].color).to.equal(deltaColor(redPalette, greys[2], 2, PaletteDirection.darker));
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
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[5], 2, { direction: PaletteDirection.lighter });

        expect(gradient.stops[0].color).to.equal(greys[3]);
    });

    it("should write the css with both colors", (): void => {
        const gradient = twoPaletteGradient(greyPalette, redPalette, greys[0], 5, { angle: 90, direction: PaletteDirection.darker });

        expect(formatGradient(gradient)).to.equal(
            `linear-gradient(90deg, ${formatColor(greys[5])} 0%, ${formatColor(swatchAt(redPalette, 5))} 100%)`
        );
    });
});
