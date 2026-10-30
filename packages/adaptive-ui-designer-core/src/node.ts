import { resolveTokenName, StyleProperty, TokenNameIndex } from "@adaptive-web/adaptive-ui";
import { type Color, formatHex8 } from "culori/fn";
import { Logger } from "tslog";
import { getLogger, indent } from "./logger.js";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedDesignTokens,
    AppliedStyleModules,
    AppliedStyleValues,
    Config,
    DesignTokenValues,
    isAppliedDesignToken,
    isDesignTokenValue,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedStyleModules,
    ReadonlyDesignTokenValues,
} from "./model.js";
import { deserializeRecord } from "./serialization.js";

/**
 * Layer name for special handling of the focus indicator in design tools.
 */
export const focusIndicatorNodeName = "Focus indicator";
// This is not ideal, but Figma doesn't support `outline` and there's no great way to approximate it.
// The best option is to include the indicator as a _child_ of element it indicates. The problem with
// this is it then picks up the colors and token values of that parent, when instead those values
// should come from the parent's parent.
// We'll re-parent the focus indicator for the purposes of evaluating styling definitions.

const DesignTokenCache: Map<string, ReadonlyDesignTokenValues> = new Map();

export const StatesState = {
    notAvailable: "notAvailable",
    available: "available",
    configured: "configured",
} as const;

export type StatesState = (typeof StatesState)[keyof typeof StatesState];

/**
 * The states for an interactive component.
 */
export type State = "Rest" | "Hover" | "Active" | "Focus" | "Disabled";

// Gets the current name of a token or a treatment stored on a node, which an earlier version may have stored by another name (decision
// 0014). A name that finds nothing is kept, so a node doesn't lose what it has when the library doesn't have the token.
function currentName(name: string): string {
    return resolveTokenName(PluginNode.tokenNames, name)?.name ?? name;
}

/**
 * Interface for accessing plugin node data storage.
 */
export interface PluginNodeDataAccessor {
    /**
     * Gets custom data from the design tool storage.
     * @param key - The data storage key.
     */
    getPluginData<K extends keyof PluginNodeData>(node: PluginNode, key: K): string | null;

    /**
     * Sets custom data to the design tool storage.
     * @param key - The data storage key.
     * @param value - The new serialized value.
     */
    setPluginData<K extends keyof PluginNodeData>(node: PluginNode, key: K, value: string): void;

    /**
     * Deletes custom data from the design tool storage.
     * @param key - The data storage key.
     */
    deletePluginData<K extends keyof PluginNodeData>(node: PluginNode, key: K): void;

    /**
     * Gets the raw data for the local design tokens for a given node, without reference node values.
     * @param node - The node to get the raw data for the local design tokens for.
     * @returns The raw data for the local design tokens for the node.
     */
    getDesignTokensRawData(node: PluginNode): Promise<string | null>;

    /**
     * Gets the raw data for the local applied design tokens for a given node, without reference node values.
     * @param node - The node to get the raw data for the local applied design tokens for.
     * @returns The raw data for the local applied design tokens for the node.
     */
    getAppliedDesignTokensRawData(node: PluginNode): Promise<string | null>;

