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

    it("should type a nullable property as `| null`", () => {
        const source = generateTypeScriptContractSource({
            id: "field",
            contract: {
                properties: [
                    { id: "name", kind: ContractPropertyKind.string, nullable: true },
                    { id: "disabled", kind: ContractPropertyKind.boolean },
                ],
                slots: [],
            },
        });

        expect(source).to.include("name: string | null;");
        expect(source).to.include("disabled: boolean;");
    });

    it("should put the remarks on the contract, keeping its paragraphs", () => {
        const source = generateTypeScriptContractSource({
            id: "field",
            definition: "A field.",
            remarks: "First paragraph.\n\nSecond, with `*/` in it.",
            contract: { properties: [{ id: "disabled", kind: ContractPropertyKind.boolean }], slots: [] },
        });

        expect(source).to.include(
            [
                "/**",
                " * A field.",
                " *",
                " * @remarks",
                " * First paragraph.",
                " *",
                " * Second, with `*\\/` in it.",
                " *",
                " * @public",
                " */",
                "export interface FieldContract {",
            ].join("\n"),
        );
    });

    it("should describe the contract with the definition, not as the contract of an element", () => {
        const source = generateTypeScriptContractSource({
            id: "textInput",
            definition: "A field the user types text in.",
            structure: { parts: { control: { description: "The control." } } },
            contract: { properties: [], slots: [{ id: "label" }] },
        });

        expect(source).to.include("/**\n * A field the user types text in.\n *\n * @public\n */\nexport interface TextInputContract");
        expect(source).to.include("Semantic part ids of Text Input");
        expect(source).to.include("Slot names of Text Input.");
        expect(source).to.not.include("Element");
    });

    it("should say what the contract is of without a definition", () => {
        const source = generateTypeScriptContractSource({ id: "textInput", contract: { properties: [], slots: [] } });

        expect(source).to.include(" * The contract of Text Input.");
    });

    it("should key a slot named in kebab-case by its camelCase id, with the slot name as its value", () => {
        const source = generateTypeScriptContractSource({
            id: "numberField",
            contract: { properties: [], slots: [{ id: "step-up-glyph" }, { id: "default" }] },
        });

        expect(source).to.include('stepUpGlyph: "step-up-glyph",');
        expect(source).to.include('default: "",');
    });

    it("should key a part by its structure id, with a kebab-case DOM name as its value", () => {
        const source = generateTypeScriptContractSource({
            id: "numberField",
            structure: {
                parts: {
                    root: { description: "Root." },
                    controls: {
                        description: "Controls.",
                        parts: {
                            stepUp: { description: "Step up." },
                            stepDown: { description: "Step down." },
                        },
                    },
                },
            },
            contract: { properties: [], slots: [] },
        });

        expect(source).to.include('stepUp: "step-up",');
        expect(source).to.include('stepDown: "step-down",');
        expect(source).to.include('root: "root",');
    });

    it("should not have remarks without them", () => {
        const source = generateTypeScriptContractSource({
            id: "field",
            contract: { properties: [], slots: [] },
        });

        expect(source).to.not.include("@remarks");
    });

    it("should not need a structure", () => {
        const source = generateTypeScriptContractSource({
            id: "textInput",
            contract: { properties: [{ id: "required", kind: ContractPropertyKind.boolean }], slots: [] },
        });

        expect(source).to.not.include("TextInputParts");
        expect(source).to.include("export interface TextInputContract {");
    });

    describe("with an included contract", () => {
        const textInput = {
            id: "textInput",
            contract: {
                properties: [{ id: "required", kind: ContractPropertyKind.boolean }],
                slots: [{ id: "label" }],
            },
        };
        const textField = {
            id: "textField",
            contract: {
                include: [textInput],
                properties: [{ id: "pattern", kind: ContractPropertyKind.string }],
                slots: [{ id: "start" }],
            },
        };

        it("should extend its generated contract, imported from its module, and list only its own properties", () => {
            const source = generateTypeScriptContractSource(textField, {
                includeModules: { textInput: "../text-input/text-input.generated.js" },
            });

            expect(source).to.include('import type { TextInputContract } from "../text-input/text-input.generated.js";');
            expect(source).to.include("export interface TextFieldContract extends TextInputContract {");
            expect(source).to.include("pattern: string;");
            expect(source).to.not.include("required: boolean;");
        });

        it("should have the included slots in its slot names", () => {
            const source = generateTypeScriptContractSource(textField, {
                includeModules: { textInput: "../text-input/text-input.generated.js" },
            });

            expect(source).to.include('label: "label"');
            expect(source).to.include('start: "start"');
        });

        it("should throw when the module of an included contract isn't given", () => {
            expect(() => generateTypeScriptContractSource(textField)).to.throw('includes "textInput"');
        });
    });
});
