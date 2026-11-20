/* eslint-disable max-len */
import { kebabCase } from "change-case";
import {
    isSerializableOnFill,
    resolveTokenName,
    type SerializableAnatomy,
    type SerializableOnFill,
    type SerializableStyleRule,
    type TokenNameIndex,
} from "@adaptive-web/adaptive-ui";

const identifier = /^[A-Za-z_$][\w$]*$/;

// A key of an object, or a name of a property.
const keyOf = (key: string): string => (identifier.test(key) ? key : JSON.stringify(key));
const access = (base: string, key: string): string => (identifier.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`);

// A value as code, from data that is JSON: an object has a key that isn't quoted where it doesn't need to be.
function literal(value: unknown, indent: string): string {
    if (Array.isArray(value)) {
        return `[${value.map(item => literal(item, indent)).join(", ")}]`;
    }
    if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);
        const inner = `${indent}    `;
        return entries.length === 0 ? "{}" : `{\n${entries.map(([key, entry]) => `${inner}${keyOf(key)}: ${literal(entry, inner)},`).join("\n")}\n${indent}}`;
    }
    return JSON.stringify(value);
}

/**
 * Code generation capabilities related to component anatomy and styling.
 *
 * @remarks
 * The functionality here is split into two parts to facilitate reuse and customization:
 * - Design tool node parsing into a component anatomy definition (`anatomyOf` of `@adaptive-web/adaptive-ui-designer-figma`)
 * - Generating AUI code based on the anatomy definition (functions named "generate" or "gen")
 *
 * The common flow for all output is:
 * ``` ts
 * const codeGen = new CodeGen(tokenNames(library));
 * const anatomyOutput = codeGen.generateAnatomyCode(anatomy);
 * const stylesOutput = codeGen.generateStylesCode(anatomy);
 * ```
 *
 * The treatments and the tokens of the styles are written as refs of the library, by path (`tokens.color.accent.treatments.fillReadableControl`),
 * where `tokens` is the `refs()` of the library.
 */
export class CodeGen {
    /**
     * @param names - The names that find the tokens of the library, which tell what in the styles is a token, and its path
     * @param tokens - What `tokens`, the refs of the library, is imported from by the styles
     */
    constructor(
        private readonly names: TokenNameIndex,
        private readonly tokens: string = "../../styles/tokens.js"
    ) {}

    /**
     * Generates anatomy code for the provided anatomy definition.
     *
     * @param anatomy - The provided anatomy definition
     * @returns The generated anatomy code
     */
    public generateAnatomyCode(anatomy: SerializableAnatomy): string {
        const { name, context, conditions, parts, interactivity, focus, cursor } = anatomy;

        const conditionsType = Object.entries(conditions)
            .map(([key, condition]) => `    ${keyOf(key)}: ${typeof condition === "string" ? "string" : `{ ${Object.keys(condition).map(value => `${keyOf(value)}: string`).join("; ")} }`};`)
            .join("\n");
        const partsType = Object.keys(parts).map(key => `    ${keyOf(key)}: string;`).join("\n");

        const properties = { context, interactivity, focus, cursor, conditions, parts };
        const body = Object.entries(properties)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `    ${key}: ${literal(value, "    ")},`)
            .join("\n");

        return `export type ${name}Conditions = {\n${conditionsType}\n};\n\nexport type ${name}Parts = {\n${partsType}\n};\n\n` +
            `export const ${name}Anatomy: ComponentAnatomy<${name}Conditions, ${name}Parts> = {\n${body}\n};\n`;
    }

    /**
     * Generates styling code for the provided anatomy definition.
     *
     * @param anatomy - The provided anatomy definition
     * @returns The generated style code
     */
    public generateStylesCode(anatomy: SerializableAnatomy): string {
        const rules = anatomy.styleRules.map(rule => this.#genStyleRuleCode(anatomy, rule));
        const usesOnFill = anatomy.styleRules.some(rule => Object.values(rule.properties ?? {}).some(value => isSerializableOnFill(value)));

        const importBase = `import { ${["StyleRules", ...(usesOnFill ? ["onFill"] : [])].join(", ")} } from "@adaptive-web/adaptive-ui";\n`;
        const importTokens = `import { tokens } from "${this.tokens}";\n`;
        const importAnatomy = `import { ${anatomy.name}Anatomy } from "./${kebabCase(anatomy.name)}.template.js";\n`;
        const genStyleRules = `\nexport const styleRules: StyleRules = [\n${rules.join("\n")}\n];\n`;

        return `${importBase}${importTokens}${importAnatomy}${genStyleRules}`;
    }

    // The ref of the token that a name finds, as code, for the path of a token, and for the name of a treatment, which is its group where the group has it as its `$root`.
    #ref(name: string, treatment: boolean): string | undefined {
        const resolved = resolveTokenName(this.names, name);
        if (resolved === undefined) {
            return undefined;
        }
        const path = treatment && resolved.path[resolved.path.length - 1] === "$root" ? resolved.path.slice(0, -1) : resolved.path;
        return path.reduce((code, key) => access(code, key), "tokens");
    }

    // A value of a property: a token by its name, a value on a fill, or a value of CSS.
    #value(value: string | SerializableOnFill): string {
        if (typeof value !== "string") {
            const token = this.#ref(value.token, false) ?? JSON.stringify(value.token);
            const fill = value.fill === undefined ? undefined : this.#ref(value.fill, false) ?? JSON.stringify(value.fill);
            const options = [...(fill ? [`fill: ${fill}`] : []), ...(value.activeFollowsRest ? ["activeFollowsRest: true"] : [])];
            return options.length > 0 ? `onFill(${token}, { ${options.join(", ")} })` : `onFill(${token})`;
        }
        return this.#ref(value, false) ?? JSON.stringify(value);
    }

    #genStyleRuleCode(anatomy: SerializableAnatomy, rule: SerializableStyleRule): string {
        const anatomyName = `${anatomy.name}Anatomy`;

        // The selector of a condition, or of the conditions together, which are all on the same element.
        const conditions = Object.entries(rule.contextCondition ?? {}).map(([condition, value]) =>
            typeof value === "string" ? access(access(`${anatomyName}.conditions`, condition), value) : access(`${anatomyName}.conditions`, condition)
        );
        const contextCondition = conditions.length > 1 ? `\`${conditions.map(condition => `\${${condition}}`).join("")}\`` : conditions[0];
        const target = [
            ...(rule.part ? [`            part: ${access(`${anatomyName}.parts`, rule.part)},`] : []),
            ...(contextCondition ? [`            contextCondition: ${contextCondition},`] : []),
            ...(rule.stateOnContext ? ["            stateOnContext: true,"] : []),
        ];
        const targetOut = target.length > 0 ? `        target: {\n${target.join("\n")}\n        },\n` : "";

        // `styles` is the name that `treatments` had.
        const treatmentNames = [...new Set([...(rule.styles ?? []), ...(rule.treatments ?? [])])];
        const treatmentsOut = treatmentNames.length > 0
            ? `        treatments: [\n${treatmentNames.map(name => `            ${this.#ref(name, true) ?? `/* not a treatment of the library: ${name} */`},`).join("\n")}\n        ],\n`
            : "";

        const properties = Object.entries(rule.properties ?? {});
        const propertiesOut = properties.length > 0
            ? `        properties: {\n${properties.map(([property, value]) => `            ${keyOf(property)}: ${this.#value(value)},`).join("\n")}\n        },\n`
            : "";

        return `    {\n${targetOut}${treatmentsOut}${propertiesOut}    },`;
    }
}
