import chai from "chai";
import {
    ContractPropertyKind,
    RuleSeverity,
    RuleStance,
    type Documentation,
} from "./index.js";
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
                id: "hide-label-accessible-name",
                stance: RuleStance.do,
                severity: RuleSeverity.must,
                text: "Provide an accessible name.",
            },
            {
                id: "no-vague-critical",
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
        expect(md).to.include("### Conditions");
        expect(md).to.include("## Slots");
        expect(md).to.include("Documentation changelog");
    });
});
