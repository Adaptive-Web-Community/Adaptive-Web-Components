import { Controller, PluginUIState } from "../core/controller.js";
import type { PluginMessage } from "../core/model.js";
import { deserializeUINodes, SerializableUIState, serializeUINodes } from "../core/serialization.js";
import { FigmaPluginNode } from "./node.js";

export class FigmaController extends Controller {
    public getNode(id: string): FigmaPluginNode | null {
        const node = figma.getNodeById(id);
        if (node) {
            return FigmaPluginNode.get(node, false);
        } else {
            return null;
        }
    }

    public handleMessage(message: PluginMessage): void {
        if (message.type === "NODE_DATA") {
            const pluginNodes = deserializeUINodes(message.nodes);
            super.receiveStateFromUI({
                selectedNodes: pluginNodes
            });

            FigmaPluginNode.clearCache();
        } else if (message.type === "CREATE_STATES") {
            const node = this.getNode(message.id);
            // Create the interactive state components
            node?.createStates();
            // Resend the nodes to the plugin UI
            FigmaPluginNode.clearCache();
            this.setSelectedNodes([message.id]);
        }
    }

    public sendStateToUI(state: PluginUIState): void {
        const message: SerializableUIState = {
            selectedNodes: serializeUINodes(state.selectedNodes),
        };

        // Goes to ../ui/index.ts window.onmessage
        figma.ui.postMessage(message);
    }
}
