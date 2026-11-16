import chai from "chai";
import { ContractPropertyKind, type Documentation } from "../../index.js";
import { typeScriptContractConvention, generateTypeScriptContractSource } from "./contract.js";

const { expect } = chai;

const buttonLikeDoc = {
    id: "button",
    structure: {
        parts: {
            content: {
                label: "Content",
                description: "The default slot label.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                label: "Disabled",
                description: "Cannot be activated.",
            },
            {
                id: "type",
                kind: ContractPropertyKind.enum,
                label: "Type",
                description: "Form participation.",
                enumValues: [
                    { id: "button", description: "Plain button." },
                    { id: "submit", description: "Submits." },
                ],
            },
            {
                id: "hideLabel",
                kind: ContractPropertyKind.boolean,
                label: "Hide Label",
                description: "Hides visible label.",
            },
        ],
        slots: [
            { id: "default", label: "Default" },
            { id: "start", label: "Start" },
        ],
    },
} satisfies Documentation;

describe("typeScriptContractConvention", () => {
    it("should map kebab-case module basenames to camelCase documentation exports", () => {
        expect(typeScriptContractConvention.documentationExportName("text-field")).to.equal("textFieldDocumentation");
        expect(typeScriptContractConvention.documentationExportName("button")).to.equal("buttonDocumentation");
    });
});

describe("generateTypeScriptContractSource", () => {
    it("should emit parts, enumerated type, and contract interface without relative imports", () => {
        const source = generateTypeScriptContractSource(buttonLikeDoc);

        expect(source).to.include("export const ButtonParts");
        expect(source).to.include('content: "content"');
        expect(source).to.include("export const ButtonSlots");
        expect(source).to.include('start: "start"');
        expect(source).to.include('default: ""');
        expect(source).to.include("export const ButtonType");
        expect(source).to.include("export type ButtonType = (typeof ButtonType)");
        expect(source).to.not.include("import ");
        expect(source).to.include("export interface ButtonContract");
        expect(source).to.include("disabled: boolean");
        expect(source).to.include("type: ButtonType");
        expect(source).to.include("hideLabel: boolean");
        expect(source).to.include("Do not edit directly");
    });
});
