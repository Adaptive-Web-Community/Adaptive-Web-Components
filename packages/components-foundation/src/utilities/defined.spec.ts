import chai from "chai";
import { onDefined } from "./defined.js";

const { expect } = chai;

describe("onDefined", () => {
    it("should call back once an element that isn't defined is defined", async () => {
        const element = document.createElement("on-defined-later");
        let calls = 0;

        onDefined([element], () => calls++);
        customElements.define("on-defined-later", class extends HTMLElement {});
        await customElements.whenDefined("on-defined-later");
        await Promise.resolve();

        expect(calls).to.equal(1);
    });

    it("should not call back for an element that is defined", async () => {
        customElements.define("on-defined-already", class extends HTMLElement {});
        const element = document.createElement("on-defined-already");
        let calls = 0;

        onDefined([element], () => calls++);
        await Promise.resolve();

        expect(calls).to.equal(0);
    });
});
