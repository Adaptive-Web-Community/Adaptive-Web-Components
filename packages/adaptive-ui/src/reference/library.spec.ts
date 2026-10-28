import chai from "chai";
import { createReferenceLibrary } from "./library.js";

const { expect } = chai;

describe("the reference library", () => {
    it("should have the tokens of each system of the reference", () => {
        const { tokens } = createReferenceLibrary();

        expect(tokens.global.designUnit.name).to.equal("global.designUnit");
        expect(tokens.shape.cornerRadius.default.name).to.equal("shape.cornerRadius.default");
        expect(tokens.typography.fontFamily.default.name).to.equal("typography.fontFamily.default");
        expect(tokens.color.accent.fill.readable.name).to.equal("color.accent.fill.readable");
        expect(tokens.density.control.horizontal.padding.name).to.equal("density.control.horizontal.padding");
        expect(tokens.elevation.dialog.$root.name).to.equal("elevation.dialog.$root");
    });

    it("should make the density from its appearance, and the shadows from its colors", () => {
        const library = createReferenceLibrary();
        const { tokens } = library;
        tokens.global.designUnit.set({ value: 8, unit: "px" });

        expect(tokens.density.control.designUnit.$value).to.deep.equal({ value: 8, unit: "px" });
        expect(tokens.elevation.color.$value).to.deep.equal(tokens.color.neutral.stroke.strong.$value.rest);
    });
});
