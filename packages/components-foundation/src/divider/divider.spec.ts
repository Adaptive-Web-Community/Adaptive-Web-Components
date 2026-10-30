import chai from "chai";
import { Orientation } from "../utilities/orientation.js";
import { dividerAria, type DividerElement } from "./divider.js";

const { expect } = chai;

class TestDivider extends HTMLElement implements DividerElement {
    public orientation: Orientation = Orientation.horizontal;
}
customElements.define("test-divider", TestDivider);

describe("dividerAria", () => {
    it("should be a separator in its orientation", () => {
        const divider = new TestDivider();
        divider.orientation = Orientation.vertical;

        expect(dividerAria(divider)).to.deep.equal({ role: "separator", ariaOrientation: "vertical" });
    });
});
