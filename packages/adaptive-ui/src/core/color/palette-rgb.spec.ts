import chai from "chai";
import { formatColor, parseColor } from "./color.js";
import { createPaletteRGB, PaletteRGBOptions } from "./palette-rgb.js";
import { Palette } from "./palette.js";
import { contrast, relativeLuminance } from "./utilities/relative-luminance.js";

const { expect } = chai;

const greyHex = "#808080";
const greyColor = parseColor(greyHex)!;

describe("createPaletteRGB", () => {
    it("should create a palette from the provided Color", () => {
        const palette = createPaletteRGB(greyColor);

        expect(palette.source).to.equal(greyColor);
    });

    it("should create a palette from the provided hex color", () => {
        const palette = createPaletteRGB(greyHex);

        expect(formatColor(palette.source)).to.equal(greyHex);
    });

    it("should create a palette with increased contrast", () => {
        const options: Partial<PaletteRGBOptions> = {
            stepContrast: 1.07,
            stepContrastRamp: 0,
        };
        const palette = createPaletteRGB(greyColor, options);

        expect(contrast(palette.swatches[0], palette.swatches[1]), "at least 1.07:1 between 0 and 1").to.be.gte(1.07);
        expect(contrast(palette.swatches[20], palette.swatches[21]), "at least 1.07:1 between 20 and 21").to.be.gte(
            1.07
        );
    });

    it("should throw when the string cannot be parsed", () => {
        expect(() => createPaletteRGB("not a color")).to.throw("Unable to parse Color as hex string: not a color");
    });

    it("should start with white and end with black for a grey source", () => {
        const palette = createPaletteRGB(greyColor);

        expect(formatColor(palette.swatches[0])).to.equal("#ffffff");
        expect(formatColor(palette.swatches[(palette.swatches.length - 1)])).to.equal("#000000");
    });

    it("should progress from light to dark", () => {
        const palette = createPaletteRGB("#0078D4");

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(
                relativeLuminance(palette.swatches[i]),
                `swatch ${i} should be darker than ${i - 1}`
            ).to.be.lessThan(relativeLuminance(palette.swatches[i - 1]));
        }
    });

    [1.2, 1.5, 2, 3].forEach(stepContrast => {
        ["#808080", "#0078D4", "#F2C812", "#D83B01", "#80DEEA"].forEach(hex => {
            it(`should create a palette for ${hex} with a large step contrast of ${stepContrast}`, () => {
                const palette = createPaletteRGB(hex, { stepContrast });

                expect(palette.swatches.length).to.be.gte(3);
                expect(formatColor(palette.swatches[0])).to.equal("#ffffff");
                expect(formatColor(palette.swatches[(palette.swatches.length - 1)])).to.equal("#000000");
                for (let i = 1; i < palette.swatches.length; i++) {
                    expect(relativeLuminance(palette.swatches[i]), `swatch ${i}`).to.be.lessThan(
                        relativeLuminance(palette.swatches[i - 1])
                    );
                }
            });
        });
    });

    it("should have contrast between swatches close to a large step contrast", () => {
        const palette = createPaletteRGB("#808080", { stepContrast: 1.5 });

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(contrast(palette.swatches[i - 1], palette.swatches[i]), `between ${i - 1} and ${i}`).to.be.gte(1.45);
        }
    });

    it("should maintain at least the step contrast between every swatch", () => {
        const palette = createPaletteRGB("#0078D4");

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(contrast(palette.swatches[i - 1], palette.swatches[i]), `between ${i - 1} and ${i}`).to.be.gte(1.05);
        }
    });

    it("should create fewer swatches with a larger step contrast", () => {
        const fine = createPaletteRGB(greyColor, { stepContrast: 1.05 });
        const coarse = createPaletteRGB(greyColor, { stepContrast: 1.2 });

        expect(coarse.swatches.length).to.be.lessThan(fine.swatches.length);
    });

    it("should increase contrast for darker swatches with a step contrast ramp", () => {
        const flat = createPaletteRGB(greyColor, { stepContrast: 1.05, stepContrastRamp: 0 });
        const ramped = createPaletteRGB(greyColor, { stepContrast: 1.05, stepContrastRamp: 0.5 });
        const last = (p: Palette) => contrast(p.swatches[(p.swatches.length - 1) - 1], p.swatches[(p.swatches.length - 1) - 2]);

        expect(ramped.swatches.length).to.be.lessThan(flat.swatches.length);
        expect(last(ramped)).to.be.greaterThan(last(flat));
    });

    it("should use the default options when options are not provided", () => {
        const withoutOptions = createPaletteRGB(greyColor);
        const withEmptyOptions = createPaletteRGB(greyColor, {});

        expect(withEmptyOptions.swatches.map(s => formatColor(s))).to.deep.equal(
            withoutOptions.swatches.map(s => formatColor(s))
        );
    });

    it("should not have duplicate swatches for neutral sources, where the lab end is exactly black", () => {
        for (let value = 0; value < 256; value += 17) {
            const hex = "#" + value.toString(16).padStart(2, "0").repeat(3);
            const colors = createPaletteRGB(hex).swatches.map(s => formatColor(s));

            expect(new Set(colors).size, hex).to.equal(colors.length);
            expect(colors[0], hex).to.equal("#ffffff");
            expect(colors[colors.length - 1], hex).to.equal("#000000");
        }
    });

    it("should reach exact white and black at the ends for any source", () => {
        // The ends of the palette must be exact white and black for any source, including chromatic ones.
        ["#0078D4", "#F2C812", "#808080", "#ffffff", "#000000"].forEach(hex => {
            const palette = createPaletteRGB(hex);

            expect(relativeLuminance(palette.swatches[0]), hex).to.equal(1);
            expect(relativeLuminance(palette.swatches[(palette.swatches.length - 1)]), hex).to.equal(0);
        });
    });

    it("should freeze the swatches", () => {
        expect(Object.isFrozen(createPaletteRGB(greyColor).swatches)).to.be.true;
        expect(Object.isFrozen(createPaletteRGB(greyColor))).to.be.true;
    });

    it("should contain the hue of the source", () => {
        const palette = createPaletteRGB("#0078D4");
        const [r, , b] = palette.swatches[Math.floor(palette.swatches.length / 2)].components as number[];

        expect(b).to.be.greaterThan(r);
    });

    it("should create a palette for white and black sources", () => {
        ["#ffffff", "#000000"].forEach(hex => {
            const palette = createPaletteRGB(hex);

            expect(palette.swatches.length, hex).to.be.greaterThan(10);
            expect(formatColor(palette.swatches[0]), hex).to.equal("#ffffff");
            expect(formatColor(palette.swatches[(palette.swatches.length - 1)]), hex).to.equal("#000000");
        });
    });

    describe("preserveSource", () => {
        ["#808080", "#0078D4", "#D83B01", "#5C2D91", "#404040", "#c0c0c0"].forEach(hex => {
            it(`should include the source color ${hex} in the palette`, () => {
                const source = parseColor(hex)!;
                const palette = createPaletteRGB(source, { preserveSource: true });

                expect(palette.swatches).to.include(source);
            });

            it(`should span white to black for ${hex}`, () => {
                const palette = createPaletteRGB(hex, { preserveSource: true });

                expect(formatColor(palette.swatches[0])).to.equal("#ffffff");
                expect(formatColor(palette.swatches[(palette.swatches.length - 1)])).to.equal("#000000");
            });

            it(`should progress from light to dark for ${hex}`, () => {
                const palette = createPaletteRGB(hex, { preserveSource: true });

                for (let i = 1; i < palette.swatches.length; i++) {
                    expect(relativeLuminance(palette.swatches[i]), `swatch ${i}`).to.be.lessThan(
                        relativeLuminance(palette.swatches[i - 1])
                    );
                }
            });
        });

        [1.2, 1.5, 2].forEach(stepContrast => {
            ["#808080", "#0078D4", "#F2C812", "#5C2D91", "#80DEEA"].forEach(hex => {
                it(`should include the source ${hex} with a step contrast of ${stepContrast}`, () => {
                    const source = parseColor(hex)!;
                    const palette = createPaletteRGB(source, { preserveSource: true, stepContrast });

                    expect(palette.swatches).to.include(source);
                    expect(formatColor(palette.swatches[0])).to.equal("#ffffff");
                    for (let i = 1; i < palette.swatches.length; i++) {
                        expect(relativeLuminance(palette.swatches[i]), `swatch ${i}`).to.be.lessThan(
                            relativeLuminance(palette.swatches[i - 1])
                        );
                    }
                });
            });
        });

        it("should not duplicate a black or white source", () => {
            ["#000000", "#ffffff"].forEach(hex => {
                const palette = createPaletteRGB(hex, { preserveSource: true });
                const colors = palette.swatches.map(s => formatColor(s));

                expect(new Set(colors).size, hex).to.equal(colors.length);
                expect(colors[0], hex).to.equal("#ffffff");
                expect(colors[colors.length - 1], hex).to.equal("#000000");
            });
        });

        it("should keep nearly the step contrast between swatches", () => {
            const palette = createPaletteRGB("#0078D4", { preserveSource: true });

            for (let i = 1; i < palette.swatches.length; i++) {
                expect(contrast(palette.swatches[i - 1], palette.swatches[i]), `between ${i - 1} and ${i}`).to.be.gte(1.04);
            }
        });
    });

    // TODO: Fix with https://github.com/microsoft/fast/issues/5852
    // it("should create a palette with preserved source", () => {
    //     const options: Partial<PaletteRGBOptions> = {
    //             preserveSource: true,
    //     };
    //     const palette = createPaletteRGB(greySwatch, options);

    //     expect(contrast(palette.swatches[0], palette.swatches[1]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    //     expect(contrast(palette.swatches[20], palette.swatches[21]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    // });
});
