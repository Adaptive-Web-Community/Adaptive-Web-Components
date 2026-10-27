import chai from "chai";
import { isIconOnly } from "./icon-only.js";

const { expect } = chai;

function nodes(html: string): Node[] {
    const container = document.createElement("div");
    container.innerHTML = html;
    return Array.from(container.childNodes);
}

describe("isIconOnly", () => {
    it("should be true for one SVG, with white space around it", () => {
        expect(isIconOnly(nodes(" <svg></svg>\n"))).to.be.true;
    });

    it("should be false for an SVG with text", () => {
        expect(isIconOnly(nodes("<svg></svg> Save"))).to.be.false;
    });

    it("should be false for text, or for another element", () => {
        expect(isIconOnly(nodes("Save"))).to.be.false;
        expect(isIconOnly(nodes("<span></span>"))).to.be.false;
    });

    it("should be false for two SVGs", () => {
        expect(isIconOnly(nodes("<svg></svg><svg></svg>"))).to.be.false;
    });
});
