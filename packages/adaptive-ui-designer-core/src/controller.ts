import { pluginNodesToUINodes, PluginUINodeData } from "./model.js";
import { PluginNode } from "./node.js";

/**
 * A constant used to remove a previously applied style or token.
 */
export const STYLE_REMOVE = "__REMOVE__";

/**
 * The state object that is passed back and forth between the plugin UI and Controller portions.
 */
export interface PluginUIState {
    selectedNodes: PluginUINodeData[];
}

/**
 * Controller class designed to handle communication between the plugin and the design tool.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the ecosystem it is being run in. (Figma, Sketch, etc).
 */
export abstract class Controller {
    /**
     * Tracks the number of nodes loaded for performance stats.
     */
    public static nodeCount: number = 0;

    /**
     * Gets a Node from the design tool by ID.
     * @param id The ID of the node.
     * @returns The PluginNode or null if no node by the provided ID exists.
     */
    public abstract getNode(id: string): Promise<PluginNode | null>;

    /**
     * Provides the state object to the UI component and updates the UI.
     * @param state The UI state object.
     */
    protected abstract sendStateToUI(state: PluginUIState): void;

    /**
     * Sets the selected node IDs - Setting the IDs will trigger a UI refresh.
     * @param ids The node IDs.
     */
    public async setSelectedNodes(ids: string[]): Promise<void> {
        Controller.nodeCount = 0;

        // console.log("--------------------------------");
        // console.log("Controller.setSelectedNodes begin - selected nodes", ids);

        // const timeStart = new Date().getTime();

        this.sendStateToUI(await this.getPluginUIState(ids));

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.setSelectedNodes end - timing", timeDiff, "node count", Controller.nodeCount);
        // console.log("--------------------------------");
    }

    /**
     * Handle the updated state that's posted from the UI.
     * @param state The state from the UI.
     */
    public async receiveStateFromUI(state: PluginUIState): Promise<void> {
        // console.log("--------------------------------");
        // console.log("Controller.receiveStateFromUI begin", state);

        // const timeStart = new Date().getTime();

        await this.syncPluginNodes(state.selectedNodes);

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.receiveStateFromUI end - timing", timeDiff);
        // console.log("--------------------------------");
    }

    private async getPluginUIState(ids: string[]): Promise<PluginUIState> {
        const nodes = await Promise.all(ids
            .map(async id => await this.getNode(id))
        );

        const selectedNodes = nodes.filter((node): node is PluginNode => node !== null);

        const includeChildren = selectedNodes[0].type !== "PAGE";

        return {
            selectedNodes: await pluginNodesToUINodes(selectedNodes, true, includeChildren),
        };
    }

    private async syncPluginNodes(nodes: PluginUINodeData[]) {
        for (const node of nodes) {
            const pluginNode = await this.getNode(node.id);
            if (pluginNode) {
                await pluginNode.handleManualDarkMode();
                await pluginNode.setDesignTokens(node.designTokens);
                pluginNode.setAppliedStyleModules(node.appliedStyleModules);
                pluginNode.setAppliedDesignTokens(node.appliedDesignTokens);

                // Paint all applied design tokens on the node
                await pluginNode.paint(node.effectiveAppliedStyleValues);

                await this.syncPluginNodes(node.children);
            }
        }
    }
}
