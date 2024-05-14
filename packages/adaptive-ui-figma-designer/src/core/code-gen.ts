import { StyleNameMapping } from "@adaptive-web/adaptive-ui/reference";
import { camelCase, kebabCase } from "change-case";
import { AdditionalDataKeys } from "../core/model.js";
import type { PluginUINodeData } from "../core/model.js";

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

class Condition {}

class BooleanCondition extends Condition {
    readonly type: "boolean";
}

class StringCondition extends Condition {
    readonly type: "string";

    constructor(public values: Set<string>) {
        super();
    }
}

class Token {
    constructor(
        public target: string,
        public tokenID: string
    ) {}
}

class StyleRule {
    part: string;
    styles: Set<string> = new Set();
    tokens: Set<Token> = new Set();
}

class Anatomy {
    name: string;
    conditions: Map<string, Condition> = new Map();
    parts: Set<string> = new Set();
    styleRules: Set<StyleRule> = new Set();
    imported: Set<string> = new Set();
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

        console.log("parseComponent", node.id, node.name, node.type);
        console.log("  componentName", componentName);

        const anatomy: Anatomy = new Anatomy();
        anatomy.name = componentName;

        let componentNode = node;
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

            // Convert properties into anatomy conditions
            // TODO: Validate known properties like "State" and "Disabled". Ignore for now.
            properties.forEach((values, property) => {
                if (property !== "State" && property !== "Disabled") {
                    if (values.length === 2 &&
                        values.filter((value) => value.toLowerCase() === "true" || value.toLowerCase() === "false").length === 2) {
                        // boolean property, add once
                        anatomy.conditions.set(property, new BooleanCondition());
                    } else {
                        // string property, add all
                        anatomy.conditions.set(property, new StringCondition(new Set(values)));
                    }
                }
            });

            componentNode = node.children[0];
            console.log("  found set, using componentNode", componentNode);
        }

        this.walkNode(componentNode, componentName, anatomy);

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

        const conditionsValues = new Array(...conditionsSet).map(property => `\n        ${camelCase(property)}: "",`).join("");
        const partsValues = new Array(...anatomy.parts).map(property => `\n        ${camelCase(property)}: ".${kebabCase(property)}",`).join("");

        const anatomyOut = 
`export const ${anatomy.name}Anatomy: ComponentAnatomy<${anatomy.name}Conditions, ${anatomy.name}Parts> = {
    conditions: {${conditionsValues}
    },
    parts: {${partsValues}
    },
};
`;
        // TODO:
        // interactivity: Interactivity.disabledAttribute,
        // focus: Focus.contextFocused(),

        const output = `${conditionsOut}\n${partsOut}\n${anatomyOut}\n`;
        console.log(output);
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
        const importBase = `import { StyleRules } from "@adaptive-web/adaptive-ui";\n`;
        const refImports = [...anatomy.imported].sort().join(", ");
        const importRef = `import { ${refImports} } from "@adaptive-web/adaptive-ui/reference";\n`;
        const importAnatomy = `import { ${anatomy.name}Anatomy } from "./${kebabCase(anatomy.name)}.template.js";\n`
        const styleRules = new Array(...anatomy.styleRules).map(styleRule => this.#genStyleRuleCode(anatomy.name, styleRule)).join("\n");
        const genStyleRules = `\nexport const styleRules: StyleRules = [\n${styleRules}\n];\n`;

        const output = `${importBase}${importRef}${importAnatomy}${genStyleRules}`;
        console.log(output);
        return output;
    }

    #genStyleRuleCode(componentName: string, styleRule: StyleRule): string {
        let targetOut = "";
        if (styleRule.part) {
            targetOut = `        target: {\n            part: ${componentName}Anatomy.parts.${camelCase(styleRule.part)},\n        },\n`;
        }

        let stylesOut = "";
        if (styleRule.styles.size > 0) {
            stylesOut = `        styles: [\n            ${new Array(...styleRule.styles).join(",\n            ")},\n        ],\n`;
        }

        let propertiesOut = "";
        if (styleRule.tokens.size > 0) {
            // TODO Need to map tokens better
            const tokens = new Array(...styleRule.tokens).map(token => `${token.target}: ${token.tokenID}`);
            propertiesOut = `        properties: {\n            ${tokens.join(",\n            ")},\n        },\n`;
        }

        return `    {\n${targetOut}${stylesOut}${propertiesOut}    },`;
    }

    private cleanNodeName(nodeName: string): string {
        // Remove non-ascii characters
        return nodeName.replace(/[^\x20-\x7F]/g, "").trim();
    }

    private walkNode(node: PluginUINodeData, componentName: string, anatomy: Anatomy): void {
        console.log("checking styles & tokens", node.name, node.type);

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

            node.appliedStyleModules.forEach(style => {
                const styleVariableName = StyleNameMapping[style as keyof typeof StyleNameMapping] || style;
                console.log("  style", style, "->", styleVariableName);
                styleRule.styles.add(styleVariableName);
                anatomy.imported.add(styleVariableName);
            });

            node.appliedDesignTokens.forEach((token, target) => {
                console.log("  token", token.tokenID, target);
                const tokenRef = this.tokenIDMap(token.tokenID);
                styleRule.tokens.add(new Token(target, tokenRef));
                anatomy.imported.add(tokenRef.split(".")[0]);
            });

            if (nodeName !== componentName) {
                styleRule.part = nodeName;
            }

            if (styleRule.styles.size > 0 || styleRule.tokens.size > 0) {
                anatomy.styleRules.add(styleRule);
            }
        }

        node.children.forEach((child) => {
            this.walkNode(child, componentName, anatomy);
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