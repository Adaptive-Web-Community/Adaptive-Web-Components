import chai from "chai";
import { DesignToken, px, toCSS } from "design-token-library";
import { evaluate } from "../core/expression.js";
import { adaptiveConverters, tokenResolver } from "../core/token-css.js";
import { StyleProperty } from "../core/modules/types.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { typeRampPositions } from "../core/typography/type-ramp.js";
import { createTypographyLibrary } from "./typography.js";

const { expect } = chai;

const library = createTypographyLibrary();
const css = toCSS(library, { converters: adaptiveConverters(library) });
const value = (token: { $value: any }) => evaluate(token.$value, tokenResolver(library));

describe("typography", () => {
    const { typography } = library.tokens;

    describe("fonts", () => {
        it("should have the same default values as before", () => {
            expect(typography.fontFamily.default.$value).to.deep.equal(["Arial", "Helvetica", "sans-serif"]);
            expect(typography.fontWeight.default.$value).to.equal("normal");
            expect(typography.fontStyle.default.$value).to.equal("normal");
        });

        it("should default the body and label to the default", () => {
            expect(typography.fontFamily.body.$value).to.deep.equal(typography.fontFamily.default.$value);
            expect(typography.fontFamily.label.$value).to.deep.equal(typography.fontFamily.default.$value);
            expect(typography.fontWeight.body.$value).to.equal("normal");
            expect(typography.fontStyle.label.$value).to.equal("normal");
        });

        it("should follow the default until they are set", () => {
            const { typography } = createTypographyLibrary().tokens;

            typography.fontFamily.default.set(["Georgia", "serif"]);
            typography.fontWeight.default.set("medium");
            expect(typography.fontFamily.body.$value).to.deep.equal(["Georgia", "serif"]);
            expect(typography.fontWeight.label.$value).to.equal("medium");

            typography.fontFamily.body.set(["Times New Roman"]);
            expect(typography.fontFamily.body.$value).to.deep.equal(["Times New Roman"]);
            expect(typography.fontFamily.label.$value).to.deep.equal(["Georgia", "serif"]);
        });

        it("should have the names the tokens had", () => {
            expect(typography.fontFamily.default.name).to.equal("typography.fontFamily.default");
            expect(typography.fontWeight.body.name).to.equal("typography.fontWeight.body");
            expect(typography.fontStyle.label.name).to.equal("typography.fontStyle.label");
        });

        it("should be intended for their style properties", () => {
            expect(getIntendedFor(typography.fontFamily.label)).to.deep.equal([StyleProperty.fontFamily]);
            expect(getIntendedFor(typography.fontWeight.body)).to.deep.equal([StyleProperty.fontWeight]);
            expect(getIntendedFor(typography.fontStyle.default)).to.deep.equal([StyleProperty.fontStyle]);
        });
    });

    describe("default type ramp", () => {
        const ramp = typography.ramp.default;
        const expected = [
            // fontSize, lineHeight, lineHeightMultiline
            [10, 12, 14], // minus2
            [12, 14, 16], // minus1
            [14, 16, 18], // base
            [16, 22, 24], // plus1
            [20, 26, 28], // plus2
            [24, 32, 34], // plus3
            [28, 36, 38], // plus4
            [32, 40, 42], // plus5
            [40, 52, 56], // plus6
        ];

        typeRampPositions.forEach((position, i) => {
            it(`should have the same values as before for ${position}`, () => {
                expect(ramp.fontSize[position].$value).to.deep.equal(px(expected[i][0]));
                expect(ramp.lineHeight[position].$value).to.deep.equal(px(expected[i][1]));
                expect(ramp.lineHeightMultiline[position].$value).to.deep.equal(px(expected[i][2]));
                expect(ramp.fontVariations[position].$value).to.equal("");
            });
        });

        it("should have the names the tokens had", () => {
            expect(ramp.fontSize.base.name).to.equal("typography.ramp.default.fontSize.base");
            expect(ramp.lineHeight.plus2.name).to.equal("typography.ramp.default.lineHeight.plus2");
            expect(ramp.lineHeightMultiline.minus1.name).to.equal("typography.ramp.default.lineHeightMultiline.minus1");
            expect(ramp.fontVariations.plus6.name).to.equal("typography.ramp.default.fontVariations.plus6");
        });
    });

    describe("body type ramp", () => {
        const ramp = typography.ramp.body;

        it("should be a scale of 16px with a multiplier of 1.21 and a line height ratio of 1.35", () => {
            expect(ramp.fontSize.base.$value).to.deep.equal(px(16));
            expect(ramp.multiplier.$value).to.equal(1.21);
            expect(ramp.lineHeightRatio.$value).to.equal(1.35);
            expect(ramp.lineHeightMultilineRatio.$value).to.equal(1.6);
            expect(ramp.lineHeightSnap.$value).to.deep.equal(px(2));
        });

        it("should calculate the font sizes", () => {
            expect((value(ramp.fontSize.minus2) as DesignToken.Values.Dimension).value).to.be.approximately(10.9282, 0.0001);
            expect((value(ramp.fontSize.minus1) as DesignToken.Values.Dimension).value).to.be.approximately(13.2231, 0.0001);
            expect(value(ramp.fontSize.plus1)).to.deep.equal(px(19.36));
            expect((value(ramp.fontSize.plus2) as DesignToken.Values.Dimension).value).to.be.approximately(23.4256, 0.0001);
            expect((value(ramp.fontSize.plus6) as DesignToken.Values.Dimension).value).to.be.approximately(50.2, 0.2);
        });

        it("should calculate the line heights, rounded to 2px", () => {
            // 16px * 1.35 = 21.6px and 16px * 1.6 = 25.6px
            expect(value(ramp.lineHeight.base)).to.deep.equal(px(22));
            expect(value(ramp.lineHeightMultiline.base)).to.deep.equal(px(26));
            // 19.36px * 1.35 = 26.136px and 19.36px * 1.6 = 30.976px
            expect(value(ramp.lineHeight.plus1)).to.deep.equal(px(26));
            expect(value(ramp.lineHeightMultiline.plus1)).to.deep.equal(px(30));
        });

        it("should have the names the tokens had", () => {
            expect(ramp.fontSize.base.name).to.equal("typography.ramp.body.fontSize.base");
            expect(ramp.multiplier.name).to.equal("typography.ramp.body.multiplier");
        });
    });

    describe("CSS", () => {
        it("should write the font family as a list", () => {
            expect(css).to.include("--typography-fontFamily-default:Arial,Helvetica,sans-serif;");
            expect(css).to.include("--typography-fontFamily-body:Arial,Helvetica,sans-serif;");
        });

        it("should write the font weight and style", () => {
            expect(css).to.include("--typography-fontWeight-default:400;");
            expect(css).to.include("--typography-fontStyle-default:normal;");
        });

        it("should write the sizes of the default ramp with the units", () => {
            expect(css).to.include("--typography-ramp-default-fontSize-base:14px;");
            expect(css).to.include("--typography-ramp-default-lineHeightMultiline-plus6:56px;");
        });

        it("should write the body ramp as calculations of the custom properties it is calculated from", () => {
            const base = "var(--typography-ramp-body-fontSize-base)";
            const multiplier = "var(--typography-ramp-body-multiplier)";

            expect(css).to.include("--typography-ramp-body-fontSize-base:16px;");
            expect(css).to.include(`--typography-ramp-body-fontSize-plus1:calc(${base} * ${multiplier});`);
            expect(css).to.include(`--typography-ramp-body-fontSize-plus2:calc(${base} * pow(${multiplier}, 2));`);
            expect(css).to.include(`--typography-ramp-body-fontSize-minus1:calc(${base} / ${multiplier});`);
            expect(css).to.include(`--typography-ramp-body-fontSize-minus2:calc(${base} / pow(${multiplier}, 2));`);
            expect(css).to.include(
                "--typography-ramp-body-lineHeight-base:round(var(--typography-ramp-body-fontSize-base) * var(--typography-ramp-body-lineHeightRatio), var(--typography-ramp-body-lineHeightSnap));"
            );
        });

        it("should write empty font variations", () => {
            expect(css).to.include("--typography-ramp-default-fontVariations-base:;");
        });
    });
});
