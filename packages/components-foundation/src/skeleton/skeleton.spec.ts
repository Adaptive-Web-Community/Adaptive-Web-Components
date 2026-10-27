import chai from "chai";
import { skeletonAria } from "./skeleton.js";

const { expect } = chai;

describe("skeletonAria", () => {
    it("should be hidden", () => {
        expect(skeletonAria()).to.deep.equal({ ariaHidden: "true" });
    });
});
