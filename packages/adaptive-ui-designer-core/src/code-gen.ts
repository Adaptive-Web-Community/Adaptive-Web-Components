/* eslint-disable max-len */
import { camelCase, kebabCase } from "change-case";
import {
    Interactivity,
    InteractivityDefinition,
} from "@adaptive-web/adaptive-ui";
import { StyleNameMapping } from "@adaptive-web/adaptive-ui/reference";
import { AdditionalDataKeys } from "./model.js";
import type { PluginUINodeData } from "./model.js";

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

function makeClassName(value: string) {
    return `.${kebabCase(value)}`;
}

// TODO: All of these type definitions will be merged into the core AUI package, including simple interface and serialization support.

export type SerializableBooleanCondition = string; 

export type SerializableStringCondition = Record<string, string>;

export type SerializableCondition = SerializableBooleanCondition | SerializableStringCondition;

export interface SerializableToken {
    target: string;
    tokenID: string;
}

export interface SerializableStyleRule {
    contextCondition?: string;
    part: string;
    styles: string[];
    tokens: SerializableToken[];
}

export interface SerializableAnatomy{
    name: string;
    context: string;
    interactivity?: InteractivityDefinition;
    conditions: Record<string, SerializableCondition>;
    parts: Record<string, string>;
    styleRules: SerializableStyleRule[];
}

export abstract class Condition {
    constructor(
        public readonly name: string,
    ) {}

    toJSON(): any {
        return makeClassName(this.name);
    }
}

export class BooleanCondition extends Condition {
    toJSON(): SerializableBooleanCondition {
        return makeClassName(this.name);
    }
}

export class StringCondition extends Condition {
    constructor(
        name: string,
        public values: Array<string>,
    ) {
        super(name);
    }

    toJSON(): SerializableStringCondition {
        const values = this.values.reduce((prev, current) => {
            prev[current[0]] = makeClassName(this.name + " " + current[1]); // Add space so that there is a kebab between name and value
            return prev;
        }, {} as SerializableStringCondition);

        return values;
    } 
}

export class Token {
    constructor(
        public target: string,
        public tokenID: string,
    ) {}

    toJSON(): SerializableToken {
        return {
            target: this.target,
            tokenID: this.tokenID,
        };
    }
}

export class StyleRule {
    contextCondition?: string;
    part: string;
    styles: Set<string> = new Set();
    tokens: Set<Token> = new Set();

    toJSON(): SerializableStyleRule {
        const contextCondition = typeof this.contextCondition === "string" ? "." + kebabCase(this.contextCondition): undefined;
        return {
            contextCondition,
            part: this.part,
            styles: Array.from(this.styles),
            tokens: Array.from(this.tokens).map(token => token.toJSON())
        };
    }
}

export class Anatomy {
    name: string;
    context: string;
    interactivity?: InteractivityDefinition;
    conditions: Map<string, Condition> = new Map();
    parts: Set<string> = new Set();
    styleRules: Set<StyleRule> = new Set();

    toJSON(): SerializableAnatomy {
        const conditions = Array.from(this.conditions.entries()).reduce((prev, next) => {
            prev[next[0]] = next[1].toJSON()
            return prev
        }, {} as SerializableAnatomy['conditions'])

        const parts = Array.from(this.parts.entries()).reduce((prev, current) => {
            prev[current[0]] = makeClassName(current[1]);
            return prev;
        }, {} as SerializableAnatomy['parts'])

        return {
            name: this.name,
            context: makeClassName(this.name),
            interactivity: this.interactivity,
            conditions,
            parts,
            styleRules: Array.from(this.styleRules).map(rule => rule.toJSON()),
        }
    }
}

/**
 * Code generation capabilities related to component anatomy and styling.
 *
 * @remarks
 * The functionality here is split into two parts to facilitate reuse and customization:
 * - Design tool node parsing into a component anatomy definition
 * - Generating AUI code based on the anatomy definition (functions named "generate" or "gen")
 *
 * The common flow for all output is:
 * ``` ts
 * const codeGen = new CodeGen();
 * const anatomy = codeGen.parseComponent(node);
 * const anatomyOutput = codeGen.generateAnatomyCode(anatomy);
 * const stylesOutput = codeGen.generateStylesCode(anatomy);
 * ```
 */
