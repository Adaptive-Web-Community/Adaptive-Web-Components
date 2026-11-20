import { observable } from "@microsoft/fast-element";
import { AdditionalDataKeys } from "@adaptive-web/adaptive-ui-designer-core";
import { anatomyOf } from "@adaptive-web/adaptive-ui-designer-figma";
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
            this.controller.selectedNodes[0].additionalData[AdditionalDataKeys.supportsCodeGen]?.toLowerCase() === "true";
    }

    /**
     * Generates anatomy and styling code for the selected nodes.
     *
     * @returns The generated style code
     */
    public generateForSelectedNodes(): string {
        const selectedNode = this.controller.selectedNodes[0];

        const name = selectedNode.additionalData[AdditionalDataKeys.codeGenName] || "unknown";

        const anatomy = anatomyOf(selectedNode);
        const anatomyJson = JSON.stringify(anatomy, null, 4);
        console.log("Anatomy generated", name);

        return anatomyJson;
    }
}
