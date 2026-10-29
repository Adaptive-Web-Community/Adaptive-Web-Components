import chai from "chai";
import { Focus, Interactivity } from "./anatomy.js";

const { expect } = chai;

describe("Interactivity", () => {
    it("should define interactive and disabled conditions for an attribute", () => {
        expect(Interactivity.disabledAttribute).to.deep.equal({ interactive: ":not([disabled])", disabled: "[disabled]" });
    });

    it("should define interactive and disabled conditions for a class", () => {
        expect(Interactivity.disabledClass).to.deep.equal({ interactive: ":not(.disabled)", disabled: ".disabled" });
    });

    it("should define an interactive condition for href only", () => {
        expect(Interactivity.hrefAttribute).to.deep.equal({ interactive: "[href]" });
    });

    it("should define always interactive as an empty condition", () => {
        expect(Interactivity.always).to.deep.equal({ interactive: "" });
    });

    it("should define never interactive as no conditions", () => {
        expect(Interactivity.never).to.deep.equal({});
    });
});

describe("Focus", () => {
    it("should focus the context", () => {
        expect(Focus.contextFocused()).to.deep.equal({ focusTarget: { ignoreInteractivity: true } });
    });

    it("should show focus on a part when the context has focus", () => {
        const focus = Focus.contextChildFocused(".indicator");

        expect(focus.focusTarget).to.deep.equal({ stateOnContext: true, part: ".indicator", ignoreInteractivity: true });
        expect(focus.resetTarget).to.deep.equal({ ignoreInteractivity: true });
    });

    it("should focus a part", () => {
        const focus = Focus.partFocused(".control");

        expect(focus.focusTarget).to.deep.equal({ part: ".control", ignoreInteractivity: true });
        expect(focus.resetTarget).to.be.undefined;
    });

    it("should show focus on a part when another part has focus within", () => {
        const focus = Focus.partWithin(".indicator", ".input");

        expect(focus.focusTarget).to.deep.equal({
            part: ".indicator",
            focus: ":focus-within",
            ignoreInteractivity: true,
        });
        expect(focus.resetTarget).to.deep.equal({ part: ".input", ignoreInteractivity: true });
    });

    it("should return a new definition each time", () => {
        expect(Focus.contextFocused()).not.to.equal(Focus.contextFocused());
    });
});