export class CodeGen {
    /**
     * Parses a component node into anatomy definition.
     *
     * @param node - The node
     * @returns The parsed anatomy definition
     */
    public parseComponent(node: PluginUINodeData): Anatomy {
        if (!node) {
            throw new Error("Parameter `node` must be provided");
        }
        if (!(node.type === "COMPONENT_SET" || node.type === "COMPONENT" || node.type === "INSTANCE")) {
            throw new Error("Parameter `node` must have `type` = 'COMPONENT_SET', 'COMPONENT', or 'INSTANCE'");
        }
        const componentName = node.additionalData.get(AdditionalDataKeys.codeGenName);
        if (!componentName) {
            throw new Error("Parameter `node` must provide `additionalData` value for `codeGenName`");
        }

        const anatomy: Anatomy = new Anatomy();
        anatomy.name = componentName;

        if (node.type === "COMPONENT_SET") {
            // Parse the component names into property and value sets
            const properties = new Map<string, Array<string>>();
            node.children.forEach((child) => {
                const propValues = child.name.split(",");
                propValues.forEach((propValue) => {
                    const [prop, value] = propValue.trim().split("=");
                    const values = properties.get(prop) || [];
                    if (values.indexOf(value) === -1) {
                        values.push(value);
                        properties.set(prop, values);
                    }
                });
            });

            // TODO look for other interactivity models
            if (properties.has("Disabled")) {
                anatomy.interactivity = Interactivity.disabledClass;
            }

            // Convert properties into anatomy conditions
            // TODO: Validate known properties like "State" and "Disabled". Ignore for now.
            properties.forEach((values, property) => {
                if (property !== "State" && property !== "Disabled") {
                    if (values.length === 2 &&
                        values.filter((value) => value.toLowerCase() === "true" || value.toLowerCase() === "false").length === 2) {
                        // boolean property, add once
                        anatomy.conditions.set(property, new BooleanCondition(property));
                    } else {
                        // string property, add all
                        anatomy.conditions.set(property, new StringCondition(property, values));
                    }
                }
            });

            // The first child is the default (no conditions)
            this.walkNode(node.children[0], componentName, "", anatomy);
            const defaultName = node.children[0].name;

            const nodeHandler = (name: string, property: string): void => {
                const found = node.children.find(node => node.name.toLowerCase() === name.toLowerCase());
                if (!found) {
                    // console.warn(`Expected component ${name}, property ${property}, not found`);
                } else {
                    // console.log("  found node", name);
                    this.walkNode(found, componentName, property, anatomy);
                }
            };

            // Find the component node for each condition
            // Note that the current model treats conditions as additive, so condition A and condition B will be
            // separate selectors which might both apply (in sequence)
            anatomy.conditions.forEach((condition, property) => {
                if (condition instanceof BooleanCondition) {
                    // Assume false is the default condition, find the `true` component
                    const name = defaultName.replace(`${property}=false`, `${property}=true`);
                    nodeHandler(name, property);
                } else if (condition instanceof StringCondition) {
                    // The first value is the default, already handled
                    condition.values.slice(1).forEach(value => {
                        const name = defaultName.replace(`${property}=${condition.values[0]}`, `${property}=${value}`);
                        nodeHandler(name, camelCase(`${property} ${value}`));
                    });
                }
            });
        } else {
            this.walkNode(node, componentName, "", anatomy);
        }

        return anatomy;
    }

    /**
     * Generates anatomy code for the provided anatomy definition.
     *
     * @param anatomy - The provided anatomy definition
     * @returns The generated anatomy code
     */
    public generateAnatomyCode(anatomy: Anatomy): string {
        const conditionsSet = new Array(...anatomy.conditions.entries())
            .reduce((accumulated: Set<string>, current: [string, Condition]): Set<string> => {
                if (current[1] instanceof BooleanCondition) {
                    accumulated.add(current[0]);
                } else if (current[1] instanceof StringCondition) {
                    current[1].values.forEach(value => {
                        const currentValue = `${current[0]}${value}`;
                        accumulated.add(currentValue);
                    });
                }

                return accumulated;
            }, new Set());
        const conditionsOut = this.#genTypeCode(anatomy.name, "Conditions", conditionsSet);
        const partsOut = this.#genTypeCode(anatomy.name, "Parts", anatomy.parts);

        // TODO other states (json serialize?)
        const interactivity = anatomy.interactivity ? `\n    interactivity: {\n        interactive: "${anatomy.interactivity.interactive}",\n        disabled: "${anatomy.interactivity.disabled}",\n    },` : "";
        const conditionsValues = new Array(...conditionsSet).map(property => `\n        ${camelCase(property)}: "${makeClassName(property)}",`).join("");
        const partsValues = new Array(...anatomy.parts).map(property => `\n        ${camelCase(property)}: "${makeClassName(property)}",`).join("");

        const anatomyOut = 
`export const ${anatomy.name}Anatomy: ComponentAnatomy<${anatomy.name}Conditions, ${anatomy.name}Parts> = {${interactivity}
    conditions: {${conditionsValues}
    },
    parts: {${partsValues}
    },
};
`;
        // TODO:
        // focus: Focus.contextFocused(),

        const output = `${conditionsOut}\n${partsOut}\n${anatomyOut}\n`;
        return output;
    }

