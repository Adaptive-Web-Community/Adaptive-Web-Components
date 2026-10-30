import { Interactivity, tokenNames } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary } from "@adaptive-web/adaptive-ui/reference";
import { expect } from "chai";
import { anatomyOf } from "./anatomy.js";
import { FIGMA_SHARED_DATA_NAMESPACE } from "./constants.js";
import { parseNode, RestNode } from "./node-parser.js";

const names = tokenNames(createReferenceLibrary());

function node(type: RestNode["type"], name: string, pluginData: Record<string, string> = {}, children: RestNode[] = []): RestNode {
    return { id: name, name, type, children, sharedPluginData: { [FIGMA_SHARED_DATA_NAMESPACE]: pluginData } };
}

const treatments = (...names: string[]) => ({ appliedTreatments: JSON.stringify(names) });
const tokens = (tokens: Record<string, string>) => ({
    appliedDesignTokens: JSON.stringify(Object.fromEntries(Object.entries(tokens).map(([property, tokenID]) => [property, { tokenID }]))),
});

describe("anatomyOf", () => {
    it("has the rules of a component and the parts they style", () => {
        const button = node("COMPONENT", "Button", treatments("color.accent.treatments.fillReadableControl"), [
            node("FRAME", "Content", tokens({ foregroundFill: "color.accent.stroke.readable" })),
        ]);

        expect(anatomyOf(parseNode(button, names))).to.deep.equal({
            name: "Button",
            context: ".button",
            conditions: {},
            parts: { Content: ".content" },
            interactivity: undefined,
            styleRules: [
                {
                    contextCondition: undefined,
                    part: undefined,
                    treatments: ["color.accent.treatments.fillReadableControl"],
                    properties: undefined,
                },
                {
                    contextCondition: undefined,
                    part: "Content",
                    treatments: undefined,
                    properties: { foregroundFill: "color.accent.stroke.readable" },
                },
            ],
        });
    });

    it("has the variants of a component set as conditions, and the rules of each", () => {
        const set = node("COMPONENT_SET", "Button", {}, [
            node("COMPONENT", "Size=Small, Icon=false, State=Rest, Disabled=false", treatments("color.accent.treatments.fillReadableControl")),
            node("COMPONENT", "Size=Large, Icon=false, State=Rest, Disabled=false", tokens({ paddingTop: "density.control.padding" })),
            node("COMPONENT", "Size=Small, Icon=true, State=Rest, Disabled=false", treatments("color.neutral.treatments.fillStealthControl")),
            node("COMPONENT", "Size=Small, Icon=false, State=Rest, Disabled=true"),
        ]);

        const anatomy = anatomyOf(parseNode(set, names));

        expect(anatomy.conditions).to.deep.equal({ Size: { Small: ".size-small", Large: ".size-large" }, Icon: ".icon" });
        expect(anatomy.interactivity).to.equal(Interactivity.disabledClass);
        expect(anatomy.styleRules.map(rule => rule.contextCondition)).to.deep.equal([{ Size: "Small" }, { Size: "Large" }, { Icon: true }]);
    });

    it("has a treatment once in a rule", () => {
        const button = node("COMPONENT", "Button", treatments("color.accent.treatments.fillReadableControl", "color.accent.treatments.fillReadableControl"));

        expect(anatomyOf(parseNode(button, names)).styleRules[0].treatments).to.deep.equal(["color.accent.treatments.fillReadableControl"]);
    });

    it("leaves out the focus indicator, a layer for the design tool, and an instance that isn't inline", () => {
        const styled = tokens({ foregroundFill: "color.accent.stroke.readable" });
        const button = node("COMPONENT", "Button", {}, [
            node("FRAME", "Focus indicator", styled),
            node("FRAME", "Helper (Figma)", styled),
            node("INSTANCE", "Icon", styled),
            node("INSTANCE", "Inline icon", { ...styled, config: JSON.stringify({ inline: true }) }),
        ]);

        const anatomy = anatomyOf(parseNode(button, names));

        expect(anatomy.parts).to.deep.equal({ "Inline icon": ".inline-icon" });
        expect(anatomy.styleRules.map(rule => rule.part)).to.deep.equal(["Inline icon"]);
    });

    it("styles a slot, and not what is in it", () => {
        // The plugin gives a slot, which the REST API doesn't have as a type of node.
        const styled = tokens({ foregroundFill: "color.accent.stroke.readable" });
        const button = parseNode(node("COMPONENT", "Button", {}, [node("FRAME", "Start", styled, [node("FRAME", "In the slot", styled)])]), names);
        const slot = { ...button.children[0], type: "SLOT" };

        const anatomy = anatomyOf({ ...button, children: [slot] });

        expect(anatomy.parts).to.deep.equal({ Start: ".start" });
        expect(anatomy.styleRules.map(rule => rule.part)).to.deep.equal(["Start"]);
    });

    it("needs a component", () => {
        expect(() => anatomyOf(parseNode(node("FRAME", "Button"), names))).to.throw();
    });
});
