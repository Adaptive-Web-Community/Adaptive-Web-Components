import chai from "chai";
import {
    ContractPropertyKind,
    RuleSeverity,
    RuleStance,
    type Documentation,
} from "../../index.js";
import { renderMarkdown } from "./markdown.js";

const { expect } = chai;

const sampleDocumentation = {
    id: "sample",
    definition: "A **sample** triggers an action for projection tests.",
    structure: {
        parts: {
            content: {
                label: "Content",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                label: "Disabled",
            },
            {
                id: "hideLabel",
                kind: ContractPropertyKind.boolean,
                label: "Hide label",
            },
        ],
        slots: [
            {
                id: "default",
                label: "Default",
                description: "Primary label.",
            },
        ],
    },
    usage: {
        rules: [
            {
                id: "hideLabelAccessibleName",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                text: "Provide an accessible name.",
            },
            {
                id: "noVagueCritical",
                stance: RuleStance.dont,
                severity: RuleSeverity.must,
                text: "Avoid vague labels on critical actions.",
            },
        ],
    },
    changelog: [
        {
            date: "2026-11-12",
            author: "test",
            summary: "Fixture for markdown projection.",
            changeKind: "structure",
        },
    ],
} satisfies Documentation;

describe("renderMarkdown", () => {
    it("should render documentation with canonical section order", () => {
        const md = renderMarkdown(sampleDocumentation);

        const definitionIndex = md.indexOf("triggers an action");
        const usageIndex = md.indexOf("## Usage");
        const structureIndex = md.indexOf("## Structure");
        const contractIndex = md.indexOf("## Properties");

        expect(definitionIndex).to.be.greaterThan(-1);
        expect(usageIndex).to.be.greaterThan(definitionIndex);
        expect(structureIndex).to.be.greaterThan(usageIndex);
        expect(contractIndex).to.be.greaterThan(structureIndex);
        expect(md).to.include("#### Do (MUST)");
        expect(md).to.include("#### Don't (MUST)");
        expect(md).to.include("### Content");
        expect(md).not.to.include("### Conditions");
        expect(md).to.include("## Slots");
        expect(md).to.include("Documentation changelog");
    });

    it("should render the remarks after the definition", () => {
        const md = renderMarkdown({ id: "field", definition: "A definition.", remarks: "Some remarks." });

        expect(md.indexOf("A definition.")).to.be.greaterThan(-1);
        expect(md.indexOf("Some remarks.")).to.be.greaterThan(md.indexOf("A definition."));
    });

    it("should render the properties and slots of an included contract, and a nullable type", () => {
        const md = renderMarkdown({
            id: "field",
            contract: {
                include: [
                    {
                        id: "textInput",
                        contract: {
                            properties: [{ id: "name", kind: ContractPropertyKind.string, nullable: true }],
                            slots: [{ id: "label", description: "The label." }],
                        },
                    },
                ],
                properties: [{ id: "pattern", kind: ContractPropertyKind.string }],
                slots: [],
            },
        });

        expect(md).to.include("### Name");
        expect(md).to.include("Type: `string` or `null`");
        expect(md).to.include("### Pattern");
        expect(md).to.include("### Label");
    });
});
