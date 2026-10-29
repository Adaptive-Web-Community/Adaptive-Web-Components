import chai from "chai";
import { isRef, pathOf } from "design-token-library";
import { refAt } from "./token-ref.js";

const { expect } = chai;

describe("refAt", () => {
    it("should be a ref of the path", () => {
        const ref = refAt(["color", "accent", "fill"]);

        expect(isRef(ref)).to.be.true;
        expect(pathOf(ref)).to.deep.equal(["color", "accent", "fill"]);
    });
});
