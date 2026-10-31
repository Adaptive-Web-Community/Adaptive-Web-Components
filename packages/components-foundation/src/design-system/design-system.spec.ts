import chai from "chai";
import { Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "./design-system.js";

const { expect } = chai;

describe("DesignSystem", () => {
    const anatomy = { conditions: {}, parts: { content: "content" }, interactivity: Interactivity.disabledAttribute };

    it("renders a part of a rule as a class", () => {
        const css = new DesignSystem("test").renderStyles(anatomy, [
            { target: { part: "content" }, properties: { cursor: "pointer" } },
        ]);

        expect(css).to.include(" .content { cursor: pointer; }");
    });

    it("keeps a part that is already a selector", () => {
        const css = new DesignSystem("test").renderStyles(anatomy, [
            { target: { part: ".label" }, properties: { cursor: "pointer" } },
        ]);

        expect(css).to.include(" .label { cursor: pointer; }");
        expect(css).not.to.include("..label");
    });

    it("renders the focus of a part of the anatomy as a class", () => {
        const css = new DesignSystem("test").renderStyles({ ...anatomy, focus: Focus.partFocused("content") });

        expect(css).to.include(".content:focus-visible");
    });

    it("renders no rules without style rules or an anatomy", () => {
        expect(new DesignSystem("test").renderStyles()).to.equal("");
    });
});
