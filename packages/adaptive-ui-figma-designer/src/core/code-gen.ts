/* eslint-disable max-len */
import { camelCase, kebabCase } from "change-case";
import { StyleNameMapping } from "@adaptive-web/adaptive-ui/reference";
import { Anatomy, BooleanCondition, Condition, StringCondition, StyleRule } from "@adaptive-web/adaptive-ui-designer-figma";

function makeClassName(value: string) {
    return `.${kebabCase(value)}`;
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
