import chai from "chai";
import { PaletteDirectionValue, resolvePaletteDirection } from "./palette.js";

const { expect } = chai;

describe("PaletteDirectionValue", () => {
    it("should be 1 for darker and -1 for lighter", () => {
        expect(PaletteDirectionValue.darker).to.equal(1);
        expect(PaletteDirectionValue.lighter).to.equal(-1);
    });

    it("should be immutable", () => {
        expect(Object.isFrozen(PaletteDirectionValue)).to.be.true;
    });
});

describe("resolvePaletteDirection", () => {
    it("should return a direction value as-is", () => {
        expect(resolvePaletteDirection(PaletteDirectionValue.darker)).to.equal(1);
        expect(resolvePaletteDirection(PaletteDirectionValue.lighter)).to.equal(-1);
    });

    it("should evaluate a function each time it is resolved", () => {
        let direction: PaletteDirectionValue = PaletteDirectionValue.darker;
        const fn = () => direction;

        expect(resolvePaletteDirection(fn)).to.equal(1);

        direction = PaletteDirectionValue.lighter;
        expect(resolvePaletteDirection(fn)).to.equal(-1);
    });
});
