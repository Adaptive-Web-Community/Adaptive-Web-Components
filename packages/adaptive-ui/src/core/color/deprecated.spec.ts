import chai from "chai";
import {
    _black,
    _white,
    Color,
    ConicGradient,
    contrastAndDeltaSwatchSet,
    contrastSwatch,
    conditionalSwatchSet,
    deltaSwatch,
    deltaSwatchSet,
    idealColorDeltaSwatchSet,
    interactiveSwatchSetAsOverlay,
    LinearGradient,
    luminanceSwatch,
    PaletteDirectionValue,
    PaletteOkhsl,
    PaletteRGB,
    RadialGradient,
    resolvePaletteDirection,
    swatchAsOverlay,
} from "./deprecated.js";
import { formatColor, isTransparent, parseColor, rgbColor, transparent, withAlpha } from "./color.js";
import { conicGradient, GradientStop, linearGradient, radialGradient } from "./gradient.js";
import { createPaletteOkhsl } from "./palette-okhsl.js";
import { createPaletteRGB } from "./palette-rgb.js";
import { PaletteDirection } from "./palette.js";
import { contrastAndDeltaColorSet } from "./recipes/contrast-and-delta-color-set.js";
import { contrastColor } from "./recipes/contrast-color.js";
import { deltaColor } from "./recipes/delta-color.js";
import { deltaColorSet } from "./recipes/delta-color-set.js";
import { idealColorDeltaSet } from "./recipes/ideal-color-delta-set.js";
import { black, white } from "./utilities/color-constants.js";
import { conditionalColorSet } from "./utilities/conditional.js";
import { luminanceColor } from "./utilities/luminance-color.js";
import { asOverlay, colorAsOverlay, colorSetAsOverlay } from "./utilities/opacity.js";

const { expect } = chai;

const palette = createPaletteRGB("#336699");
const other = createPaletteOkhsl("#d83b01");
const reference = palette.swatches[10];
const stops: GradientStop[] = [
    { color: rgbColor(1, 0, 0), position: { value: 0, unit: "%" } },
    { color: rgbColor(0, 0, 1), position: { value: 1, unit: "%" } },
];

