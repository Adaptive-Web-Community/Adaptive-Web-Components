import { observable } from "@microsoft/fast-element";
import { AdditionalDataKeys } from "@adaptive-web/adaptive-ui-designer-core";
import { CodeGen } from "../core/code-gen.js";
import { UIController } from "./ui-controller.js";

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
     * Generates anatomy and styling code for the selected nodes.
     *
     * @returns The generated style code
     */
    public generateForSelectedNodes(): string {
        const selectedNode = this.controller.selectedNodes[0];

        const codeGen = new CodeGen();
        const anatomy = codeGen.parseComponent(selectedNode);
        const genAnatomy = `${codeGen.generateAnatomyCode(anatomy)}\n`;
        const genStyles = `${codeGen.generateStylesCode(anatomy)}\n`;

        const output = `${genAnatomy}${genStyles}`;
        return output;
    }
}
