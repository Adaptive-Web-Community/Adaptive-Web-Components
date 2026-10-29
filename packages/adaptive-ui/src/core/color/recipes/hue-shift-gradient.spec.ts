import chai from "chai";
import { modeOkhsl, useMode } from "culori/fn";
import { Color, colorLuminance, toCulori } from "../color.js";
import { LinearGradient } from "../gradient.js";
import { createPaletteOkhsl } from "../palette-okhsl.js";
import { PaletteDirection } from "../palette.js";
import { white } from "../utilities/color-constants.js";
import { deltaColor } from "./delta-color.js";
import { hueShiftGradient } from "./hue-shift-gradient.js";

const { expect } = chai;

const okhsl = useMode(modeOkhsl);

const palette = createPaletteOkhsl("#0078D4");
const hueOf = (color: Color) => okhsl(toCulori(color)).h!;

describe("hueShiftGradient", (): void => {
    it("should create a linear gradient with three stops", (): void => {
        const gradient = hueShiftGradient(palette, white, 20, { angle: 45, direction: PaletteDirection.darker });

        expect(gradient.type).to.equal("linear");
        expect((gradient as LinearGradient).angle).to.equal(45);
        expect(gradient.stops).to.have.length(3);
        expect(gradient.stops.map(s => s.position)).to.deep.equal([
            { value: 0, unit: "%" },
            { value: 0.5, unit: "%" },
            { value: 1, unit: "%" },
        ]);
    });

    it("should use the palette delta for the center color", (): void => {
        const gradient = hueShiftGradient(palette, white, 20, { direction: PaletteDirection.darker });

        expect(gradient.stops[1].color).to.equal(deltaColor(palette, white, 20, PaletteDirection.darker));
    });

    it("should shift the hue of the start and end colors by the default amounts", (): void => {
        const gradient = hueShiftGradient(palette, white, 20, { direction: PaletteDirection.darker });
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        // Gamut clamping and rgb conversion can nudge the hue slightly.
        expect(start).to.approximately(center - 15, 3);
        expect(end).to.approximately(center + 15, 3);
    });

    it("should shift the hue by the provided amounts", (): void => {
        const gradient = hueShiftGradient(palette, white, 20, { angle: 0, startShift: -40, endShift: 25, direction: PaletteDirection.darker });
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(start).to.approximately(center - 40, 4);
        expect(end).to.approximately(center + 25, 4);
    });

    it("should wrap the hue when shifting below zero", (): void => {
        // A red source has a hue near 30, so shifting by -60 wraps below 0.
        const red = createPaletteOkhsl("#ff0000");
        const gradient = hueShiftGradient(red, white, 20, { angle: 0, startShift: -60, endShift: 0, direction: PaletteDirection.darker });
        const [start, center] = gradient.stops.map(s => hueOf(s.color));

        expect(center).to.be.lessThan(60);
        expect(start).to.be.greaterThan(300);
    });

    it("should wrap the hue when shifting above 360", (): void => {
        const centerHue = hueOf(deltaColor(palette, white, 20, PaletteDirection.darker));
        // Shift far enough to pass 360 and land 20 degrees past zero.
        const shift = 360 - centerHue + 20;
        const gradient = hueShiftGradient(palette, white, 20, { angle: 0, startShift: 0, endShift: shift, direction: PaletteDirection.darker });
        const [, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(center).to.approximately(centerHue, 2);
        expect(end).to.approximately(20, 4);
    });

    it("should not shift the hue with zero shifts", (): void => {
        const gradient = hueShiftGradient(palette, white, 20, { angle: 0, startShift: 0, endShift: 0, direction: PaletteDirection.darker });
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(start).to.approximately(center, 2);
        expect(end).to.approximately(center, 2);
    });

    it("should default the direction based on the reference", (): void => {
        const dark = palette.swatches[palette.swatches.length - 1];
        const fromLight = hueShiftGradient(palette, white, 5);
        const fromDark = hueShiftGradient(palette, dark, 5);

        expect(colorLuminance(fromLight.stops[1].color)).to.be.lessThan(colorLuminance(white));
        expect(colorLuminance(fromDark.stops[1].color)).to.be.greaterThan(colorLuminance(dark));
    });
});
