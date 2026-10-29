import chai from "chai";
import { hex, Library, toCSS } from "design-token-library";
import { formatColor } from "../core/color/color.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { colorContext, ColorContextLibraryTokens } from "./color-context.js";

const { expect } = chai;

const create = () => Library.create<ColorContextLibraryTokens>({ color: colorContext });

describe("color context", () => {
    it("should be white until it is set, as it was", () => {
        expect(formatColor(create().tokens.color.context.$value)).to.equal("#ffffff");
    });

    it("should have the name the token had", () => {
        expect(create().tokens.color.context.name).to.equal("color.context");
    });

    it("should leave what it's for to its type", () => {
        expect(getIntendedFor(create().tokens.color.context)).to.deep.equal([]);
    });

    it("should be set for the content of a layer by extending the library, which leaves the library as it was", () => {
        const library = create();
        const layer = library.extend({ color: { context: { $value: hex("#808080") } } });

        expect(formatColor(layer.tokens.color.context.$value)).to.equal("#808080");
        expect(formatColor(library.tokens.color.context.$value)).to.equal("#ffffff");
        expect(toCSS(layer)).to.equal("--color-context:#808080;");
    });
});
