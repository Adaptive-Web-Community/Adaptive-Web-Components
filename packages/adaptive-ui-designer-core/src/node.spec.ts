import { tokenNames } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary } from "@adaptive-web/adaptive-ui/reference";
import { expect } from "chai";
import { AppliedStyleValues } from "./model.js";
import { PluginNode } from "./node.js";

class TestNode extends PluginNode {
    public readonly id = "1";
    public readonly type = "FRAME";
    public readonly name = "Test";
    public readonly fillColor = null;
    public readonly states = undefined;
    public readonly supportsCodeGen = false;
    public readonly codeGenName = undefined;
    public async getState() { return null; }
    public getRefNode() { return null; }
    public async getCanHaveChildren() { return false; }
    public async getChildren() { return []; }
    public async getParent() { return null; }
    public async getEffectiveFillColor() { return null; }
    public async getSupports() { return []; }
    public async paint(values: AppliedStyleValues) {}
    public async handleManualDarkMode() { return false; }
}

describe("PluginNode", () => {
    before(() => {
        PluginNode.tokenNames = tokenNames(createReferenceLibrary());
    });

    describe("finds what a node has by the names that 0.14 stored", () => {
        it("for the design tokens set to it", () => {
            const tokens = new TestNode().deserializeDesignTokens('{"accent-base-color":{"value":"#0078D4"},"density-adjustment-units":{"value":"1"}}');

            expect([...tokens]).to.deep.equal([
                ["color.accent.base", { value: "#0078D4" }],
                ["density.adjustmentUnits", { value: "1" }],
            ]);
        });

        it("for the design tokens applied to its style, with the state of an interactive token", () => {
            const applied = new TestNode().deserializeAppliedDesignTokens(
                '{"backgroundFill":{"tokenID":"accent-fill-readable"},"borderFillTop":{"tokenID":"neutral-fill-stealth-rest"}}'
            );

            expect([...applied]).to.deep.equal([
                ["backgroundFill", { tokenID: "color.accent.fill.readable" }],
                ["borderFillTop", { tokenID: "color.neutral.fill.stealth.rest" }],
            ]);
        });

        it("for the treatments applied to its style", () => {
            const modules = new TestNode().deserializeAppliedStyleModules('["color.accent-fill-readable-control","shape.control"]');

            expect(modules).to.deep.equal(["color.accent.treatments.fillReadableControl", "shape.treatments.control"]);
        });
    });

    it("keeps a current name as it is", () => {
        const tokens = new TestNode().deserializeDesignTokens('{"color.accent.base":{"value":"#0078D4"}}');

        expect([...tokens.keys()]).to.deep.equal(["color.accent.base"]);
    });

    it("keeps a name that finds no token, so the node doesn't lose it", () => {
        const tokens = new TestNode().deserializeDesignTokens('{"my-custom-token":{"value":"4"}}');

        expect([...tokens.keys()]).to.deep.equal(["my-custom-token"]);
    });
});
