import chai from "chai";
import { hasContent, isIconOnly } from "./content.js";

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

describe("hasContent", () => {
    it("should be true for text or an element", () => {
        expect(hasContent(nodes("Label"))).to.be.true;
        expect(hasContent(nodes("<span></span>"))).to.be.true;
    });

    it("should be false for nothing, or white space only", () => {
        expect(hasContent([])).to.be.false;
        expect(hasContent(nodes(" \n "))).to.be.false;
    });
});
