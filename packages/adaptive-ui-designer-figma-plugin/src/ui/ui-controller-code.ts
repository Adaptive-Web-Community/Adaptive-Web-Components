import { observable } from "@microsoft/fast-element";
import { AdditionalDataKeys } from "@adaptive-web/adaptive-ui-designer-core";
import { Anatomy } from "@adaptive-web/adaptive-ui-designer-figma";
import { CodeGen } from "../core/code-gen.js";
import { UIController } from "./ui-controller.js";

export class CodeController {
    /**
     * Whether the current selection supports code generation or not.
     */
    @observable
    public supportsCodeGen: boolean = false;

    constructor(
        private readonly controller: UIController,
    ) {
    }

    /**
     * Allow this controller to do any necessary setup when the selected nodes change.
     */
    public selectedNodesChanged() {
        this.supportsCodeGen = this.controller.selectedNodes.length === 1 &&
            this.controller.selectedNodes[0].additionalData.get(AdditionalDataKeys.supportsCodeGen).toLowerCase() === "true";
        // console.log("change", this.supportsCodeGen);
    }

    /**
     * Generates anatomy and styling code for the selected nodes.
     *
     * @returns The generated style code
     */
    public generateForSelectedNodes(): string {
        const selectedNode = this.controller.selectedNodes[0];

        const name = selectedNode.additionalData.get(AdditionalDataKeys.codeGenName) || "unknown";

        // const codeGen = new CodeGen();

        const anatomy = Anatomy.fromPluginUINodeData(selectedNode);
        const anatomyJson = JSON.stringify(anatomy, null, 4);
        // const genAnatomy = `${codeGen.generateAnatomyCode(anatomy)}\n`;
        // const genStyles = `${codeGen.generateStylesCode(anatomy)}\n`;

        // const output = `${genAnatomy}${genStyles}`;
        console.log("Anatomy generated", name);
        
        const output = anatomyJson;
        return output;
    }
}
