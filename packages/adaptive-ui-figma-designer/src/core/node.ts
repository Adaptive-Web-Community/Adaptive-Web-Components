import { ColorRGBA64 } from "@microsoft/fast-colors";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import {
    AdditionalData,
    AppliedDesignToken,
    AppliedDesignTokens,
    DesignTokenValues,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyDesignTokenValues,
    TOOL_FILL_COLOR_TOKEN,
} from "./model.js";

const DesignTokenCache: Map<string, ReadonlyDesignTokenValues> = new Map();

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
    protected _componentDesignTokens?: DesignTokenValues;
    protected _componentAppliedDesignTokens?: AppliedDesignTokens;
    protected _localDesignTokens: DesignTokenValues = new DesignTokenValues();
    protected _appliedDesignTokens: AppliedDesignTokens = new AppliedDesignTokens();
    protected _additionalData: AdditionalData = new AdditionalData();

    /**
     * Gets the design token values set on ancestor nodes.
     */
    public get inheritedDesignTokens(): ReadonlyDesignTokenValues {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyDesignTokenValues;
        }

        let designTokens = new DesignTokenValues();
        const parent = this.parent();
        if (parent !== null) {
            designTokens = new DesignTokenValues([
                ...parent.inheritedDesignTokens,
                ...(parent.componentDesignTokens
                    ? parent.componentDesignTokens
                    : new DesignTokenValues()),
                ...parent.localDesignTokens,
            ]);
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.id, this.type, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    /**
     * Gets the applied design tokens inherited by an instance node from the main component.
     */
    public get componentAppliedDesignTokens(): ReadonlyAppliedDesignTokens | undefined {
        return this._componentAppliedDesignTokens as ReadonlyAppliedDesignTokens;
    }

    protected loadLocalDesignTokens(): void {
        const json = this.getPluginData("designTokens");
        // console.log("  loadLocalDesignTokens", this.id, this.type, json);
        this._localDesignTokens.deserialize(json);
    }

    /**
     * Gets the design tokens set for this node. The key is the design token ID.
     */
    public get localDesignTokens(): ReadonlyDesignTokenValues {
        return this._localDesignTokens;
    }

    /**
     * Gets the design tokens inherited by an instance node from the main component. The key is the design token ID.
     */
    public get componentDesignTokens(): ReadonlyDesignTokenValues {
        return this._componentDesignTokens as ReadonlyDesignTokenValues;
    }

    public abstract id: string;
    public abstract type: string;
    public abstract canHaveChildren(): boolean;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<StyleProperty>;

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens The complete design tokens override map.
     */
    public setDesignTokens(tokens: DesignTokenValues) {
        this._localDesignTokens = tokens;
        if (tokens.size) {
            const json = tokens.serialize();
            this.setPluginData("designTokens", json);
        } else {
            this.deletePluginData("designTokens");
        }

        this.invalidateDesignTokenCache();
    }

    protected loadAppliedDesignTokens(): void {
        const json = this.getPluginData("appliedDesignTokens");
        this._appliedDesignTokens.deserialize(json);
    }

    /**
     * Gets the design tokens applied to the style of this node. The key is the target style property.
     */
    public get appliedDesignTokens(): ReadonlyAppliedDesignTokens {
        return this._appliedDesignTokens;
    }

    /**
     * Sets the design tokens applied to the style of this node.
     * @param appliedTokens The complete design tokens applied to the style.
     */
    public setAppliedDesignTokens(appliedTokens: AppliedDesignTokens) {
        this._appliedDesignTokens = appliedTokens;
        if (appliedTokens.size) {
            const json = appliedTokens.serialize();
            this.setPluginData("appliedDesignTokens", json);
        } else {
            this.deletePluginData("appliedDesignTokens");
        }
    }

    /**
     * Gets additional data associated with this node.
     */
    public get additionalData(): AdditionalData {
        return this._additionalData;
    }

    /**
     * Updates the style property applied to this node.
     * @param target The style property.
     * @param data The applied token + value.
     */
    public abstract paint(target: StyleProperty, data: AppliedDesignToken): void;

    /**
     * Gets the effective fill color for the node.
     * This color is communicated to color recipes as the fillColor context for a node.
     */
    public abstract getEffectiveFillColor(): ColorRGBA64 | null;

    /**
     * Handle components that have custom dark mode configuration, like logos or illustration.
     */
    public abstract handleManualDarkMode(): boolean;

    /**
     * Setup special handling for fill color. It should either be a design token or a fixed color applied in the design tool.
     * Must be called after design tokens are loaded.
     */
    protected setupFillColor(): void {
        if (this.canHaveChildren()) {
            // console.log("  PluginNode.setupFillColor - checking", this.id, this.type);
            // If the fill color comes from a design token, don't pass it again.
            let foundFill = false;
            this._appliedDesignTokens.forEach((applied, target) => {
                // console.log("    applied design token", target, "value", applied.value);
                if (target === StyleProperty.backgroundFill) {
                    foundFill = true;
                }
            });
            if (!foundFill) {
                const nodeFillColor = this.getEffectiveFillColor();
                // console.log("    fill not found - effective color", nodeFillColor?.toStringHexRGB());
                if (nodeFillColor) {
                    // eslint-disable-next-line max-len
                    // console.log("      PluginNode.setupFillColor - setting", TOOL_FILL_COLOR_TOKEN, this.id, this.type, nodeFillColor.toStringHexRGB());
                    this._additionalData.set(TOOL_FILL_COLOR_TOKEN, nodeFillColor.toStringHexRGB());
                }
            }
        }
    }

    /**
     * Delete entries in the design token cache for this node and any child nodes.
     */
    private invalidateDesignTokenCache(): void {
        function getIds(node: PluginNode): string[] {
            let found = [node.id];

            node.children().forEach((child: PluginNode) => {
                found = found.concat(getIds(child));
            });

            return found;
        }

        getIds(this).forEach((id: string) => DesignTokenCache.delete(id));
    }

    /**
     * Gets custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined;

    /**
     * Sets custom data to the design tool storage.
     * @param key The data storage key.
     * @param value The new serialized value.
     */
    protected abstract setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void;

    /**
     * Deletes custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract deletePluginData<K extends keyof PluginNodeData>(key: K): void;
}
