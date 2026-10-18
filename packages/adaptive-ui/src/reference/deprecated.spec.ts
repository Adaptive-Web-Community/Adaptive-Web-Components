import chai from "chai";
import {
    bodyFontFamily,
    bodyFontStyle,
    bodyFontWeight,
    fontFamily,
    fontStyle,
    fontWeight,
    labelFontFamily,
    labelFontStyle,
    labelFontWeight,
    StandardFontWeight,
    typeRampDefault,
    accentBaseColor,
    colorContext,
    criticalPalette,
    disabledPalette,
    layerFillActiveDelta,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus4,
    layerFillFixedPlus1,
    layerFillInteractive,
    layerFillRestDelta,
    layerPalette,
    neutralBaseColor,
    neutralPalette,
} from "./deprecated.js";
import { formatColor } from "../core/color/color.js";
import { createLayerLibrary } from "./layer.js";
import { createTypographyLibrary } from "./typography.js";

const { expect } = chai;

describe("deprecated typography tokens", () => {
    const { typography } = createTypographyLibrary().tokens;

    it("should be the tokens of the typography group with the names they had", () => {
        expect(fontFamily.name).to.equal("typography.fontFamily.default");
        expect(bodyFontFamily.name).to.equal("typography.fontFamily.body");
        expect(labelFontFamily.name).to.equal("typography.fontFamily.label");
        expect(fontWeight.name).to.equal("typography.fontWeight.default");
        expect(bodyFontWeight.name).to.equal("typography.fontWeight.body");
        expect(labelFontWeight.name).to.equal("typography.fontWeight.label");
        expect(fontStyle.name).to.equal("typography.fontStyle.default");
        expect(bodyFontStyle.name).to.equal("typography.fontStyle.body");
        expect(labelFontStyle.name).to.equal("typography.fontStyle.label");
        expect(typeRampDefault.fontSize.base.name).to.equal("typography.ramp.default.fontSize.base");
    });

    it("should have the values of the tokens of a library", () => {
        expect(fontFamily.$value).to.deep.equal(typography.fontFamily.default.$value);
        expect(bodyFontWeight.$value).to.equal(typography.fontWeight.body.$value);
        expect(labelFontStyle.$value).to.equal(typography.fontStyle.label.$value);
        expect(typeRampDefault.lineHeight.plus1.$value).to.deep.equal(typography.ramp.default.lineHeight.plus1.$value);
    });

    it("should keep the standard font weights", () => {
        expect(StandardFontWeight.Normal).to.equal(400);
        expect(StandardFontWeight.Black).to.equal(900);
    });
});

describe("deprecated palette, color context, and layer tokens", () => {
    const { color } = createLayerLibrary().tokens;

    it("should be the tokens of the color group with the names they had", () => {
        expect(neutralBaseColor.name).to.equal("color.neutral.base");
        expect(neutralPalette.name).to.equal("color.neutral.palette");
        expect(accentBaseColor.name).to.equal("color.accent.base");
        expect(criticalPalette.name).to.equal("color.critical.palette");
        expect(disabledPalette.name).to.equal("color.disabled.palette");
        expect(colorContext.name).to.equal("color.context");
        expect(layerPalette.name).to.equal("color.layer.palette");
        expect(layerFillBaseLuminance.name).to.equal("color.layer.fill.ramp.baseLuminance");
        expect(layerFillRestDelta.name).to.equal("color.layer.fill.restDelta");
        expect(layerFillActiveDelta.name).to.equal("color.layer.fill.interactiveDeltas.active");
        expect(layerFillInteractive.name).to.equal("color.layer.fill.interactive");
        expect(layerFillFixedBase.name).to.equal("color.layer.fill.ramp.base");
        expect(layerFillFixedMinus4.name).to.equal("color.layer.fill.ramp.minus4");
        expect(layerFillFixedPlus1.name).to.equal("color.layer.fill.ramp.plus1");
    });

    it("should have the values of the tokens of a library", () => {
        expect(formatColor(neutralBaseColor.$value)).to.equal(formatColor(color.neutral.base.$value));
        expect(neutralPalette.$value.swatches.length).to.equal(66);
        expect(formatColor(colorContext.$value)).to.equal("#ffffff");
        expect(formatColor(layerFillFixedPlus1.$value)).to.equal(formatColor(color.layer.fill.ramp.plus1.$value));
        expect(layerFillInteractive.$value.rest).to.deep.equal(color.layer.fill.interactive.$value.rest);
    });
});
