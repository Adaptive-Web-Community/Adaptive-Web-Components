import chai from "chai";
import { Styles } from "./deprecated.js";
import { Treatment } from "./treatment.js";

const { expect } = chai;

describe("deprecated styles", () => {
    it("should make a treatment of properties, with a name", () => {
        expect(Styles.fromProperties({ opacity: 1 }, "faded")).to.deep.equal({ name: "faded", properties: { opacity: 1 } });
    });

    it("should make a treatment of treatments and properties, with a name", () => {
        const shape: Treatment = { properties: { cornerRadius: "4px" } };

        expect(Styles.compose([shape], { opacity: 1 }, "control")).to.deep.equal({ name: "control", treatments: [shape], properties: { opacity: 1 } });
    });
});
