import chai from "chai";
import { progressAria, type ProgressElement, progressPercent } from "./progress.js";

const { expect } = chai;

class TestProgress extends HTMLElement implements ProgressElement {
    public value: number | null = null;
    public min = 0;
    public max = 100;
}
customElements.define("test-progress", TestProgress);

function progress(value: number | null, min = 0, max = 100): TestProgress {
    const element = new TestProgress();
    Object.assign(element, { value, min, max });
    return element;
}

describe("progressPercent", () => {
    it("should be the part of the range that is done", () => {
        expect(progressPercent(progress(25))).to.equal(25);
        expect(progressPercent(progress(15, 10, 30))).to.equal(25);
    });

    it("should be null when the value isn't known", () => {
        expect(progressPercent(progress(null))).to.be.null;
        expect(progressPercent(progress(NaN))).to.be.null;
    });

    it("should stay between 0 and 100", () => {
        expect(progressPercent(progress(150))).to.equal(100);
        expect(progressPercent(progress(-5))).to.equal(0);
    });

    it("should be 0 when the range is empty", () => {
        expect(progressPercent(progress(5, 5, 5))).to.equal(0);
    });
});

describe("progressAria", () => {
    it("should be a progress bar with its range and value", () => {
        expect(progressAria(progress(40, 0, 200))).to.deep.equal({
            role: "progressbar",
            ariaValueMin: "0",
            ariaValueMax: "200",
            ariaValueNow: "40",
        });
    });

    it("should report a value outside the range at the nearest end, and keep the value", () => {
        const element = progress(150);

        expect(progressAria(element).ariaValueNow).to.equal("100");
        expect(element.value).to.equal(150);
    });

    it("should clear the value when it isn't known", () => {
        expect(progressAria(progress(null)).ariaValueNow).to.be.null;
    });
});
