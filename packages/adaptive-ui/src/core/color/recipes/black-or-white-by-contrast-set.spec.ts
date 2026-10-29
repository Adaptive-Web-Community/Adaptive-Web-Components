import chai from "chai";
import { parseColor, withAlpha } from "../color.js";
import { InteractivePaintSet } from "../interactive-set.js";
import { black, white } from "../utilities/color-constants.js";
import { blackOrWhiteByContrastSet } from "./black-or-white-by-contrast-set.js";

const { expect } = chai;

const lightBackground = parseColor("#f0f0f0")!;
const darkBackground = parseColor("#202020")!;
const middleGrey = parseColor("#808080")!;

describe("blackOrWhiteByContrastSet", (): void => {
    it("should choose black or white for each state", (): void => {
        const set: InteractivePaintSet = {
            rest: lightBackground,
            hover: darkBackground,
            active: lightBackground,
            focus: darkBackground,
            disabled: lightBackground,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.rest).to.equal(black);
        expect(result.hover).to.equal(white);
        expect(result.focus).to.equal(white);
    });

    it("should apply 30% opacity to the disabled state", (): void => {
        const set: InteractivePaintSet = {
            rest: lightBackground,
            hover: lightBackground,
            active: lightBackground,
            focus: lightBackground,
            disabled: lightBackground,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.disabled).to.deep.equal(withAlpha(black, 0.3));
        expect(result.disabled).not.to.equal(black);
    });

    it("should return null for any state without a reference", (): void => {
        const set: InteractivePaintSet = {
            rest: lightBackground,
            hover: null,
            active: null,
            focus: null,
            disabled: null,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.rest).to.equal(black);
        expect(result.hover).to.be.null;
        expect(result.active).to.be.null;
        expect(result.focus).to.be.null;
        expect(result.disabled).to.be.null;
    });

    it("should use the rest color for active when rest and hover match, regardless of the active reference", (): void => {
        const set: InteractivePaintSet = {
            rest: lightBackground,
            hover: lightBackground,
            // Black would have the best contrast on a light background, but white is not chosen for active.
            active: darkBackground,
            focus: lightBackground,
            disabled: lightBackground,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.rest).to.equal(black);
        expect(result.hover).to.equal(black);
        expect(result.active).to.equal(black);
    });

    it("should calculate active independently when rest and hover differ", (): void => {
        const set: InteractivePaintSet = {
            rest: lightBackground,
            hover: darkBackground,
            active: darkBackground,
            focus: lightBackground,
            disabled: lightBackground,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.active).to.equal(white);
    });

    it("should calculate active when rest or hover is missing", (): void => {
        const set: InteractivePaintSet = {
            rest: null,
            hover: lightBackground,
            active: darkBackground,
            focus: lightBackground,
            disabled: lightBackground,
        };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result.rest).to.be.null;
        expect(result.active).to.equal(white);
    });

    it("should not have a state that the set doesn't have, and have null for one that was cleared", (): void => {
        const set: InteractivePaintSet = { rest: lightBackground, active: darkBackground, focus: null };
        const result = blackOrWhiteByContrastSet(set, 4.5, false);

        expect(result).to.deep.equal({ rest: black, active: white, focus: null });
        expect("hover" in result).to.be.false;
        expect("disabled" in result).to.be.false;
    });

    it("should use the default color when both pass", (): void => {
        const set: InteractivePaintSet = {
            rest: middleGrey,
            hover: middleGrey,
            active: middleGrey,
            focus: middleGrey,
            disabled: middleGrey,
        };

        expect(blackOrWhiteByContrastSet(set, 3, false).rest).to.equal(white);
        expect(blackOrWhiteByContrastSet(set, 3, true).rest).to.equal(black);
    });
});
