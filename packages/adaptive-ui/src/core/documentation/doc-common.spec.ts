import chai from "chai";
import { labelFromId, labelOf } from "./doc-common.js";

const { expect } = chai;

describe("labelFromId", () => {
    it("should make words of a camelCase id", () => {
        expect(labelFromId("textField")).to.equal("Text Field");
        expect(labelFromId("button")).to.equal("Button");
    });
});

describe("labelOf", () => {
    it("should prefer the label an item gives", () => {
        expect(labelOf({ id: "uiToggle", label: "UI Toggle" })).to.equal("UI Toggle");
        expect(labelOf({ id: "uiToggle" })).to.equal("Ui Toggle");
    });
});
