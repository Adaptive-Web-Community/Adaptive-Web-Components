import { AdditionalDataKeys, type PluginMessage } from "../core/model.js";
import { StatesState } from "../core/node.js";
import { UIController } from "./ui-controller.js";

export class StatesController {
    constructor(
        private readonly controller: UIController,
    ) {
    }

    public getState(): StatesState {
        return this.controller.selectedNodes.length === 1 ?
            this.controller.selectedNodes[0].additionalData.get(AdditionalDataKeys.states) as StatesState :
            StatesState.notAvailable;
    }

    public createStates(): void {
        const nodeID = this.controller.selectedNodes[0].id;

        const message: PluginMessage = {
            type: "CREATE_STATES",
            id: nodeID
        };
        this.controller.dispatchMessage(message, "createStates");
    }
}
