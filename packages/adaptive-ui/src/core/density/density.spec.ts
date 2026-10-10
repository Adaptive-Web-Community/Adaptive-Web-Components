import chai from "chai";
import { createTokenDimension } from "../token-helpers.js";
import { StyleProperty, StylePropertyShorthand } from "../modules/types.js";
import { DensityPaddingAndGapTokenGroup, densityAdjustmentUnits } from "./index.js";

const { expect } = chai;

describe("densityAdjustmentUnits", () => {
    it("should be a number token defaulting to zero", () => {
        expect(densityAdjustmentUnits.name).to.equal("density.adjustmentUnits");
        expect(densityAdjustmentUnits.type).to.equal("number");
        expect(densityAdjustmentUnits.default).to.equal(0);
    });
});

describe("DensityPaddingAndGapTokenGroup", () => {
    let count = 0;
    let name: string;
    let group: DensityPaddingAndGapTokenGroup;

    beforeEach(() => {
        densityAdjustmentUnits.withDefault(0);
        name = `density-test-${count++}`;
        group = new DensityPaddingAndGapTokenGroup(name, 3, 2, 1, 4, "4px", "1px");
    });

    afterEach(() => {
        densityAdjustmentUnits.withDefault(0);
    });

    it("should have the name", () => {
        expect(group.name).to.equal(name);
    });

    it("should name the tokens from the group name", () => {
        expect(group.designUnit.name).to.equal(`${name}.designUnit`);
        expect(group.borderThickness.name).to.equal(`${name}.borderThickness`);
        expect(group.horizontalPaddingUnits.name).to.equal(`${name}.horizontal.paddingUnits`);
        expect(group.horizontalPadding.name).to.equal(`${name}.horizontal.padding`);
        expect(group.horizontalGapUnits.name).to.equal(`${name}.horizontal.gapUnits`);
        expect(group.horizontalGap.name).to.equal(`${name}.horizontal.gap`);
        expect(group.verticalPaddingUnits.name).to.equal(`${name}.vertical.paddingUnits`);
        expect(group.verticalPadding.name).to.equal(`${name}.vertical.padding`);
        expect(group.verticalGapUnits.name).to.equal(`${name}.vertical.gapUnits`);
        expect(group.verticalGap.name).to.equal(`${name}.vertical.gap`);
    });

    it("should set the types", () => {
        [group.horizontalPaddingUnits, group.horizontalGapUnits, group.verticalPaddingUnits, group.verticalGapUnits].forEach(t =>
            expect(t.type, t.name).to.equal("number")
        );
        [group.designUnit, group.borderThickness, group.horizontalPadding, group.horizontalGap, group.verticalPadding, group.verticalGap].forEach(t =>
            expect(t.type, t.name).to.equal("dimension")
        );
    });

    it("should set the intended style properties", () => {
        expect(group.designUnit.intendedFor).to.be.undefined;
        expect(group.borderThickness.intendedFor).to.deep.equal(StylePropertyShorthand.borderThickness);
        expect(group.horizontalPadding.intendedFor).to.deep.equal([StyleProperty.paddingRight, StyleProperty.paddingLeft]);
        expect(group.verticalPadding.intendedFor).to.deep.equal([StyleProperty.paddingTop, StyleProperty.paddingBottom]);
        expect(group.horizontalGap.intendedFor).to.deep.equal([StyleProperty.gap]);
        expect(group.verticalGap.intendedFor).to.deep.equal([StyleProperty.gap]);
    });

    it("should set the default unit values", () => {
        expect(group.horizontalPaddingUnits.default).to.equal(3);
        expect(group.horizontalGapUnits.default).to.equal(2);
        expect(group.verticalPaddingUnits.default).to.equal(1);
        expect(group.verticalGapUnits.default).to.equal(4);
        expect(group.designUnit.default).to.equal("4px");
        expect(group.borderThickness.default).to.equal("1px");
    });

    it("should calculate padding from the units and design unit, minus the border", () => {
        expect(group.horizontalPadding.default).to.equal("calc((3 * 4px) - 1px)");
        expect(group.verticalPadding.default).to.equal("calc((1 * 4px) - 1px)");
    });

    it("should calculate gap from the units and design unit", () => {
        expect(group.horizontalGap.default).to.equal("calc((2 + 0) * 4px)");
        expect(group.verticalGap.default).to.equal("calc((4 + 0) * 4px)");
    });

    it("should include the density adjustment", () => {
        densityAdjustmentUnits.withDefault(-1);

        expect(group.horizontalPadding.default).to.equal("calc((2 * 4px) - 1px)");
        expect(group.verticalPadding.default).to.equal("calc((0 * 4px) - 1px)");
        expect(group.horizontalGap.default).to.equal("calc((2 + -1) * 4px)");
        expect(group.verticalGap.default).to.equal("calc((4 + -1) * 4px)");
    });

    it("should update when the unit tokens change", () => {
        group.horizontalPaddingUnits.withDefault(10);
        group.verticalGapUnits.withDefault(7);

        expect(group.horizontalPadding.default).to.equal("calc((10 * 4px) - 1px)");
        expect(group.verticalGap.default).to.equal("calc((7 + 0) * 4px)");
    });

    it("should use design unit and border thickness from other tokens", () => {
        const unit = createTokenDimension(`${name}-unit`).withDefault("8px");
        const border = createTokenDimension(`${name}-border`).withDefault("2px");
        const other = new DensityPaddingAndGapTokenGroup(`${name}-other`, 3, 2, 1, 4, unit, border);

        expect(other.designUnit.default).to.equal("8px");
        expect(other.borderThickness.default).to.equal("2px");
        expect(other.horizontalPadding.default).to.equal("calc((3 * 8px) - 2px)");
        expect(other.horizontalGap.default).to.equal("calc((2 + 0) * 8px)");
    });

    it("should provide padding as a css directive with both padding tokens", () => {
        const directive = group.padding;
        const css = directive.createCSS(() => undefined);

        expect(css).to.equal(`var(--${name}-vertical-padding) var(--${name}-horizontal-padding)`);
    });
});
