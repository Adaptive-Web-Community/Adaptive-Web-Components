import { Controller, PluginUIState } from "../core/controller.js";
import { deserializeUINodes, SerializableUIState, serializeUINodes } from "../core/serialization.js";
import { FigmaPluginNode } from "./node.js";

export class FigmaController extends Controller {
    public getNode(id: string): FigmaPluginNode | null {
        const node = figma.getNodeById(id);
        if (node) {
            return new FigmaPluginNode(node);
        } else {
            return null;
        }
    }

    public handleMessage(state: SerializableUIState): void {
        const pluginNodes = deserializeUINodes(state.selectedNodes);
        super.receiveStateFromUI({
            selectedNodes: pluginNodes
        })
    }

    public sendStateToUI(state: PluginUIState): void {
        const message: SerializableUIState = {
            selectedNodes: serializeUINodes(state.selectedNodes),
        };

        figma.ui.postMessage(message);
    }
}
