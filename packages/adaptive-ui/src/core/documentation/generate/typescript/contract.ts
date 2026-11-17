import { type Contract, type ContractProperty, ContractPropertyKind, resolveContract } from "../../contract.js";
import { labelOf } from "../../doc-common.js";
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

    /**
     * Module specifier of the generated contract of each contract that is included (see {@link Contract.include}), by its id, for the
     * `import` of the interface that the generated one extends. Required for each included contract.
     */
    readonly includeModules?: Readonly<Record<string, string>>;
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

/** The key of a slot in the generated names: its id in camelCase (`step-up-glyph` is `stepUpGlyph`), since the id is the HTML slot name. */
function slotKey(slotId: string): string {
    return moduleBasenameToCamelCase(slotId);
}

/** Light-DOM slot `name` for a contract slot id (`default` is the unnamed slot). */
function contractSlotName(slotId: string): string {
    return slotId === "default" ? "" : slotId;
}

/** DOM `part` and class string for a structure part id (`stepUp` is `step-up`), like slot names in {@link contractSlotName}. */
function structurePartName(partId: string): string {
    return partId.replace(/([a-z0-9])([A-Z])/g, (_, lower: string, upper: string) => `${lower}-${upper.toLowerCase()}`);
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
    return `${propertyBaseTypeName(prefix, property)}${property.nullable ? " | null" : ""}`;
}

function propertyBaseTypeName(prefix: string, property: ContractProperty): string {
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
    readonly structure?: Structure;
    readonly contract: Contract;
};

/**
 * Generates TypeScript source for the contract artifacts of a component: part ids, enumerated properties, and a contract interface.
 *
 * @remarks
 * A documentation record without a structure, like an abstract component or an interface that other components include, has no part ids.
 *
 * Generated sources have no imports, so they can live in any consumer package layout, except for a contract that includes others: its
 * interface extends theirs, imported from the modules in {@link GenerateTypeScriptContractOptions.includeModules}. The slots of the
 * generated `Slots` are those of the whole contract, the included ones too.
 *
 * Run after documentation changes with the `generate-typescript-contract` package export or by calling this function directly.
 *
 * @public
 */
export function generateTypeScriptContractSource(
    documentation: DocumentationForContractGeneration,
    options?: GenerateTypeScriptContractOptions,
): string {
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

    const contract = documentation.contract;
    const includes = contract.include ?? [];
    const subject = labelOf(documentation);

    for (const included of includes) {
        const module = options?.includeModules?.[included.id];
        if (module === undefined) {
            throw new Error(
                `Contract of "${documentation.id}" includes "${included.id}", which has no module in the includeModules option.`,
            );
        }
        lines.push(`import type { ${idToSymbolPrefix(included.id)}Contract } from ${JSON.stringify(module)};`);
    }
    if (includes.length > 0) {
        lines.push("");
    }

    const allParts = documentation.structure === undefined ? [] : structureParts(documentation.structure);
    if (allParts.length > 0) {
        lines.push(
            "/**",
            ` * Part names of ${subject} for templates (\`part\` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.`,
            " *",
            " * @public",
            " */",
        );
        lines.push(`export const ${prefix}Parts = {`);
        for (let i = 0; i < allParts.length; i++) {
            const { id, part } = allParts[i];
            if (i > 0) {
                lines.push("");
            }
            const doc = escapeTsDoc(part.description ?? part.label ?? id);
            lines.push(`    /** ${doc} */`);
            lines.push(`    ${id}: ${JSON.stringify(structurePartName(id))},`);
        }
        lines.push("} as const;", "");
    }

    const { slots } = resolveContract(contract);
    if (slots.length > 0) {
        lines.push("/**", ` * Slot names of ${subject}.`, " *", " * @public", " */");
        lines.push(`export const ${prefix}Slots = {`);
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (i > 0) {
                lines.push("");
            }
            const slotName = contractSlotName(slot.id);
            const doc = escapeTsDoc(slot.description ?? slot.label ?? slot.id);
            lines.push(`    /** ${doc} */`);
            lines.push(`    ${slotKey(slot.id)}: ${JSON.stringify(slotName)},`);
        }
        lines.push("} as const;", "");
    }

    for (const property of contract.properties) {
        if (property.kind === ContractPropertyKind.enum && property.enumValues?.length) {
            const symbol = valuedPropertySymbol(prefix, property);
            const typeDoc = escapeTsDoc(property.description ?? property.label ?? property.id);
            lines.push("/**", ` * ${typeDoc}`, " *", ` * @public`, " */");
            lines.push(`export const ${symbol} = {`);
            for (let i = 0; i < property.enumValues.length; i++) {
                const value = property.enumValues[i];
                if (i > 0) {
                    lines.push("");
                }
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
            for (let i = 0; i < property.objectProperties.length; i++) {
                const field = property.objectProperties[i];
                if (i > 0) {
                    lines.push("");
                }
                const fieldDoc = escapeTsDoc(field.description ?? field.label ?? field.id);
                lines.push("    /**", `     * ${fieldDoc}`, "     */");
                lines.push(`    ${field.id}: ${field.kind};`);
            }
            lines.push("}", "");
        }
    }

    const contractName = `${prefix}Contract`;
    lines.push("/**");
    for (const definitionLine of escapeTsDoc(documentation.definition?.trim() || `The contract of ${subject}.`).split("\n")) {
        lines.push(definitionLine.trim() === "" ? " *" : ` * ${definitionLine}`);
    }
    if (documentation.remarks) {
        lines.push(" *", " * @remarks");
        for (const remarkLine of escapeTsDoc(documentation.remarks.trim()).split("\n")) {
            lines.push(remarkLine.trim() === "" ? " *" : ` * ${remarkLine}`);
        }
    }
    lines.push(" *", " * @public", " */");
    const extendsClause = includes.length > 0 ? ` extends ${includes.map((included) => `${idToSymbolPrefix(included.id)}Contract`).join(", ")}` : "";
    lines.push(`export interface ${contractName}${extendsClause} {`);
    for (let i = 0; i < contract.properties.length; i++) {
        const property = contract.properties[i];
        if (i > 0) {
            lines.push("");
        }
        const typeName = propertyTypeName(prefix, property);
        const propDoc = escapeTsDoc(property.description ?? property.label ?? property.id);
        lines.push("    /**", `     * ${propDoc}`, "     */");
        lines.push(`    ${property.id}: ${typeName};`);
    }
    lines.push("}", "");

    return lines.join("\n");
}
