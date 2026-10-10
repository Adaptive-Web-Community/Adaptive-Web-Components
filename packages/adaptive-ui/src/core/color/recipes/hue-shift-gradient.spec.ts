import chai from "chai";
import { modeOkhsl, useMode } from "culori/fn";
import { Color } from "../color.js";
import { LinearGradient } from "../gradient.js";
import { PaletteOkhsl } from "../palette-okhsl.js";
import { PaletteDirectionValue } from "../palette.js";
import { _white } from "../utilities/color-constants.js";
import { hueShiftGradient } from "./hue-shift-gradient.js";

const { expect } = chai;

const okhsl = useMode(modeOkhsl);

const palette = PaletteOkhsl.from("#0078D4");
const hueOf = (color: Color) => okhsl(color.color).h!;

describe("hueShiftGradient", (): void => {
    it("should create a linear gradient with three stops", (): void => {
        const gradient = hueShiftGradient(palette, _white, 20, 45, undefined, undefined, PaletteDirectionValue.darker);

        expect(gradient).to.be.instanceOf(LinearGradient);
        expect((gradient as LinearGradient).angle).to.equal(45);
        expect(gradient.stops).to.have.length(3);
        expect(gradient.stops.map(s => s.position)).to.deep.equal([
            { value: 0, unit: "%" },
            { value: 0.5, unit: "%" },
            { value: 1, unit: "%" },
        ]);
    });

    it("should use the palette delta for the center color", (): void => {
        const gradient = hueShiftGradient(palette, _white, 20, undefined, undefined, undefined, PaletteDirectionValue.darker);

        expect(gradient.stops[1].color).to.equal(palette.delta(_white, 20, PaletteDirectionValue.darker));
    });

    it("should shift the hue of the start and end colors by the default amounts", (): void => {
        const gradient = hueShiftGradient(palette, _white, 20, undefined, undefined, undefined, PaletteDirectionValue.darker);
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        // Gamut clamping and rgb conversion can nudge the hue slightly.
        expect(start).to.approximately(center - 15, 3);
        expect(end).to.approximately(center + 15, 3);
    });

    it("should shift the hue by the provided amounts", (): void => {
        const gradient = hueShiftGradient(palette, _white, 20, 0, -40, 25, PaletteDirectionValue.darker);
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(start).to.approximately(center - 40, 4);
        expect(end).to.approximately(center + 25, 4);
    });

    it("should wrap the hue when shifting below zero", (): void => {
        // A red source has a hue near 30, so shifting by -60 wraps below 0.
        const red = PaletteOkhsl.from("#ff0000");
        const gradient = hueShiftGradient(red, _white, 20, 0, -60, 0, PaletteDirectionValue.darker);
        const [start, center] = gradient.stops.map(s => hueOf(s.color));

        expect(center).to.be.lessThan(60);
        expect(start).to.be.greaterThan(300);
    });

    it("should wrap the hue when shifting above 360", (): void => {
        const centerHue = hueOf(palette.delta(_white, 20, PaletteDirectionValue.darker));
        // Shift far enough to pass 360 and land 20 degrees past zero.
        const shift = 360 - centerHue + 20;
        const gradient = hueShiftGradient(palette, _white, 20, 0, 0, shift, PaletteDirectionValue.darker);
        const [, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(center).to.approximately(centerHue, 2);
        expect(end).to.approximately(20, 4);
    });

    it("should not shift the hue with zero shifts", (): void => {
        const gradient = hueShiftGradient(palette, _white, 20, 0, 0, 0, PaletteDirectionValue.darker);
        const [start, center, end] = gradient.stops.map(s => hueOf(s.color));

        expect(start).to.approximately(center, 2);
        expect(end).to.approximately(center, 2);
    });

    it("should default the direction based on the reference", (): void => {
        const dark = palette.swatches[palette.lastIndex];
        const fromLight = hueShiftGradient(palette, _white, 5);
        const fromDark = hueShiftGradient(palette, dark, 5);

        expect(fromLight.stops[1].color.relativeLuminance).to.be.lessThan(_white.relativeLuminance);
        expect(fromDark.stops[1].color.relativeLuminance).to.be.greaterThan(dark.relativeLuminance);
    });
});
