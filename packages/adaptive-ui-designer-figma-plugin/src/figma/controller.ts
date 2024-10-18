import { Controller, PluginUIState } from "@adaptive-web/adaptive-ui-designer-core";
import { mapReplacer } from "@adaptive-web/adaptive-ui-designer-core";
import type { PluginMessage} from "../core/messages.js";
import { FigmaPluginNode } from "./node.js";

export class FigmaController extends Controller {
    public async getNode(id: string): Promise<FigmaPluginNode | null> {
        const node = await figma.getNodeByIdAsync(id);
        if (node) {
            return FigmaPluginNode.get(node, false);
        } else {
            return null;
        }
    }

    public async handleMessage(message: PluginMessage): Promise<void> {
        if (message.type === "NODE_DATA") {
            const pluginNodes = message.nodes;
            await super.receiveStateFromUI({
                selectedNodes: pluginNodes
            });

            FigmaPluginNode.clearCache();
        } else if (message.type === "CREATE_STATES") {
            const node = await this.getNode(message.id);
            // Create the interactive state components
            node?.createStates();
            // Resend the nodes to the plugin UI
            FigmaPluginNode.clearCache();
            await this.setSelectedNodes([message.id]);
        }
    }

    public sendStateToUI(state: PluginUIState): void {
        const message: PluginUIState = {
            selectedNodes: state.selectedNodes,
        };

        // Goes to ../ui/index.ts window.onmessage
        const json = JSON.stringify(message, mapReplacer);
        figma.ui.postMessage(json);
    }
}
