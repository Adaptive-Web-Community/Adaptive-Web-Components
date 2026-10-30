import { tokenNames } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary } from "@adaptive-web/adaptive-ui/reference";
import { expect } from "chai";
import { AppliedStyleValues, PluginDataKey } from "./model.js";
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
    const stored = new Map<PluginDataKey, string>();

    before(() => {
        PluginNode.tokenNames = tokenNames(createReferenceLibrary());
        PluginNode.pluginDataAccessor = {
            getPluginData: (node, key) => stored.get(key) ?? null,
            setPluginData: (node, key, value) => { stored.set(key, value); },
            deletePluginData: (node, key) => { stored.delete(key); },
            getDesignTokensRawData: async () => null,
            getAppliedDesignTokensRawData: async () => null,
            getAppliedTreatmentsRawData: async () => null,
        };
    });

    beforeEach(() => {
        stored.clear();
    });

    describe("finds what a node has by the names that 0.14 stored", () => {
        it("for the design tokens set to it", () => {
            const tokens = new TestNode().deserializeDesignTokens('{"accent-base-color":{"value":"#0078D4"},"density-adjustment-units":{"value":"1"}}');

            expect(tokens).to.deep.equal({
                "color.accent.base": { value: "#0078D4" },
                "density.adjustmentUnits": { value: "1" },
            });
        });

        it("for the design tokens applied to its style, with the state of an interactive token", () => {
            const applied = new TestNode().deserializeAppliedDesignTokens(
                '{"backgroundFill":{"tokenID":"accent-fill-readable"},"borderFillTop":{"tokenID":"neutral-fill-stealth-rest"}}'
            );

            expect(applied).to.deep.equal({
                backgroundFill: { tokenID: "color.accent.fill.readable" },
                borderFillTop: { tokenID: "color.neutral.fill.stealth.rest" },
            });
        });

        it("for the treatments applied to its style", () => {
            const treatments = new TestNode().deserializeAppliedTreatments('["color.accent-fill-readable-control","shape.control"]');

            expect(treatments).to.deep.equal(["color.accent.treatments.fillReadableControl", "shape.treatments.control"]);
        });
    });

    it("keeps a current name as it is", () => {
        const tokens = new TestNode().deserializeDesignTokens('{"color.accent.base":{"value":"#0078D4"}}');

        expect(Object.keys(tokens)).to.deep.equal(["color.accent.base"]);
    });

    it("keeps a name that finds no token, so the node doesn't lose it", () => {
        const tokens = new TestNode().deserializeDesignTokens('{"my-custom-token":{"value":"4"}}');

        expect(Object.keys(tokens)).to.deep.equal(["my-custom-token"]);
    });

    describe("reads the forms of a map that versions before 1.0 stored", () => {
        it("with a data type", () => {
            const tokens = new TestNode().deserializeDesignTokens('{"dataType":"Map","value":[["accent-base-color",{"value":"#0078D4"}]]}');

            expect(tokens).to.deep.equal({ "color.accent.base": { value: "#0078D4" } });
        });

        it("as tagged entries", () => {
            const applied = new TestNode().deserializeAppliedDesignTokens('[["__dataType__","Map"],["backgroundFill",{"tokenID":"accent-fill-readable"}]]');

            expect(applied).to.deep.equal({ backgroundFill: { tokenID: "color.accent.fill.readable" } });
        });
    });

    it("keeps only what an applied design token is, of what a node stored with it", () => {
        const applied = new TestNode().deserializeAppliedDesignTokens('{"backgroundFill":{"tokenID":"color.accent.fill.readable","value":"#0078D4"}}');

        expect(applied).to.deep.equal({ backgroundFill: { tokenID: "color.accent.fill.readable" } });
    });

    it("leaves out a value that isn't one of the record", () => {
        const tokens = new TestNode().deserializeDesignTokens('{"color.accent.base":{"value":"#0078D4"},"color.neutral.base":"#808080"}');

        expect(tokens).to.deep.equal({ "color.accent.base": { value: "#0078D4" } });
    });

    it("reads nothing from data that isn't a record", () => {
        expect(new TestNode().deserializeDesignTokens("not json")).to.deep.equal({});
        expect(new TestNode().deserializeDesignTokens('["a"]')).to.deep.equal({});
        expect(new TestNode().deserializeDesignTokens(null)).to.deep.equal({});
    });

    it("saves the JSON that 0.6 saved, an object by name", async () => {
        const node = new TestNode();
        await node.setDesignTokens({ "color.accent.base": { value: "#0078D4" } });
        node.setAppliedDesignTokens({ backgroundFill: { tokenID: "color.accent.fill.readable" } });
        node.setAppliedTreatments(["shape.treatments.control"]);

        expect(stored.get("designTokens")).to.equal('{"color.accent.base":{"value":"#0078D4"}}');
        expect(stored.get("appliedDesignTokens")).to.equal('{"backgroundFill":{"tokenID":"color.accent.fill.readable"}}');
        expect(stored.get("appliedTreatments")).to.equal('["shape.treatments.control"]');
    });

    it("saves the treatments applied to it under their current key, and removes the key of 0.6", () => {
        stored.set("appliedStyleModules", '["shape.control"]');
        new TestNode().setAppliedTreatments(["shape.treatments.control"]);

        expect(stored.get("appliedTreatments")).to.equal('["shape.treatments.control"]');
        expect(stored.has("appliedStyleModules")).to.equal(false);
    });

    it("removes what is empty", async () => {
        const node = new TestNode();
        await node.setDesignTokens({ "color.accent.base": { value: "#0078D4" } });
        await node.setDesignTokens({});

        expect(stored.has("designTokens")).to.equal(false);
    });
});
