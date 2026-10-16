import chai from "chai";
import type { DesignToken } from "design-token-library";
import {
    Color,
    colorLuminance,
    formatColor,
    fromCulori,
    isTransparent,
    parseColor,
    rgbColor,
    toCulori,
    transparent,
    withAlpha,
} from "./color.js";
import { white } from "./utilities/color-constants.js";
import { contrast } from "./utilities/relative-luminance.js";

const { expect } = chai;

const grey = rgbColor(0.5, 0.5, 0.5);
const greyHex = "#808080";

const opacityHex = "#33669980";
const opacityRgba = "rgba(51, 102, 153, 0.5)";

describe("Color", () => {
    it("should be a DTCG color, the type of the design token library", () => {
        const dtcg: DesignToken.Values.Color = rgbColor(0.2, 0.4, 0.6);
        const color: Color = dtcg;

        expect(color.colorSpace).to.equal("srgb");
    });

    describe("rgbColor", () => {
        it("should create an srgb color from the provided RGB values", () => {
            expect(rgbColor(0.5, 0.5, 0.5)).to.deep.equal({ colorSpace: "srgb", components: [0.5, 0.5, 0.5] });
            expect(formatColor(rgbColor(0.5, 0.5, 0.5))).to.equal(greyHex);
        });

        it("should include the alpha only when provided", () => {
            expect(rgbColor(0.5, 0.5, 0.5)).to.not.have.property("alpha");
            expect(rgbColor(0.5, 0.5, 0.5, 0.25).alpha).to.equal(0.25);
        });

        it("should freeze the color and its components", () => {
            const color = rgbColor(0.5, 0.5, 0.5);

            expect(Object.isFrozen(color)).to.be.true;
            expect(Object.isFrozen(color.components)).to.be.true;
        });
    });

    describe("parseColor", () => {
        it("should create a color from a hex color", () => {
            const color = parseColor(greyHex)!;

            expect(color.colorSpace).to.equal("srgb");
            expect(formatColor(color)).to.equal(greyHex);
        });

        it("should create a color with opacity", () => {
            const color = parseColor(opacityHex)!;

            expect(color).to.deep.equal({
                colorSpace: "srgb",
                components: [0.2, 0.4, 0.6],
                alpha: 0.5019607843137255,
            });
            expect(formatColor(color)).to.equal(opacityRgba);
        });

        it("should convert a color in another color space to srgb", () => {
            expect(formatColor(parseColor("hsl(210 50% 40%)")!)).to.equal("#336699");
            expect(parseColor("hsl(210 50% 40%)")!.colorSpace).to.equal("srgb");
        });

        it("should return undefined when parsing an invalid string", () => {
            expect(parseColor("not a color")).to.be.undefined;
        });
    });

    describe("formatColor", () => {
        it("should use hex for an opaque color", () => {
            expect(formatColor(grey)).to.equal(greyHex);
            expect(formatColor(rgbColor(0.5, 0.5, 0.5, 1))).to.equal(greyHex);
        });

        it("should use rgb() for a color with opacity", () => {
            expect(formatColor(parseColor(opacityHex)!)).to.equal(opacityRgba);
        });

        it("should format a color in another color space", () => {
            const hsl: Color = { colorSpace: "hsl", components: [210, 50, 40] };
            const oklch: Color = { colorSpace: "oklch", components: [0.5, 0.1, 250] };

            expect(formatColor(hsl)).to.equal("#336699");
            expect(formatColor(oklch)).to.equal(formatColor(fromCulori(toCulori(oklch))));
        });
    });

    describe("color spaces", () => {
        const blue = rgbColor(0.2, 0.4, 0.6);
        // The same color as #336699 in each color space, with the components as the DTCG Color module defines them.
        const spaces: Color[] = [
            { colorSpace: "srgb-linear", components: [0.033105, 0.132868, 0.318547] },
            { colorSpace: "hsl", components: [210, 50, 40] },
            { colorSpace: "hwb", components: [210, 20, 40] },
            { colorSpace: "lab", components: [41.520824, -4.573086, -33.494194] },
            { colorSpace: "lch", components: [41.520824, 33.804942, 262.225269] },
            { colorSpace: "oklab", components: [0.499314, -0.033043, -0.092967] },
            { colorSpace: "oklch", components: [0.499314, 0.098664, 250.433057] },
            { colorSpace: "display-p3", components: [0.249851, 0.39524, 0.584034] },
            { colorSpace: "a98-rgb", components: [0.281432, 0.399405, 0.587887] },
            { colorSpace: "prophoto-rgb", components: [0.287661, 0.319552, 0.504538] },
            { colorSpace: "rec2020", components: [0.250128, 0.336705, 0.537794] },
            { colorSpace: "xyz-d65", components: [0.118655, 0.125059, 0.319266] },
            { colorSpace: "xyz-d50", components: [0.111187, 0.121927, 0.240834] },
        ];

        spaces.forEach(color => {
            it(`should be the same color in ${color.colorSpace}`, () => {
                expect(formatColor(color)).to.equal(formatColor(blue));
            });
        });

        it("should treat a missing component as zero", () => {
            const color: Color = { colorSpace: "srgb", components: ["none", 0.5, 0.5] };

            expect(formatColor(color)).to.equal(formatColor(rgbColor(0, 0.5, 0.5)));
        });
    });

    describe("colorLuminance", () => {
        it("should provide the correct relative luminance", () => {
            expect(colorLuminance(grey)).to.approximately(0.21, 0.01);
        });

        it("should have a known relative luminance when fully opaque", () => {
            expect(colorLuminance(rgbColor(1, 1, 1, 1))).to.equal(1);
            expect(colorLuminance(rgbColor(0, 0, 0))).to.equal(0);
        });

        it("should have an unknown relative luminance when semitransparent", () => {
            expect(colorLuminance(parseColor(opacityHex)!)).to.be.NaN;
        });

        it("should not depend on the color space", () => {
            expect(colorLuminance({ colorSpace: "hsl", components: [210, 50, 40] })).to.approximately(
                colorLuminance(rgbColor(0.2, 0.4, 0.6)),
                0.001
            );
        });

        it("should provide its contrast with another color", () => {
            expect(contrast(grey, white)).to.approximately(3.9, 0.1);
        });
    });

    describe("transparent", () => {
        it("should be fully transparent", () => {
            expect(transparent.alpha).to.equal(0);
            expect(formatColor(transparent)).to.equal("transparent");
        });

        it("should be identified as transparent", () => {
            expect(isTransparent(transparent)).to.be.true;
            expect(isTransparent(grey)).to.be.false;
            expect(isTransparent(rgbColor(0, 0, 0, 0.1))).to.be.false;
            expect(isTransparent(rgbColor(0, 0, 0, 1))).to.be.false;
        });
    });

    describe("withAlpha", () => {
        it("should create a new color with the provided alpha", () => {
            const result = withAlpha(grey, 0.25);

            expect(result).to.deep.equal({ colorSpace: "srgb", components: [0.5, 0.5, 0.5], alpha: 0.25 });
            expect(formatColor(result)).to.equal("rgba(128, 128, 128, 0.25)");
        });

        it("should not modify the original color", () => {
            withAlpha(grey, 0.25);

            expect(grey).to.deep.equal({ colorSpace: "srgb", components: [0.5, 0.5, 0.5] });
        });

        it("should not be usable for contrast calculations", () => {
            expect(colorLuminance(withAlpha(grey, 0.25))).to.be.NaN;
        });

        it("should be transparent when the alpha is zero", () => {
            const result = withAlpha(grey, 0);

            expect(result.alpha).to.equal(0);
            expect(formatColor(result)).to.equal("transparent");
        });
    });
});
