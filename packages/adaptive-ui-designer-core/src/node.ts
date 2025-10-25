import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { TokenNameMapping } from "@adaptive-web/adaptive-ui/reference";
import { type Color, formatHex8 } from "culori/fn";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedDesignTokens,
    AppliedStyleModules,
    AppliedStyleValues,
    Config,
    DesignTokenValues,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedStyleModules,
    ReadonlyDesignTokenValues,
} from "./model.js";
import { deserializeMap, serializeMap } from "./serialization.js";

/**
 * Helper for enumerating a type from a const object
 * Example: export type Foo = ValuesOf\<typeof Foo\>
 */
type ValuesOf<T> = T[keyof T];

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

export type StatesState = ValuesOf<typeof StatesState>;

/**
 * The states for an interactive component.
 */
export type State = "Rest" | "Hover" | "Active" | "Focus" | "Disabled";

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
     * Gets the local design tokens for a given node, without inherited values.
     * @param node - The node to get the local design tokens for.
     * @param rawData - The raw data to extract the design tokens from.
     * @returns The local design tokens for the node.
     */
    getLocalDesignTokens(node: PluginNode): Promise<DesignTokenValues>;

    /**
     * Gets the local applied design tokens for a given node, without inherited values.
     * @param node - The node to get the local applied design tokens for.
     * @param rawData - The raw data to extract the applied design tokens from.
     * @returns The local applied design tokens for the node.
     */
    getAppliedDesignTokens(node: PluginNode): Promise<AppliedDesignTokens>;

    /**
     * Gets the local styles for a given node, without inherited values.
     * @param node - The node to get the local styles for.
     * @param rawData - The raw data to extract the styles from.
     * @returns The local styles for the node.
     */
    getAppliedStyleModules(node: PluginNode): Promise<AppliedStyleModules>;
}

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
    /**
     * Accessor for plugin node data storage.
     */
    public static pluginDataAccessor: PluginNodeDataAccessor;

    /**
     * Design tokens inherited by an instance node from the main component.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _componentDesignTokens?: ReadonlyDesignTokenValues;

    /**
     * Applied style modules inherited by an instance node from the main component.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _componentAppliedStyleModules?: ReadonlyAppliedStyleModules;

    /**
     * Applied design tokens inherited by an instance node from the main component.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _componentAppliedDesignTokens?: ReadonlyAppliedDesignTokens;

    /**
     * Design tokens set for this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _localDesignTokens: DesignTokenValues = new DesignTokenValues();

    /**
     * Design tokens applied to the style of this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _appliedDesignTokens: AppliedDesignTokens = new AppliedDesignTokens();

    /**
     * Style modules applied to the style of this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _appliedStyleModules: AppliedStyleModules = new AppliedStyleModules();

    /**
     * Additional data associated with this node.
     *
     * It is the responsibility of the subclass to load this field.
     */
    protected _additionalData: AdditionalData = new AdditionalData();

    /**
     * Gets the design token values set on ancestor nodes.
     */
    public async getInheritedDesignTokens(): Promise<ReadonlyDesignTokenValues> {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyDesignTokenValues;
        }

        let designTokens = new DesignTokenValues();
        const parent = await this.getParent();
        if (parent !== null) {
            designTokens = new DesignTokenValues([
                ...await parent.getInheritedDesignTokens(),
                ...(parent.componentDesignTokens
                    ? parent.componentDesignTokens
                    : []),
                ...parent.localDesignTokens,
            ]);
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.debugInfo, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    /**
     * Gets the applied style modules inherited by an instance node from the main component.
     */
    public get componentAppliedStyleModules(): ReadonlyAppliedStyleModules | undefined {
        const refNode = this.getRefNode();
        const appliedStyleModules = new AppliedStyleModules();
        
        if (refNode && refNode.componentAppliedStyleModules) {
            appliedStyleModules.push(...refNode.componentAppliedStyleModules);
        }
        
        if (this._componentAppliedStyleModules) {
            appliedStyleModules.push(...this._componentAppliedStyleModules);
        }

        return appliedStyleModules;
    }

    /**
     * Gets the applied design tokens inherited by an instance node from the main component.
     */
    public get componentAppliedDesignTokens(): ReadonlyAppliedDesignTokens | undefined {
        const refNode = this.getRefNode();
        const appliedDesignTokens = new AppliedDesignTokens([
            ...(refNode && refNode.componentAppliedDesignTokens
                ? refNode.componentAppliedDesignTokens
                : []),
            ...this._componentAppliedDesignTokens
                ? this._componentAppliedDesignTokens
                : [],
        ]);
        return appliedDesignTokens;
    }

    /**
     * Gets the design tokens inherited by an instance node from the main component.
     */
    public get componentDesignTokens(): ReadonlyDesignTokenValues | undefined {
        const refNode = this.getRefNode();
        const designTokens = new DesignTokenValues([
            ...(refNode && refNode.componentDesignTokens
                ? refNode.componentDesignTokens
                : []),
            ...this._componentDesignTokens
                ? this._componentDesignTokens
                : [],
        ]);
        return designTokens;
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
    public config: Config = new Config();

    /**
     * Gets the design tokens set for this node.
     */
    public get localDesignTokens(): ReadonlyDesignTokenValues {
        return this._localDesignTokens;
    }

    /**
     * Deserializes design tokens set to the node.
     * @param json - The raw plugin data string.
     * @returns The deserialized design tokens set to the node.
     */
    public deserializeLocalDesignTokens(json: string | null): DesignTokenValues {
        if (json !== null) {
            // console.log("    deserializeLocalDesignTokens", this.debugInfo, json);
        }
        const map: DesignTokenValues = deserializeMap(json);

        // A future feature of this tooling is to support renaming tokens. For now, use a list for the reference tokens.
        const retMap = new DesignTokenValues();
        map.forEach((value, tokenName) => {
            const currentTokenName = TokenNameMapping[tokenName as keyof typeof TokenNameMapping] || tokenName;
            retMap.set(currentTokenName, value);
        })

        return retMap;
    }

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens - The complete design tokens override map.
     */
    public async setDesignTokens(tokens: DesignTokenValues) {
        this._localDesignTokens = tokens;
        if (tokens.size) {
            const json = serializeMap(tokens);
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
     * Deserializes the design tokens applied to the style of this node.
     * @param json - The raw plugin data string.
     * @returns The deserialized applied design tokens.
     */
    public deserializeAppliedDesignTokens(json: string | null): AppliedDesignTokens {
        if (json !== null) {
            // console.log("    deserializeAppliedDesignTokens", this.debugInfo, json);
        }
        const map: AppliedDesignTokens = deserializeMap(json);

        // A future feature of this tooling is to support renaming tokens. For now, use a list for the reference tokens.
        const retMap = new AppliedDesignTokens();
        map.forEach((value, key) => {
            const currentTokenName = TokenNameMapping[value.tokenID as keyof typeof TokenNameMapping] || value.tokenID;
            if (currentTokenName !== value.tokenID) {
                value.tokenID = currentTokenName;
            }
            retMap.set(key, value);
        })

        return retMap;
    }

    /**
     * Sets the design tokens applied to the style of this node.
     * @param appliedTokens - The complete design tokens applied to the style.
     */
    public setAppliedDesignTokens(appliedTokens: AppliedDesignTokens) {
        this._appliedDesignTokens = appliedTokens;
        if (appliedTokens.size) {
            const json = serializeMap(appliedTokens);
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
     * Deserializes the style modules applied to the style of this node.
     * @param json - The raw plugin data string.
     * @returns The deserialized applied style modules.
     */
    public deserializeAppliedStyleModules(json: string | null): AppliedStyleModules {
        if (json !== null) {
            // console.log("    deserializeAppliedStyleModules", this.debugInfo, json);
        }
        return JSON.parse(json || "[]");
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
            this._additionalData.set(AdditionalDataKeys.states, this.states);
        }

        const state = await this.getState();
        if (state) {
            this._additionalData.set(AdditionalDataKeys.state, state);
        }

        this._additionalData.set(AdditionalDataKeys.supportsCodeGen, "" + this.supportsCodeGen);
        if (this.codeGenName) {
            this._additionalData.set(AdditionalDataKeys.codeGenName, this.codeGenName);
        }

        const parent = await this.getParent();
        if (parent) {
            const fillColor = await parent.getEffectiveFillColor();
            if (!this._additionalData.has(AdditionalDataKeys.toolParentFillColor) && fillColor) {
                // console.log("PluginNode.get_additionalData - adding:", AdditionalDataKeys.toolParentFillColor, this.debugInfo, formatHex8(parent.effectiveFillColor));
                this._additionalData.set(AdditionalDataKeys.toolParentFillColor, formatHex8(fillColor));
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
