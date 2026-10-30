import { tokenNames } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary } from "@adaptive-web/adaptive-ui/reference";
import { expect } from "chai";
import { FIGMA_SHARED_DATA_NAMESPACE } from "./constants.js";
import { parseNode, RestNode } from "./node-parser.js";

const names = tokenNames(createReferenceLibrary());

function frame(pluginData: Record<string, string>, children: RestNode[] = []): RestNode {
    return {
        id: "1:1",
        name: "Frame",
        type: "FRAME",
        children,
        sharedPluginData: { [FIGMA_SHARED_DATA_NAMESPACE]: pluginData },
    };
}

describe("parseNode", () => {
    it("reads the applied tokens a node stores as an object", () => {
        const node = parseNode(frame({ appliedDesignTokens: JSON.stringify({ foregroundFill: { tokenID: "color.accent.stroke.readable" } }) }), names);

        expect(node.appliedDesignTokens).to.deep.equal({ foregroundFill: { tokenID: "color.accent.stroke.readable" } });
    });

    it("reads the applied tokens a node stored as a Map, without their values", () => {
        const json = JSON.stringify([["__dataType__", "Map"], ["foregroundFill", { tokenID: "color.accent.stroke.readable", value: "#000" }]]);
        const node = parseNode(frame({ appliedDesignTokens: json }), names);

        expect(node.appliedDesignTokens).to.deep.equal({ foregroundFill: { tokenID: "color.accent.stroke.readable" } });
    });

    it("reads the applied treatments", () => {
        const node = parseNode(frame({ appliedTreatments: JSON.stringify(["color.accent.treatments.fillReadableControl"]) }), names);

        expect(node.appliedTreatments).to.deep.equal(["color.accent.treatments.fillReadableControl"]);
    });

    it("reads the applied treatments from the key of the style modules when a node doesn't have the current one", () => {
        const node = parseNode(frame({ appliedStyleModules: JSON.stringify(["color.accent.treatments.fillReadableControl"]) }), names);

        expect(node.appliedTreatments).to.deep.equal(["color.accent.treatments.fillReadableControl"]);
    });

    it("reads no treatments from data that isn't a list of names", () => {
        const node = parseNode(frame({ appliedTreatments: JSON.stringify({ name: "color.accent.treatments.fillReadableControl" }) }), names);

        expect(node.appliedTreatments).to.deep.equal([]);
    });

    it("reads the tokens and treatments a node stored by a name they had by their current name", () => {
        const node = parseNode(frame({
            appliedDesignTokens: JSON.stringify({ cornerRadiusTopLeft: { tokenID: "corner-radius-control" } }),
            appliedStyleModules: JSON.stringify(["color.accent-fill-readable-control"]),
        }), names);

        expect(node.appliedDesignTokens).to.deep.equal({ cornerRadiusTopLeft: { tokenID: "shape.cornerRadius.default" } });
        expect(node.appliedTreatments).to.deep.equal(["color.accent.treatments.fillReadableControl"]);
    });

    it("keeps a name that finds nothing", () => {
        const node = parseNode(frame({ appliedTreatments: JSON.stringify(["not.a.treatment"]) }), names);

        expect(node.appliedTreatments).to.deep.equal(["not.a.treatment"]);
    });

    it("reads the children of a node", () => {
        const child = frame({ appliedTreatments: JSON.stringify(["color-accent-fill-readable-control"]) });
        const node = parseNode(frame({}, [child]), names);

        expect(node.children[0].appliedTreatments).to.deep.equal(["color.accent.treatments.fillReadableControl"]);
    });
});
