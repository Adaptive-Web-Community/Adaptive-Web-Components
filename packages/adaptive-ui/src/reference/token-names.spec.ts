import chai from "chai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolveTokenName, tokenNames } from "../core/token-names.js";
import { createReferenceLibrary } from "./library.js";

const { expect } = chai;

// The names of the tokens before 1.0: the name of 0.x of each token, and its name in 0.14, from the table of 0.14 (`TokenNameMapping`)
// without the foregrounds on a fill and the recipes, which aren't tokens any more, and with its layer entries, which were shifted by one,
// put right.
const formerNames: { old: string; name: string }[] = JSON.parse(
    fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/reference/token-names-before-1.0.json"), "utf8")
);

describe("the names of the reference tokens", () => {
    const index = tokenNames(createReferenceLibrary());
    const resolve = (name: string) => resolveTokenName(index, name);

    it("should find the token of each name of 0.x and of 0.14, the same one for both", () => {
        const missing = formerNames.filter(({ old, name }) => {
            const fromOld = resolve(old);
            const fromName = resolve(name);
            return fromOld === undefined || fromName === undefined || fromOld.name !== fromName.name;
        });

        expect(formerNames).to.have.length(685);
        expect(missing).to.deep.equal([]);
    });

    it("should say that each name of 0.x was renamed", () => {
        expect(formerNames.filter(({ old }) => !resolve(old)?.renamed)).to.deep.equal([]);
    });

    it("should find the renamed tokens", () => {
        const samples: [string, string][] = [
            ["fill-color", "color.context"],
            ["neutral-base-color", "color.neutral.base"],
            ["min-contrast-readable", "color.wcagContrast.minContrast.readable"],
            ["color.shared.stroke.strong.minContrast", "color.wcagContrast.minContrast.strong"],
            ["color.shared.fill.subtle.hoverDelta", "color.deltas.fill.subtle.hover"],
            ["stroke-readable-disabled-delta", "color.deltas.stroke.readable.disabled"],
            ["density.layer.cornerRadius", "shape.cornerRadius.layer"],
            ["corner-radius-control", "shape.cornerRadius.default"],
            ["density.itemContainer.horizontal.padding", "density.controlList.horizontal.padding"],
            ["density_item-container-vertical-gap", "density.controlList.vertical.gap"],
            ["density_control-design-unit", "density.control.designUnit"],
            ["color.layer.fill.layerDelta", "color.layer.fill.restDelta"],
            ["layer-fill-hover-delta", "color.layer.fill.interactiveDeltas.hover"],
            ["layer-fill-fixed-minus-1", "color.layer.fill.ramp.minus1"],
            ["elevation.card.hoverSize", "elevation.card.deltas.hover"],
            ["elevation.dialogSize", "elevation.dialog.size"],
            ["typography.body.fontWeight", "typography.fontWeight.body"],
            ["font-family", "typography.fontFamily.default"],
            ["type-ramp-plus-1-line-height", "typography.ramp.default.lineHeight.plus1"],
            ["typography.ramp.minus2.fontSize", "typography.ramp.default.fontSize.minus2"],
            ["focus-stroke", "color.focusStroke"],
            ["accent-fill-subtle-rest", "color.accent.fill.subtle.rest"],
            ["neutral-stroke-strong-value", "color.neutral.stroke.strong"],
        ];

        for (const [old, name] of samples) {
            expect(resolve(old), old).to.include({ name, renamed: true });
        }
    });

    it("should find a token by its name, which isn't renamed", () => {
        expect(resolve("color.accent.fill.subtle.rest")).to.include({ name: "color.accent.fill.subtle.rest", renamed: false });
        expect(resolve("typography.ramp.default.fontSize.base")).to.include({ renamed: false });
    });
});
