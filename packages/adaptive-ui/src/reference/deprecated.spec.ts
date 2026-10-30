import chai from "chai";
import {
    cornerRadiusControl,
    cornerRadiusLayer,
    densityAdjustmentUnits,
    densityControl,
    densityLayer,
    designUnit,
    focusStrokeThickness,
    strokeThickness,
    elevationCardActiveSize,
    elevationCardInteractive,
    elevationDialog,
    elevationDialogSize,
    elevationFlyout,
    elevationTooltip,
    elevationTooltipSize,
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
    accentFillStealth,
    criticalStrokeStrong,
    fillSubtleDisabledDelta,
    focusStroke,
    focusStrokeInner,
    infoFillSubtleInverse,
    minContrastReadable,
    neutralAsOverlay,
    strokeStealthHoverDelta,
    strokeStrongMinContrast,
    wcagContrastLevel,
    accentFillReadableControlStyles,
    actionStyles,
    StyleNameMapping,
    gradientAngle,
    gradientStartShift,
    gradientEndShift,
    accentHueShiftGradientFillSubtleRest,
    accentToHighlightGradientFillSubtleRest,
    accentHueShiftGradientFillSubtleElementStyles,
    accentToHighlightGradientFillSubtleElementStyles,
} from "./deprecated.js";
import { treatmentAt } from "../core/styles/treatment-token.js";
import { createReferenceLibrary } from "./library.js";
import { formatColor } from "../core/color/color.js";
import { createColorLibrary } from "./color.js";
import { createElevationLibrary } from "./elevation.js";
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

describe("deprecated color set tokens", () => {
    const { color } = createColorLibrary().tokens;

    it("should be the tokens of the color group with the names they had", () => {
        expect(accentFillStealth.name).to.equal("color.accent.fill.stealth");
        expect(criticalStrokeStrong.name).to.equal("color.critical.stroke.strong");
        expect(infoFillSubtleInverse.name).to.equal("color.info.fill.subtleInverse");
        expect(fillSubtleDisabledDelta.name).to.equal("color.deltas.fill.subtle.disabled");
        expect(strokeStealthHoverDelta.name).to.equal("color.deltas.stroke.stealth.hover");
        expect(wcagContrastLevel.name).to.equal("color.wcagContrast.level");
        expect(minContrastReadable.name).to.equal("color.wcagContrast.minContrast.readable");
        expect(strokeStrongMinContrast.name).to.equal("color.wcagContrast.minContrast.strong");
        expect(neutralAsOverlay.name).to.equal("color.neutral.asOverlay");
        expect(focusStroke.name).to.equal("color.focusStroke.$root");
        expect(focusStrokeInner.name).to.equal("color.focusStroke.inner");
    });

    it("should have the values of the tokens of a library", () => {
        expect(formatColor(accentFillStealth.$value.hover!)).to.equal(formatColor(color.accent.fill.stealth.$value.hover!));
        expect(fillSubtleDisabledDelta.$value).to.equal(color.deltas.fill.subtle.disabled.$value);
        expect(minContrastReadable.$value).to.equal(4.5);
        expect(neutralAsOverlay.$value).to.equal(false);
    });
});

describe("deprecated elevation tokens", () => {
    const { elevation } = createElevationLibrary().tokens;

    it("should be the tokens of the elevation group with the names they had", () => {
        expect(elevationCardInteractive.name).to.equal("elevation.card.$root");
        expect(elevationCardActiveSize.name).to.equal("elevation.card.deltas.active");
        expect(elevationTooltip.name).to.equal("elevation.tooltip.$root");
        expect(elevationTooltipSize.name).to.equal("elevation.tooltip.size");
        expect(elevationFlyout.name).to.equal("elevation.flyout.$root");
        expect(elevationDialogSize.name).to.equal("elevation.dialog.size");
    });

    it("should have the values of the tokens of a library", () => {
        expect(elevationDialog.$value).to.deep.equal(elevation.dialog.$root.$value);
        expect(elevationCardInteractive.$value.hover).to.deep.equal(elevation.card.$root.$value.hover);
        expect(elevationTooltipSize.$value).to.equal(8);
    });
});

describe("deprecated appearance and density tokens", () => {
    it("should be the tokens with the names they had", () => {
        expect(designUnit.name).to.equal("global.designUnit");
        expect(cornerRadiusControl.name).to.equal("shape.cornerRadius.default");
        expect(cornerRadiusLayer.name).to.equal("shape.cornerRadius.layer");
        expect(strokeThickness.name).to.equal("shape.strokeThickness.default");
        expect(focusStrokeThickness.name).to.equal("shape.strokeThickness.focus");
        expect(densityAdjustmentUnits.name).to.equal("density.adjustmentUnits");
    });

    it("should have the properties that a density group had, as the tokens of the set", () => {
        expect(densityControl.horizontalPadding.name).to.equal("density.control.horizontal.padding");
        expect(densityControl.verticalGapUnits.name).to.equal("density.control.vertical.gapUnits");
        expect(densityControl.designUnit.name).to.equal("density.control.designUnit");
        expect(densityLayer.horizontalGap.name).to.equal("density.layer.horizontal.gap");
        expect(densityControl.horizontalPaddingUnits.$value).to.equal(3);
    });
});

describe("deprecated style modules", () => {
    it("should be the treatments of the library, by their new names", () => {
        const library = createReferenceLibrary();

        expect(actionStyles).to.deep.equal(treatmentAt(library, "treatments.actionControl"));
        expect(accentFillReadableControlStyles.name).to.equal("color.accent.treatments.fillReadableControl");
    });

    it("should map the names of 0.14 to the names of their exports, which are here", () => {
        expect(StyleNameMapping["styles.action-control"]).to.equal("actionStyles");
        expect(StyleNameMapping["color.accent-fill-readable-control"]).to.equal("accentFillReadableControlStyles");
        expect(Object.keys(StyleNameMapping)).to.have.length(96);
    });
});

describe("deprecated experimental tokens", () => {
    it("should be the tokens of the gradients with the names they had, without the state", () => {
        expect(gradientAngle.name).to.equal("color.gradient.angle");
        expect(gradientStartShift.name).to.equal("color.gradient.startShift");
        expect(gradientEndShift.name).to.equal("color.gradient.endShift");
        expect(accentHueShiftGradientFillSubtleRest.name).to.equal("color.accentHueShiftGradient.fill.subtle");
        expect(accentToHighlightGradientFillSubtleRest.name).to.equal("color.accentToHighlightGradient.fill.subtle");
        expect(gradientAngle.$value).to.equal(180);
    });

    it("should be the treatments of the gradients", () => {
        expect(accentHueShiftGradientFillSubtleElementStyles.name).to.equal("color.accent.treatments.hueShiftGradientFillSubtleElement");
        expect(accentToHighlightGradientFillSubtleElementStyles.name).to.equal("color.accent.treatments.toHighlightGradientFillSubtleElement");
    });
});
