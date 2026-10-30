import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { labelHost } from "./label.js";

const { expect } = chai;

describe("labelHost", () => {
    it("should name the host by the elements of its label slot, which take precedence over the text of its label attribute", () => {
        const internals = new TestInternals();
        const label = document.createElement("span");

        labelHost(internals, "Name", [label]);

        expect(internals.ariaLabelledByElements).to.deep.equal([label]);
        expect(internals.ariaLabel).to.equal("Name");
    });

    it("should name the host by the text of its label attribute, without elements in its label slot", () => {
        const internals = new TestInternals();

        labelHost(internals, "Name", []);

        expect(internals.ariaLabelledByElements).to.be.null;
        expect(internals.ariaLabel).to.equal("Name");
    });

    it("should give no name for an empty label", () => {
        const internals = new TestInternals();

        labelHost(internals, "", []);

        expect(internals.ariaLabel).to.be.null;
    });
});
