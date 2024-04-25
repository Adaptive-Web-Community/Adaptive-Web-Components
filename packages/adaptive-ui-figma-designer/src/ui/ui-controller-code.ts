import { observable } from "@microsoft/fast-element";
import { styleNameMapping } from "@adaptive-web/adaptive-ui/reference";
import { camelCase, kebabCase } from "change-case";
import { AdditionalDataKeys, PluginUINodeData } from "../core/model.js";
import { UIController } from "./ui-controller.js";

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

export class CodeController {
    /**
     * Whether the current selection supports code generation or not.
     */
    @observable
    public supportsCodeGen: boolean;

    constructor(
        private readonly controller: UIController,
    ) {
    }

    /**
     * Allow this controller to do any necessary setup when the selected nodes change.
     */
    public selectedNodesChanged() {
        this.supportsCodeGen = this.controller.selectedNodes.length === 1 &&
            this.controller.selectedNodes[0].additionalData.get(AdditionalDataKeys.supportsCodeGen) === "true";
        // console.log("change", this.supportsCodeGen);
    }

    /**
     * Generates styling code for the selected nodes.
     *
     * @returns The generated style code
     */
    public generateStyles(): string {
        const selectedNode = this.controller.selectedNodes[0];
        console.log("selected", selectedNode.id, selectedNode.name);
        const componentName = selectedNode.additionalData.get(AdditionalDataKeys.codeGenName);
        console.log("  componentName", componentName);

        const parts = [];
        this.addParts(selectedNode, parts);
        console.log("  parts", parts);

        const code = this.collectStyles(selectedNode, componentName);

        console.log(code);
        return code;
    }

    private addParts(node: PluginUINodeData, parts: Array<string>): void {
        node.children.forEach((child) => {
            // TODO, not only frames, but what?
            if (child.type === "FRAME" && child.name.endsWith(ignoreLayerName)) {
                parts.push(child.name);
            }
            // if (child.type === "FRAME" || (child.type === "INSTANCE" && child.name.endsWith("template"))) {
                this.addParts(child, parts);
            // }
        })
    }

    private generateParts(componentName: string, parts: Array<string>): string {
        const partsString = parts.map(part => `    ${camelCase(part)}: "${kebabCase(part)}"`).join("\n");
        const code = `export const ${componentName}Parts = {\n${partsString}\n};`;
        return code;
    }

    private collectStyles(node: PluginUINodeData, componentName: string): string {
        const styleRules = [];
        const imported = new Set<string>();
        this.buildStyles(node, componentName, styleRules, imported);

        const importBase = `import { StyleRules } from "@adaptive-web/adaptive-ui";\n`;
        const refImports = [...imported].sort().join(", ");
        const importRef = `import { ${refImports} } from "@adaptive-web/adaptive-ui/reference";\n`;
        const importAnatomy = `import { ${componentName}Anatomy } from "./${kebabCase(componentName)}.template.js";\n`

        return `${importBase}${importRef}${importAnatomy}\nexport const styleRules: StyleRules = [\n${styleRules.join("\n")}\n];\n`;
    }

    private cleanNodeName(nodeName: string): string {
        // Remove non-ascii characters
        return nodeName.replace(/[^\x20-\x7F]/g, "").trim();
    }

    private buildStyles(node: PluginUINodeData, componentName: string, styleModules: Array<string>, imported: Set<string>): void {
        const styles: Array<string> = [];
        const tokens: Array<string> = [];

        console.log("checking styles & tokens", node.name, node.type);

        const nodeName = this.cleanNodeName(node.name);

        if (nodeName === "Focus indicator") {
            // Ignore for now
            return;
        }

        if (!node.name.endsWith(ignoreLayerName)) {
            node.appliedStyleModules.forEach(style => {
                const styleVariableName = styleNameMapping[style] || style;
                console.log("  style", style, "->", styleVariableName);
                styles.push(styleVariableName);
                imported.add(styleVariableName);
            });

            node.appliedDesignTokens.forEach((token, target) => {
                console.log("  token", token.tokenID, target);
                const tokenRef = this.tokenIDMap(token.tokenID);
                tokens.push(`${target}: ${tokenRef}`); // TODO Need to map tokens better
                imported.add(tokenRef.split(".")[0]);
            });

            let targetOut = "";
            if (nodeName !== componentName) {
                targetOut = `        target: {\n            part: ${componentName}Anatomy.parts.${camelCase(nodeName)},\n        },\n`;
            }

            let stylesOut = "";
            if (styles.length > 0) {
                stylesOut = `        styles: [\n            ${styles.join(",\n            ")},\n        ],\n`;
            }

            let propertiesOut = "";
            if (tokens.length > 0) {
                propertiesOut = `        properties: {\n            ${tokens.join(",\n            ")},\n        },\n`;
            }

            if (styles.length > 0 || tokens.length > 0) {
                const styleRule = `    {\n${targetOut}${stylesOut}${propertiesOut}    },`;
                styleModules.push(styleRule);
            }
        }

        node.children.forEach((child) => {
            this.buildStyles(child, componentName, styleModules, imported);
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