    #genTypeCode(componentName: string, type: "Parts" | "Conditions", properties: Set<string>): string {
        // const partsString = parts.map(part => `    ${camelCase(part)}: "${kebabCase(part)}"`).join("\n");
        // const code = `export const ${componentName}Parts = {\n${partsString}\n};`;
        const propertiesString = new Array(...properties).map(property => `    ${camelCase(property)}: string;`).join("\n");
        return `export type ${componentName}${type} = {\n${propertiesString}\n};\n`;
    }

    /**
     * Generates styling code for the provided anatomy definition.
     *
     * @param anatomy - The provided anatomy definition
     * @returns The generated style code
     */
    public generateStylesCode(anatomy: Anatomy): string {
        const imported = new Array(...anatomy.styleRules).reduce<Array<string>>((accumulated, current) => {
            current.styles.forEach(style => {
                const varName = StyleNameMapping[style as keyof typeof StyleNameMapping];
                accumulated.push(varName);
            });
            current.tokens.forEach(token => {
                const varName = this.tokenIDMap(token.tokenID);
                accumulated.push(varName);
            });
            return accumulated;
        }, new Array<string>());
        const importBase = `import { StyleRules } from "@adaptive-web/adaptive-ui";\n`;
        const refImports = [...imported].sort().join(", ");
        const importRef = `import { ${refImports} } from "@adaptive-web/adaptive-ui/reference";\n`;
        const importAnatomy = `import { ${anatomy.name}Anatomy } from "./${kebabCase(anatomy.name)}.template.js";\n`
        const styleRules = new Array(...anatomy.styleRules).map(styleRule => this.#genStyleRuleCode(anatomy.name, styleRule)).join("\n");
        const genStyleRules = `\nexport const styleRules: StyleRules = [\n${styleRules}\n];\n`;

        const output = `${importBase}${importRef}${importAnatomy}${genStyleRules}`;
        return output;
    }

    #genStyleRuleCode(componentName: string, styleRule: StyleRule): string {
        let targetOut = "";
        const contextCondition = styleRule.contextCondition ? `            contextCondition: ${componentName}Anatomy.conditions.${camelCase(styleRule.contextCondition)},\n` : "";
        const part = styleRule.part ? `            part: ${componentName}Anatomy.parts.${camelCase(styleRule.part)},\n` : "";
        if (contextCondition || part) {
            targetOut = `        target: {\n${part}${contextCondition}        },\n`;
        }

        let stylesOut = "";
        if (styleRule.styles.size > 0) {
            stylesOut = `        styles: [\n            ${new Array(...styleRule.styles).map(style => StyleNameMapping[style as keyof typeof StyleNameMapping] || style).join(",\n            ")},\n        ],\n`;
        }

        let propertiesOut = "";
        if (styleRule.tokens.size > 0) {
            // TODO Need to map tokens better
            const tokens = new Array(...styleRule.tokens).map(token => `${token.target}: ${this.tokenIDMap(token.tokenID)}`);
            propertiesOut = `        properties: {\n            ${tokens.join(",\n            ")},\n        },\n`;
        }

        return `    {\n${targetOut}${stylesOut}${propertiesOut}    },`;
    }

    private cleanNodeName(nodeName: string): string {
        // Remove non-ascii characters
        return nodeName.replace(/[^\x20-\x7F]/g, "").trim();
    }

    private walkNode(node: PluginUINodeData, componentName: string, condition: string, anatomy: Anatomy): void {
        const nodeName = this.cleanNodeName(node.name);

        if (nodeName === "Focus indicator") {
            // Ignore for now
            return;
        }

        if (!node.name.endsWith(ignoreLayerName)) {
            // TODO, not only frames, but what?
            if (node.type === "FRAME" && nodeName !== componentName) {
                anatomy.parts.add(node.name);
            }

            const styleRule = new StyleRule();

            if (condition) {
                styleRule.contextCondition = condition;
            }

            node.appliedStyleModules.forEach(style => {
                const styleVariableName = style;
                styleRule.styles.add(styleVariableName);
            });

            node.appliedDesignTokens.forEach((token, target) => {
                const tokenRef = token.tokenID;
                styleRule.tokens.add(new Token(target, tokenRef));
            });

            if (nodeName !== componentName) {
                styleRule.part = nodeName;
            }

            if (styleRule.styles.size > 0 || styleRule.tokens.size > 0) {
                if (nodeName !== componentName) {
                    anatomy.parts.add(node.name)
                }
                anatomy.styleRules.add(styleRule);
            }
        }

        node.children.forEach((child) => {
            this.walkNode(child, componentName, condition, anatomy);
        });
    }

    private tokenIDMap(tokenID: string): string {
        let adjustedID = tokenID;

        // TODO: Clean up naming and grouping
        const densityGroups = ["control", "item-container", "layer"];
        if (tokenID.startsWith("density_")) {
            for (let i = 0; i < densityGroups.length; i++) {
                const group = densityGroups[i];
                const testGroup = `density_${group}-`;
                const adjustedGroup = `density-${group}_`;
                if (tokenID.startsWith(testGroup)) {
                    adjustedID = tokenID.replace(testGroup, adjustedGroup);
                    continue;
                }
            }
        }

        const pieces = adjustedID.split("_");
        return pieces.map(piece => camelCase(piece)).join(".");
    }
}
