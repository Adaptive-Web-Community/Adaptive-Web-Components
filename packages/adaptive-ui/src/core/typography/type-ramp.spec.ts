import chai from "chai";
import { StyleProperty } from "../modules/types.js";
import { TypeRampPosition, TypeRampTokenGroup, TypeScaleTokenGroup } from "./type-ramp.js";

const { expect } = chai;

const positions = ["minus2", "minus1", "base", "plus1", "plus2", "plus3", "plus4", "plus5", "plus6"] as const;

describe("TypeRampPosition", () => {
    it("should create tokens named from the base name and position", () => {
        const position = new TypeRampPosition("ramp-test.a", "base", {
            fontSize: "14px",
            lineHeight: "20px",
            lineHeightMultiline: "24px",
        });

        expect(position.fontSize.name).to.equal("ramp-test.a.fontSize.base");
        expect(position.lineHeight.name).to.equal("ramp-test.a.lineHeight.base");
        expect(position.lineHeightMultiline.name).to.equal("ramp-test.a.lineHeightMultiline.base");
        expect(position.fontVariations.name).to.equal("ramp-test.a.fontVariations.base");
    });

    it("should set the default values from the config", () => {
        const position = new TypeRampPosition("ramp-test.b", "plus1", {
            fontSize: "18px",
            lineHeight: "24px",
            lineHeightMultiline: "28px",
        });

        expect(position.fontSize.default).to.equal("18px");
        expect(position.lineHeight.default).to.equal("24px");
        expect(position.lineHeightMultiline.default).to.equal("28px");
    });

    it("should set the types and intended style properties", () => {
        const position = new TypeRampPosition("ramp-test.c", "base", {
            fontSize: "14px",
            lineHeight: "20px",
            lineHeightMultiline: "24px",
        });

        expect(position.fontSize.type).to.equal("dimension");
        expect(position.fontSize.intendedFor).to.deep.equal([StyleProperty.fontSize]);
        expect(position.lineHeight.type).to.equal("dimension");
        expect(position.lineHeight.intendedFor).to.deep.equal([StyleProperty.lineHeight]);
        expect(position.lineHeightMultiline.intendedFor).to.deep.equal([StyleProperty.lineHeight]);
        expect(position.fontVariations.type).to.equal("fontVariations");
        expect(position.fontVariations.intendedFor).to.deep.equal([StyleProperty.fontVariationSettings]);
    });

    it("should default font variations to empty", () => {
        const position = new TypeRampPosition("ramp-test.d", "base", {
            fontSize: "14px",
            lineHeight: "20px",
            lineHeightMultiline: "24px",
        });

        expect(position.fontVariations.default).to.equal("");
    });
});

describe("TypeRampTokenGroup", () => {
    const config = (n: number) => ({ fontSize: `${n}px`, lineHeight: `${n + 6}px`, lineHeightMultiline: `${n + 10}px` });
    const group = new TypeRampTokenGroup(
        "ramp-test.group",
        config(8), config(10), config(14), config(16), config(18), config(20), config(24), config(28), config(32)
    );

    it("should have the name", () => {
        expect(group.name).to.equal("ramp-test.group");
    });

    it("should create every position in order", () => {
        const sizes = positions.map(p => group[p].fontSize.default);

        expect(sizes).to.deep.equal(["8px", "10px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"]);
    });

    it("should name the tokens from the group name and position", () => {
        positions.forEach(p => {
            expect(group[p].fontSize.name).to.equal(`ramp-test.group.fontSize.${p}`);
            expect(group[p].lineHeight.name).to.equal(`ramp-test.group.lineHeight.${p}`);
            expect(group[p].lineHeightMultiline.name).to.equal(`ramp-test.group.lineHeightMultiline.${p}`);
        });
    });

    it("should map the config of each position to that position", () => {
        expect(group.minus2.lineHeight.default).to.equal("14px");
        expect(group.base.lineHeight.default).to.equal("20px");
        expect(group.plus6.lineHeightMultiline.default).to.equal("42px");
    });
});

