import { pluginNodesToUINodes, PluginUINodeData } from "./model.js";
import { PluginNode } from "./node.js";

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
     * Track the currently selected node.
     */
    private _selectedNodeIds: string[] = [];

    // public static nodeCount: number = 0;

    /**
     * Gets a Node from the design tool by ID.
     * @param id The ID of the node.
     * @returns The PluginNode or null if no node by the provided ID exists.
     */
    public abstract getNode(id: string): PluginNode | null;

    /**
     * Provides the state object to the UI component and updates the UI.
     * @param state The UI state object.
     */
    protected abstract sendStateToUI(state: PluginUIState): void;

    /**
     * Sets the selected node IDs - Setting the IDs will trigger a UI refresh.
     * @param ids The node IDs.
     */
    public setSelectedNodes(ids: string[]): void {
        this._selectedNodeIds = ids;
        // Controller.nodeCount = 0;

        // console.log("--------------------------------");
        // console.log("Controller.setSelectedNodes begin - selected nodes", ids);

        // const timeStart = new Date().getTime();

        this.sendStateToUI(this.getPluginUIState());

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.setSelectedNodes end - timing", timeDiff, "node count", Controller.nodeCount);
        // console.log("--------------------------------");
    }

    /**
     * Handle the updated state that's posted from the UI.
     * @param state The state from the UI.
     */
    public receiveStateFromUI(state: PluginUIState): void {
        // console.log("--------------------------------");
        // console.log("Controller.receiveStateFromUI begin", state);

        // const timeStart = new Date().getTime();

        this.syncPluginNodes(state.selectedNodes);

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.receiveStateFromUI end - timing", timeDiff);
        // console.log("--------------------------------");
    }

    private getPluginUIState(): PluginUIState {
        const selectedNodes = this._selectedNodeIds
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        return {
            selectedNodes: pluginNodesToUINodes(selectedNodes, true),
        };
    }

    private syncPluginNodes(nodes: PluginUINodeData[]) {
        nodes.forEach(node => {
            const pluginNode = this.getNode(node.id);
            if (pluginNode) {
                pluginNode.handleManualDarkMode();
                pluginNode.setDesignTokens(node.designTokens);
                pluginNode.setAppliedStyleModules(node.appliedStyleModules);
                pluginNode.setAppliedDesignTokens(node.appliedDesignTokens);

                // Paint all applied design tokens on the node
                node.effectiveAppliedDesignTokens?.forEach((applied, target) => {
                    // console.log("applied design token eval", target, applied);

                    pluginNode.paint(target, applied);
                });

                this.syncPluginNodes(node.children);
            }
        });
    }
}
