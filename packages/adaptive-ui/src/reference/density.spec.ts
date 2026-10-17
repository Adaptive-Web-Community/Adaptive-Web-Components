import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Library, px, toCSS } from "design-token-library";
import { createDensity, DensitySetTokens } from "../core/density/index.js";
import { evaluate } from "../core/expression.js";
import { StyleProperty } from "../core/modules/types.js";
import { adaptiveConverters, tokenResolver } from "../core/token-css.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { appearance } from "./appearance.js";
import { createDensityLibrary, density, DensityLibraryTokens } from "./density.js";

const { expect } = chai;

const snapshot = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/reference/parity.snapshot.json"), "utf8")
);

// The snapshot has the calculations as the `calc()` strings they were, like `calc((1 * 4px) - 1px)`, which are numbers of px.
const pixels = (calc: string): number => new Function(`return ${calc.replace(/calc/g, "").replace(/px/g, "")}`)();

const value = (library: ReturnType<typeof createDensityLibrary>, token: { $value: any }) =>
    evaluate(token.$value, tokenResolver(library));

describe("density", () => {
    describe("compared to the parity snapshot", () => {
        Object.entries<any>(snapshot.density).forEach(([key, expected]) => {
            it(`should have the padding and gap of ${key}`, () => {
                const [unit, stroke, adjustment] = key.split("/").map(part => part.split("=")[1]);
                const library = createDensityLibrary().extend({
                    global: { designUnit: { $value: px(parseFloat(unit)) } },
                    shape: { strokeThickness: { default: { $value: px(parseFloat(stroke)) } } },
                    density: { adjustmentUnits: { $value: parseFloat(adjustment) } },
                });
                const { density } = library.tokens;
                let checked = 0;

                (["text", "control", "controlList", "layer"] as const).forEach(name => {
                    const set = density[name];
                    (["horizontal", "vertical"] as const).forEach(axis => {
                        (["padding", "gap"] as const).forEach(property => {
                            const expectedValue = pixels(expected[`density.${name}.${axis}.${property}`]);
                            expect(value(library, set[axis][property]), `${name} ${axis} ${property}`).to.deep.equal(px(expectedValue));
                            checked++;
                        });
                    });
                    expect(set.designUnit.$value).to.deep.equal(px(parseFloat(unit)));
                });
                expect(checked).to.equal(16);
            });
        });
    });

    describe("the sets", () => {
        const { density } = createDensityLibrary().tokens;

        it("should have the units they had", () => {
            expect([density.text.horizontal.paddingUnits, density.text.horizontal.gapUnits, density.text.vertical.paddingUnits, density.text.vertical.gapUnits].map(t => t.$value)).to.deep.equal([0, 1, 0, 1]);
            expect([density.control.horizontal.paddingUnits, density.control.horizontal.gapUnits, density.control.vertical.paddingUnits, density.control.vertical.gapUnits].map(t => t.$value)).to.deep.equal([3, 2, 2, 1]);
            expect([density.controlList.horizontal.paddingUnits, density.controlList.horizontal.gapUnits, density.controlList.vertical.paddingUnits, density.controlList.vertical.gapUnits].map(t => t.$value)).to.deep.equal([1, 0, 1, 0]);
            expect([density.layer.horizontal.paddingUnits, density.layer.horizontal.gapUnits, density.layer.vertical.paddingUnits, density.layer.vertical.gapUnits].map(t => t.$value)).to.deep.equal([4, 4, 4, 4]);
        });

        it("should be adjusted for the border of the controls and not of text and layers", () => {
            expect(density.control.borderThickness.$value).to.deep.equal(px(1));
            expect(density.controlList.borderThickness.$value).to.deep.equal(px(1));
            expect(density.text.borderThickness.$value).to.deep.equal(px(0));
            expect(density.layer.borderThickness.$value).to.deep.equal(px(0));
        });

        it("should have the names the tokens had", () => {
            expect(density.adjustmentUnits.name).to.equal("density.adjustmentUnits");
            expect(density.control.horizontal.padding.name).to.equal("density.control.horizontal.padding");
            expect(density.controlList.vertical.gapUnits.name).to.equal("density.controlList.vertical.gapUnits");
        });

        it("should be intended for the properties they were", () => {
            expect(getIntendedFor(density.control.horizontal.padding)).to.deep.equal([StyleProperty.paddingRight, StyleProperty.paddingLeft]);
            expect(getIntendedFor(density.control.vertical.padding)).to.deep.equal([StyleProperty.paddingTop, StyleProperty.paddingBottom]);
            expect(getIntendedFor(density.control.horizontal.gap)).to.deep.equal([StyleProperty.gap]);
            expect(getIntendedFor(density.control.borderThickness)).to.include(StyleProperty.borderThicknessTop);
        });
    });

    describe("changes", () => {
        it("should follow the design unit, the stroke, the adjustment and the units, for every set", () => {
            const library = createDensityLibrary();
            const { density, global, shape } = library.tokens;
            const padding = () => (value(library, density.control.horizontal.padding) as { value: number }).value;

            expect(padding()).to.equal(11);
            global.designUnit.set(px(8));
            expect(padding()).to.equal(23);
            shape.strokeThickness.default.set(px(2));
            expect(padding()).to.equal(22);
            density.adjustmentUnits.set(1);
            expect(padding()).to.equal(30);
            density.control.horizontal.paddingUnits.set(1);
            expect(padding()).to.equal(14);
            expect((value(library, density.layer.vertical.gap) as { value: number }).value).to.equal(40);
        });

        it("should have a design unit of its own for a set, when it is set", () => {
            const library = createDensityLibrary();
            const { density } = library.tokens;

            density.text.designUnit.set(px(2));

            expect(value(library, density.text.horizontal.gap)).to.deep.equal(px(2));
            expect(value(library, density.control.horizontal.gap)).to.deep.equal(px(8));
        });
    });

    describe("a set of a system", () => {
        // A system adds its own set, made the way the default ones are, and spread into the density tokens.
        type Tokens = DensityLibraryTokens & { density: { compact: DensitySetTokens } };
        const unit = (tokens: Library.Context<Tokens>) => tokens.global.designUnit;
        const create = () =>
            Library.create<Tokens>({
                ...appearance,
                density: {
                    ...density,
                    ...createDensity("compact", { horizontalPadding: 1, horizontalGap: 1, verticalPadding: 1, verticalGap: 1 }, unit, px(0)),
                },
            });

        it("has the tokens of a set, calculated from the same adjustment and design unit", () => {
            const library = create();
            const { compact } = library.tokens.density;

            expect(compact.horizontal.padding.name).to.equal("density.compact.horizontal.padding");
            expect(evaluate(compact.horizontal.padding.$value, tokenResolver(library))).to.deep.equal(px(4));
            library.tokens.density.adjustmentUnits.set(1);
            library.tokens.global.designUnit.set(px(8));
            expect(evaluate(compact.horizontal.gap.$value, tokenResolver(library))).to.deep.equal(px(16));
        });
    });

    describe("CSS", () => {
        it("should write the padding and gap as calculations of the custom properties", () => {
            const library = createDensityLibrary();
            const css = toCSS(library, { converters: adaptiveConverters(library) });

            expect(css).to.include(
                "--density-control-horizontal-padding:calc(((var(--density-control-horizontal-paddingUnits) + var(--density-adjustmentUnits)) * var(--density-control-designUnit)) - var(--density-control-borderThickness));"
            );
            expect(css).to.include(
                "--density-control-vertical-gap:calc((var(--density-control-vertical-gapUnits) + var(--density-adjustmentUnits)) * var(--density-control-designUnit));"
            );
            expect(css).to.include("--density-control-designUnit:4px;");
        });
    });
});