describe("TypeScaleTokenGroup", () => {
    const group = new TypeScaleTokenGroup("scale-test.a", "16px", 1.25);

    it("should have the name", () => {
        expect(group.name).to.equal("scale-test.a");
    });

    it("should create tokens for the scale configuration", () => {
        expect(group.multiplier.name).to.equal("scale-test.a.multiplier");
        expect(group.multiplier.default).to.equal(1.25);
        expect(group.lineHeightRatio.name).to.equal("scale-test.a.lineHeightRatio");
        expect(group.lineHeightMultilineRatio.name).to.equal("scale-test.a.lineHeightMultilineRatio");
        expect(group.lineHeightSnap.name).to.equal("scale-test.a.lineHeightSnap");
    });

    it("should default the line height configuration", () => {
        expect(group.lineHeightRatio.default).to.equal(1.3);
        expect(group.lineHeightMultilineRatio.default).to.equal(1.6);
        expect(group.lineHeightSnap.default).to.equal("2px");
    });

    it("should accept the line height configuration", () => {
        const custom = new TypeScaleTokenGroup("scale-test.b", "10px", 1.5, 1.1, 1.9, "4px");

        expect(custom.lineHeightRatio.default).to.equal(1.1);
        expect(custom.lineHeightMultilineRatio.default).to.equal(1.9);
        expect(custom.lineHeightSnap.default).to.equal("4px");
        expect(custom.base.lineHeight.default).to.equal("round(10px * 1.1, 4px)");
        expect(custom.base.lineHeightMultiline.default).to.equal("round(10px * 1.9, 4px)");
    });

    it("should use the base size for the base position", () => {
        expect(group.base.fontSize.default).to.equal("16px");
    });

    it("should scale smaller positions by division", () => {
        expect(group.minus1.fontSize.default).to.equal("calc(16px / 1.25)");
        expect(group.minus2.fontSize.default).to.equal("calc(16px / pow(1.25, 2))");
    });

    it("should scale larger positions by multiplication", () => {
        expect(group.plus1.fontSize.default).to.equal("calc(16px * 1.25)");
        expect(group.plus2.fontSize.default).to.equal("calc(16px * pow(1.25, 2))");
        expect(group.plus3.fontSize.default).to.equal("calc(16px * pow(1.25, 3))");
        expect(group.plus4.fontSize.default).to.equal("calc(16px * pow(1.25, 4))");
        expect(group.plus5.fontSize.default).to.equal("calc(16px * pow(1.25, 5))");
        expect(group.plus6.fontSize.default).to.equal("calc(16px * pow(1.25, 6))");
    });

    it("should calculate line heights from the font size of each position, rounded to the snap", () => {
        positions.forEach(p => {
            expect(group[p].lineHeight.default, `${p} lineHeight`).to.equal(
                `round(${group[p].fontSize.default} * 1.3, 2px)`
            );
            expect(group[p].lineHeightMultiline.default, `${p} lineHeightMultiline`).to.equal(
                `round(${group[p].fontSize.default} * 1.6, 2px)`
            );
        });
    });

    it("should update dependent values when the tokens change", () => {
        const scale = new TypeScaleTokenGroup("scale-test.c", "16px", 1.25);

        scale.multiplier.withDefault(2);
        scale.base.fontSize.withDefault("20px");
        scale.lineHeightRatio.withDefault(1.5);
        scale.lineHeightSnap.withDefault("1px");

        expect(scale.plus1.fontSize.default).to.equal("calc(20px * 2)");
        expect(scale.plus1.lineHeight.default).to.equal("round(calc(20px * 2) * 1.5, 1px)");
    });

    it("should not share tokens between groups", () => {
        const other = new TypeScaleTokenGroup("scale-test.d", "12px", 1.1);

        expect(other.plus1.fontSize.default).to.equal("calc(12px * 1.1)");
        expect(group.plus1.fontSize.default).to.equal("calc(16px * 1.25)");
    });
});
