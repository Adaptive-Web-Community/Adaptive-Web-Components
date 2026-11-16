import { type Contract, type ContractProperty, ContractPropertyKind } from "../../contract.js";
import type { IdentitySection } from "../../identity.js";
import { type Structure, structureParts } from "../../structure.js";

/**
 * Options for {@link generateTypeScriptContractSource}.
 *
 * @public
 */
export interface GenerateTypeScriptContractOptions {
    /**
     * PascalCase prefix for generated symbols (`Button` → `ButtonParts`, `ButtonType`). Defaults from {@link Identity.id}.
     */
    readonly symbolPrefix?: string;

    /**
     * Path comment for the documentation module (shown in the generated file header).
     */
    readonly sourceModule?: string;
}

/**
 * Naming convention for paired documentation and generated TypeScript contract modules.
 *
 * @public
 */
function moduleBasenameToCamelCase(moduleBasename: string): string {
    return moduleBasename.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export const typeScriptContractConvention = {
    /**
     * Export name for `button.documentation.ts` → `buttonDocumentation`, `text-field.documentation.ts` → `textFieldDocumentation`.
     */
    documentationExportName(moduleBasename: string): string {
        return `${moduleBasenameToCamelCase(moduleBasename)}Documentation`;
    },

    /**
     * Generated file name for `button.documentation.ts` → `button.generated.ts`.
     */
    generatedFileName(moduleBasename: string): string {
        return `${moduleBasename}.generated.ts`;
    },

    /**
     * Module basename from `button.documentation.ts` → `button`.
     */
    moduleBasename(documentationFileName: string): string {
        return documentationFileName.replace(/\.documentation\.ts$/, "");
    },
} as const;

function idToSymbolPrefix(id: string): string {
    return id.charAt(0).toUpperCase() + id.slice(1);
}

function escapeTsDoc(text: string): string {
    return text.replace(/\*\//g, "*\\/");
}

function propertyIdToSymbolTail(id: string): string {
    return id.charAt(0).toUpperCase() + id.slice(1);
}

/** Light-DOM slot `name` for a contract slot id (`default` is the unnamed slot). */
function contractSlotName(slotId: string): string {
    return slotId === "default" ? "" : slotId;
}

function valuedPropertySymbol(prefix: string, property: ContractProperty): string {
    if (property.id === "type") {
        return `${prefix}Type`;
    }
    return `${prefix}${propertyIdToSymbolTail(property.id)}`;
}

function objectPropertySymbol(prefix: string, property: ContractProperty): string {
    return `${prefix}${propertyIdToSymbolTail(property.id)}`;
}

function propertyTypeName(prefix: string, property: ContractProperty): string {
    switch (property.kind) {
        case ContractPropertyKind.enum:
            return valuedPropertySymbol(prefix, property);
        case ContractPropertyKind.object:
            return objectPropertySymbol(prefix, property);
        case ContractPropertyKind.boolean:
        case ContractPropertyKind.string:
        case ContractPropertyKind.number:
            return property.kind;
        default: {
            const exhaustive: never = property.kind;
            return exhaustive;
        }
    }
}

type DocumentationForContractGeneration = IdentitySection & {
    readonly structure: Structure;
    readonly contract: Contract;
};

/**
 * Generates TypeScript source for the contract artifacts of a component: part ids, enumerated properties, and a contract interface.
 *
 * @remarks
 * Generated sources use no relative imports so they can live in any consumer package layout. Run after documentation changes with the
 * `generate-typescript-contract` package export or by calling this function directly.
 *
 * @public
 */
export function generateTypeScriptContractSource(
    documentation: DocumentationForContractGeneration,
    options?: GenerateTypeScriptContractOptions,
): string {
    if (documentation.structure === undefined) {
        throw new Error("Documentation must include a structure section.");
    }
    if (documentation.contract === undefined) {
        throw new Error("Documentation must include a contract section.");
    }

    const prefix = options?.symbolPrefix ?? idToSymbolPrefix(documentation.id);
    const source = options?.sourceModule ?? "component documentation";
    const lines: string[] = [
        "/* eslint-disable */",
        `// This file is generated from ${source} by @adaptive-web/adaptive-ui. Do not edit directly.`,
        "",
    ];

    const structure = documentation.structure;
    const contract = documentation.contract;

    const allParts = structureParts(structure);
    if (allParts.length > 0) {
        lines.push(
            "/**",
            ` * Semantic part ids for {@link ${prefix}Element} (templates and style rule targets—not platform selectors).`,
            " *",
            " * @public",
            " */",
        );
        lines.push(`export const ${prefix}Parts = {`);
        for (const { id, part } of allParts) {
            const doc = escapeTsDoc(part.description ?? part.label ?? id);
            lines.push(`    /** ${doc} */`);
            lines.push(`    ${id}: "${id}",`);
        }
        lines.push("} as const;", "");
    }

    if (contract.slots.length > 0) {
        lines.push("/**", ` * Slot names for {@link ${prefix}Element} templates.`, " *", " * @public", " */");
        lines.push(`export const ${prefix}Slots = {`);
        for (const slot of contract.slots) {
            const slotName = contractSlotName(slot.id);
            const doc = escapeTsDoc(slot.description ?? slot.label ?? slot.id);
            lines.push(`    /** ${doc} */`);
            lines.push(`    ${slot.id}: ${JSON.stringify(slotName)},`);
        }
        lines.push("} as const;", "");
    }

    for (const property of contract.properties) {
        if (property.kind === ContractPropertyKind.enum && property.enumValues?.length) {
            const symbol = valuedPropertySymbol(prefix, property);
            const typeDoc = escapeTsDoc(property.description ?? property.label ?? property.id);
            lines.push("/**", ` * ${typeDoc}`, " *", ` * @public`, " */");
            lines.push(`export const ${symbol} = {`);
            for (const value of property.enumValues) {
                const valueDoc = escapeTsDoc(value.description ?? value.label ?? value.id);
                lines.push(`    /** ${valueDoc} */`);
                lines.push(`    ${value.id}: "${value.id}",`);
            }
            lines.push("} as const;", "");
            lines.push("/** @public */");
            lines.push(`export type ${symbol} = (typeof ${symbol})[keyof typeof ${symbol}];`, "");
        }

        if (property.kind === ContractPropertyKind.object && property.objectProperties?.length) {
            const symbol = objectPropertySymbol(prefix, property);
            const typeDoc = escapeTsDoc(property.description ?? property.label ?? property.id);
            lines.push("/**", ` * ${typeDoc}`, " *", " * @public", " */");
            lines.push(`export interface ${symbol} {`);
            for (const field of property.objectProperties) {
                const fieldDoc = escapeTsDoc(field.description ?? field.label ?? field.id);
                lines.push("    /**", `     * ${fieldDoc}`, "     */");
                lines.push(`    ${field.id}: ${field.kind};`);
            }
            lines.push("}", "");
        }
    }

    const contractName = `${prefix}Contract`;
    lines.push("/**", ` * Contract properties documented for {@link ${prefix}Element}.`, " *", " * @public", " */");
    lines.push(`export interface ${contractName} {`);
    for (const property of contract.properties) {
        const typeName = propertyTypeName(prefix, property);
        const propDoc = escapeTsDoc(property.description ?? property.label ?? property.id);
        lines.push("    /**", `     * ${propDoc}`, "     */");
        lines.push(`    ${property.id}: ${typeName};`);
    }
    lines.push("}", "");

    return lines.join("\n");
}
