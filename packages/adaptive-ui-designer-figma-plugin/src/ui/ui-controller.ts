import { observable } from "@microsoft/fast-element";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { getLogger, type PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import type { PluginMessage } from "../core/messages.js";
import { evaluateNodes } from "./tokens/evaluator.js";
import { CodeController } from './ui-controller-code.js';
import { StatesController } from './ui-controller-states.js';
import { StylesController } from "./ui-controller-styles.js";
import { DesignTokenController } from "./ui-controller-tokens.js";

const logger = getLogger().getSubLogger({ name: "UIController", minLevel: 2 });

/**
 * The Controller for the UI side of the plugin, which encapsulates the business logic of
 * setting or applying design tokens and evaluating the changes for the selected nodes.
 */
export class UIController {
    public static logger = logger;

    private readonly _messageCallback: (
        message: PluginMessage,
    ) => void | undefined;

    /**
     * A sub-controller responsible for managing design tokens.
     */
    public readonly designTokens: DesignTokenController;

    /**
     * A sub-controller responsible for managing applied styles.
     */
    public readonly styles: StylesController;

    /**
     * A sub-controller responsible for creating stateful components.
     */
    public readonly states: StatesController;

    /**
     * A sub-controller for code generation.
     */
    public readonly code: CodeController;

    private _selectedNodes: PluginUINodeData[] = [];

    /**
     * Whether auto refresh is enabled.
     */
    @observable
    public autoRefreshEnabled: boolean = false;

    /**
     * Whether the designer will auto refresh the selected nodes when the selection changes.
     */
    @observable
    public autoRefresh: boolean = false;

    /**
     * Create a new UI controller.
     *
     * @param messageCallback - Callback function to handle message from UI.
     */
    constructor(messageCallback: (message: PluginMessage) => void) {
        this._messageCallback = messageCallback;

        this.designTokens = new DesignTokenController(this);
        this.styles = new StylesController(this);
        this.states = new StatesController(this);
        this.code = new CodeController(this);
    }

    /**
     * Sets the selected nodes, which sets up the UI and immediately refreshes all design token evaluations.
     *
     * @param nodes - The selected nodes
     */
    public set selectedNodes(nodes: PluginUINodeData[]) {
        logger.debug("--------------------------------");
        logger.debug("UIController.set_selectedNodes", nodes);

        this._selectedNodes = nodes;

        this.autoRefresh = this.autoRefreshEnabled && !(this._selectedNodes.length === 1 && this._selectedNodes[0].type === "PAGE");

        if (this.autoRefresh) {
            this.refreshSelectedNodes("set_selectedNodes");
        }

        this.designTokens.selectedNodesChanged();
        this.code.selectedNodesChanged();
    }

    /**
     * Gets the selected nodes.
     */
    public get selectedNodes(): PluginUINodeData[] {
        return this._selectedNodes;
    }

    /**
     * Reevaluates the styles for the selected nodes.
     *
     * @param reason - A description used for debug logging
     */
    public refreshSelectedNodes(reason: string = "refreshSelectedNodes"): void {
        logger.debug("  Evaluating all design tokens for all selected nodes");

        evaluateNodes(this._selectedNodes);

        const message: PluginMessage = {
            type: 'NODE_DATA',
            nodes: this._selectedNodes,
        };
        this.dispatchMessage(message, reason);
    }

    /**
     * Gets whether the selected nodes support the requested style target type.
     *
     * @param target - The style property target
     * @returns Whether the selected nodes support the requested style target type
     */
    public supports(target: StyleProperty): boolean {
        return this._selectedNodes.some(node => node.supports.includes(target));
    }

    /**
     * Resets all design tokens and styles for the selected nodes.
     */
    public resetNodes(): void {
        this._selectedNodes.forEach(node => {
            logger.debug("--------------------------------");
            logger.debug("UIController.resetNodes", node);

            node.designTokens = {};
            node.appliedTreatments = [];
            node.appliedDesignTokens = {};
        });

        this.refreshSelectedNodes("resetNodes");
    }

    public dispatchMessage(message: PluginMessage, reason: string): void {
        logger.debug("UIController.dispatchMessage", reason);
        this._messageCallback(message);
    }
}