describe("deprecated names", () => {
    describe("that are renamed", () => {
        it("should be what they were renamed to", () => {
            expect(_black).to.equal(black);
            expect(_white).to.equal(white);
            expect(luminanceSwatch).to.equal(luminanceColor);
            expect(swatchAsOverlay).to.equal(colorAsOverlay);
            expect(interactiveSwatchSetAsOverlay).to.equal(colorSetAsOverlay);
            expect(conditionalSwatchSet).to.equal(conditionalColorSet);
            expect(deltaSwatch).to.equal(deltaColor);
            expect(contrastSwatch).to.equal(contrastColor);
            expect(PaletteDirectionValue).to.equal(PaletteDirection);
        });
    });

    describe("resolvePaletteDirection", () => {
        it("should return a direction as is, and call a function", () => {
            expect(resolvePaletteDirection(PaletteDirection.darker)).to.equal(1);
            expect(resolvePaletteDirection(() => PaletteDirection.lighter)).to.equal(-1);
        });
    });

    describe("recipes with the deltas as arguments", () => {
        const darker = PaletteDirection.darker;
        const deltas = { rest: 0, hover: 1, active: 2, focus: 3, disabled: 4 };

        it("deltaSwatchSet should be deltaColorSet", () => {
            expect(deltaSwatchSet(palette, reference, 0, 1, 2, 3, 4, other, darker, true)).to.deep.equal(
                deltaColorSet(palette, reference, deltas, { disabledPalette: other, direction: darker, zeroAsTransparent: true })
            );
        });

        it("deltaSwatchSet should default what is not given", () => {
            expect(deltaSwatchSet(palette, reference, 2, 3, 4, 5)).to.deep.equal(
                deltaColorSet(palette, reference, { rest: 2, hover: 3, active: 4, focus: 5, disabled: 2 })
            );
            expect(deltaSwatchSet(palette, reference, 2, 3, 4, 5, 6, undefined, undefined, undefined)).to.deep.equal(
                deltaColorSet(palette, reference, { rest: 2, hover: 3, active: 4, focus: 5, disabled: 6 })
            );
        });

        it("should take a direction that is a function", () => {
            expect(deltaSwatchSet(palette, reference, 1, 2, 3, 4, 5, palette, () => darker)).to.deep.equal(
                deltaColorSet(palette, reference, { rest: 1, hover: 2, active: 3, focus: 4, disabled: 5 }, { direction: darker })
            );
        });

        it("contrastAndDeltaSwatchSet should be contrastAndDeltaColorSet", () => {
            expect(contrastAndDeltaSwatchSet(palette, white, 3, 0, 1, 2, 3, 1, other, darker, true)).to.deep.equal(
                contrastAndDeltaColorSet(
                    palette,
                    white,
                    3,
                    { rest: 0, hover: 1, active: 2, focus: 3, disabled: 1 },
                    { disabledPalette: other, direction: darker, zeroAsTransparent: true }
                )
            );
            expect(contrastAndDeltaSwatchSet(palette, white, 3, 0, 1, 2, 3, 1)).to.deep.equal(
                contrastAndDeltaColorSet(palette, white, 3, { rest: 0, hover: 1, active: 2, focus: 3, disabled: 1 })
            );
        });

        it("idealColorDeltaSwatchSet should be idealColorDeltaSet", () => {
            expect(idealColorDeltaSwatchSet(palette, white, 4.5, palette.source, 0, 6, -4, 0, 1, other, darker)).to.deep.equal(
                idealColorDeltaSet(
                    palette,
                    white,
                    4.5,
                    palette.source,
                    { rest: 0, hover: 6, active: -4, focus: 0, disabled: 1 },
                    { disabledPalette: other, direction: darker }
                )
            );
            expect(idealColorDeltaSwatchSet(palette, white, 4.5, palette.source, 0, 6, -4, 0, 1)).to.deep.equal(
                idealColorDeltaSet(palette, white, 4.5, palette.source, { rest: 0, hover: 6, active: -4, focus: 0, disabled: 1 })
            );
        });
    });

    describe("Color", () => {
        it("should have the functions that were static", () => {
            expect(Color.parse("#336699")).to.deep.equal(parseColor("#336699"));
            expect(Color.fromRgb(0.2, 0.4, 0.6, 0.5)).to.deep.equal(rgbColor(0.2, 0.4, 0.6, 0.5));
            expect(Color.from({ r: 0.2, g: 0.4, b: 0.6 })).to.deep.equal(rgbColor(0.2, 0.4, 0.6));
            expect(Color.from({ r: 0.2, g: 0.4, b: 0.6, alpha: 0.5 })).to.deep.equal(rgbColor(0.2, 0.4, 0.6, 0.5));
            expect(Color.transparent).to.equal(transparent);
            expect(Color.isTransparent(transparent)).to.be.true;
            expect(Color.isTransparent(white)).to.be.false;
            expect(Color.asOverlay(white, black)).to.deep.equal(asOverlay(white, black));
            expect(Color.unsafeOpacity(white, 0.5)).to.deep.equal(withAlpha(white, 0.5));
        });

        it("should be usable as the type of a color", () => {
            const color: Color = Color.fromRgb(1, 0, 0);

            expect(formatColor(color)).to.equal("#ff0000");
            expect(isTransparent(color)).to.be.false;
        });
    });

    describe("palettes", () => {
        it("should be created with from", () => {
            expect(PaletteRGB.from("#336699", { stepContrast: 1.2 })).to.deep.equal(createPaletteRGB("#336699", { stepContrast: 1.2 }));
            expect(PaletteOkhsl.from("#336699", { stepCount: 20 })).to.deep.equal(createPaletteOkhsl("#336699", { stepCount: 20 }));
        });
    });

    describe("gradients", () => {
        it("should be created with new", () => {
            expect(new LinearGradient(stops, 45)).to.deep.equal(linearGradient(stops, 45));
            expect(new LinearGradient(stops)).to.deep.equal(linearGradient(stops));
            expect(new RadialGradient(stops)).to.deep.equal(radialGradient(stops));
            expect(
                new ConicGradient(
                    [
                        { color: rgbColor(1, 0, 0), position: { value: 0, unit: "deg" } },
                        { color: rgbColor(0, 0, 1), position: { value: 90, unit: "deg" } },
                    ],
                    10
                )
            ).to.deep.equal(
                conicGradient(
                    [
                        { color: rgbColor(1, 0, 0), position: { value: 0, unit: "deg" } },
                        { color: rgbColor(0, 0, 1), position: { value: 90, unit: "deg" } },
                    ],
                    10
                )
            );
        });

        it("should have the same rules as the functions", () => {
            expect(() => new LinearGradient([stops[0]])).to.throw("A Gradient must have at least two stops");
        });

        it("should be usable as the type of a gradient", () => {
            const gradient: LinearGradient = new LinearGradient(stops, 45);

            expect(gradient.type).to.equal("linear");
            expect(gradient.angle).to.equal(45);
        });
    });
});