    /**
     * Gets the raw data for the local applied style modules for a given node, without reference node values.
     * @param node - The node to get the raw data for the local applied style modules for.
     * @returns The raw data for the local applied style modules for the node.
     */
    getAppliedStyleModulesRawData(node: PluginNode): Promise<string | null>;
}

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
    public static logger = getLogger().getSubLogger({ name: "PluginNode", minLevel: 3 });

    /**
     * Accessor for plugin node data storage.
     */
    public static pluginDataAccessor: PluginNodeDataAccessor;

    /**
     * The names of the tokens of the library the designer works with, which find a token or a treatment by a name an earlier version
     * stored, from `tokenNames(library)`.
     */
    public static tokenNames: TokenNameIndex;

    /**
     * Design tokens set for this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _designTokens: DesignTokenValues = {};

    /**
     * Design tokens applied to the style of this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _appliedDesignTokens: AppliedDesignTokens = {};

    /**
     * Style modules applied to the style of this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _appliedStyleModules: AppliedStyleModules = [];

    /**
     * Additional data associated with this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _additionalData: AdditionalData = {};

    /**
     * Convenience logger for the subclass.
     */
    protected _logger: Logger<unknown>;

    /**
     * The level of the node in the hierarchy, used for indentation of logging.
     */
    protected _level: number;

    constructor(level: number = 0) {
        this._logger = PluginNode.logger;
        this._level = level;
    }

    /**
     * Gets the design token values set on ancestor nodes, that is, hierarchical parent nodes, not reference nodes.
     */
    public async getInheritedDesignTokens(): Promise<ReadonlyDesignTokenValues> {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyDesignTokenValues;
        }

        // TODO Revisit this logic to make sure we actually want to include the reference node's design tokens.

        let designTokens: ReadonlyDesignTokenValues = {};
        const parent = await this.getParent();
        const parentRefNode = parent?.getRefNode();
        if (parent !== null) {
            designTokens = {
                ...await parent.getInheritedDesignTokens(),
                ...(parentRefNode)
                    ? await parentRefNode.getInheritedDesignTokens()
                    : {},
                ...parent.designTokens,
            };
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.debugInfo, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    /**
     * Gets the applied style modules from the chain of reference nodes, like the main component for an instance node.
     */
    public get refAppliedStyleModules(): ReadonlyAppliedStyleModules | undefined {
        const refNode = this.getRefNode();
        const appliedStyleModules: AppliedStyleModules = [];
        
        if (refNode) {
            if (refNode.refAppliedStyleModules) {
                appliedStyleModules.push(...refNode.refAppliedStyleModules);
            }
            appliedStyleModules.push(...refNode.appliedStyleModules);
        }

        return appliedStyleModules;
    }

    /**
     * Gets the applied design tokens from the chain of reference nodes, like the main component for an instance node.
     */
    public get refAppliedDesignTokens(): ReadonlyAppliedDesignTokens | undefined {
        const refNode = this.getRefNode();
        return {
            ...refNode?.refAppliedDesignTokens,
            ...refNode?.appliedDesignTokens,
        };
    }

    /**
     * Gets the design tokens from the chain of reference nodes, like the main component for an instance node.
     */
    public get refDesignTokens(): ReadonlyDesignTokenValues | undefined {
        const refNode = this.getRefNode();
        return {
            ...refNode?.refDesignTokens,
            ...refNode?.designTokens,
        };
    }

    /**
     * The ID of this node.
     */
    public abstract readonly id: string;

    /**
     * The type of this node. Design tool dependent.
     */
    public abstract readonly type: string;

    /**
     * The name of this node, useful for debugging.
     */
    public abstract readonly name: string;

    /**
     * The fill color of this node.
     */
    public abstract readonly fillColor: Color | null;

    /**
     * The state of stateful component capabilities for this node.
     */
    public abstract readonly states?: StatesState;

    /**
     * Whether the selected nodes support code gen or not.
     */
    public abstract readonly supportsCodeGen: boolean;

    /**
     * The name of the component for code gen.
     */
    public abstract readonly codeGenName?: string;

    /**
     * The interactive state of the node.
     */
    public abstract getState(): Promise<string | null>;

    /**
     * Gets the reference node for this node, if it is part of an instance or composition.
     */
    public abstract getRefNode(): PluginNode | null;

    /**
     * Gets whether this type of node can have children or not.
     */
    public abstract getCanHaveChildren(): Promise<boolean>;

    /**
     * Gets all child nodes.
     */
    public abstract getChildren(): Promise<PluginNode[]>;

    /**
     * Gets the parent node.
     */
    public abstract getParent(): Promise<PluginNode | null>;

    /**
     * Gets the effective fill color of this node, either locally applied or from an ancestor.
     */
    public abstract getEffectiveFillColor(): Promise<Color | null>;

    /**
     * Gets the style properties this node supports.
     */
    public abstract getSupports(): Promise<Array<StyleProperty>>;

    /**
     * Configuration options for a node.
     */
    public config: Config = {};

    /**
     * Gets the design tokens set for this node.
     */
    public get designTokens(): ReadonlyDesignTokenValues {
        return this._designTokens;
    }

    /**
     * Deserializes design tokens set to the node, by the current name of each token.
     * @param json - The raw plugin data string.
     * @returns The deserialized design tokens set to the node.
     */
    public deserializeDesignTokens(json: string | null): DesignTokenValues {
        const stored = deserializeRecord(json, isDesignTokenValue);
        return Object.fromEntries(Object.entries(stored).map(([name, { value }]) => [currentName(name), { value }]));
    }

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens - The complete design tokens override map.
     */
    public async setDesignTokens(tokens: DesignTokenValues) {
        this._designTokens = tokens;
        if (Object.keys(tokens).length) {
            const json = JSON.stringify(tokens);
            PluginNode.pluginDataAccessor.setPluginData(this, "designTokens", json);
        } else {
            PluginNode.pluginDataAccessor.deletePluginData(this, "designTokens");
        }

        await this.invalidateDesignTokenCache();
    }

    /**
     * Gets the design tokens applied to the style of this node.
     */
    public get appliedDesignTokens(): ReadonlyAppliedDesignTokens {
        return this._appliedDesignTokens;
    }

    /**
     * Deserializes the design tokens applied to the style of this node, by the current name of each token.
     * @param json - The raw plugin data string.
     * @returns The deserialized applied design tokens.
     */
    public deserializeAppliedDesignTokens(json: string | null): AppliedDesignTokens {
        const stored = deserializeRecord(json, isAppliedDesignToken);
        return Object.fromEntries(Object.entries(stored).map(([property, { tokenID }]) => [property, { tokenID: currentName(tokenID) }]));
    }

    /**
     * Sets the design tokens applied to the style of this node.
     * @param appliedTokens - The complete design tokens applied to the style.
     */
    public setAppliedDesignTokens(appliedTokens: AppliedDesignTokens) {
        this._appliedDesignTokens = appliedTokens;
        if (Object.keys(appliedTokens).length) {
            const json = JSON.stringify(appliedTokens);
            PluginNode.pluginDataAccessor.setPluginData(this, "appliedDesignTokens", json);
        } else {
            PluginNode.pluginDataAccessor.deletePluginData(this, "appliedDesignTokens");
        }
    }

    /**
     * Gets the styler modules applied to the style of this node.
     */
    public get appliedStyleModules(): ReadonlyAppliedStyleModules {
        return this._appliedStyleModules;
    }

    /**
     * Deserializes the style modules applied to the style of this node, by the current name of each treatment.
     * @param json - The raw plugin data string.
     * @returns The deserialized applied style modules.
     */
    public deserializeAppliedStyleModules(json: string | null): AppliedStyleModules {
        const names: string[] = JSON.parse(json || "[]");
        return names.map(currentName);
    }

    /**
     * Sets the style modules applied to the style of this node.
     * @param appliedModules - The complete style modules applied to the style.
     */
    public setAppliedStyleModules(appliedModules: AppliedStyleModules) {
        this._appliedStyleModules = appliedModules;
        if (appliedModules.length) {
            const json = JSON.stringify(appliedModules);
            PluginNode.pluginDataAccessor.setPluginData(this, "appliedStyleModules", json);
        } else {
            PluginNode.pluginDataAccessor.deletePluginData(this, "appliedStyleModules");
        }
    }

    /**
     * Gets additional data associated with this node.
     */
    public async getAdditionalData(): Promise<AdditionalData> {
        if (this.states) {
            this._additionalData[AdditionalDataKeys.states] = this.states;
        }

        const state = await this.getState();
        if (state) {
            this._additionalData[AdditionalDataKeys.state] = state;
        }

        this._additionalData[AdditionalDataKeys.supportsCodeGen] = "" + this.supportsCodeGen;
        if (this.codeGenName) {
            this._additionalData[AdditionalDataKeys.codeGenName] = this.codeGenName;
        }

        const parent = await this.getParent();
        if (parent) {
            const fillColor = await parent.getEffectiveFillColor();
            if (!(AdditionalDataKeys.toolParentFillColor in this._additionalData) && fillColor) {
                this._logger.debug(indent(this._level) + "    PluginNode.getAdditionalData - adding:", AdditionalDataKeys.toolParentFillColor, this.debugInfo, formatHex8(fillColor));
                this._additionalData[AdditionalDataKeys.toolParentFillColor] = formatHex8(fillColor);
            }
        }

        return this._additionalData;
    }

    /**
     * Updates the style property applied to this node.
     * @param values - All applied style value.
     */
    public abstract paint(values: AppliedStyleValues): Promise<void>;

    /**
     * Handle components that have custom dark mode configuration, like logos or illustration.
     */
    public abstract handleManualDarkMode(): Promise<boolean>;

    /**
     * Delete entries in the design token cache for this node and any child nodes.
     */
    private async invalidateDesignTokenCache(): Promise<void> {
        async function getIds(node: PluginNode): Promise<string[]> {
            let found = [node.id];

            for (const child of await node.getChildren()) {
                found = found.concat(await getIds(child));
            }

            return found;
        }

        for (const id of await getIds(this)) {
            DesignTokenCache.delete(id)
        }
    }

    /**
     * Gets debug information for this node.
     */
    public get debugInfo() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
        };
    }
}
