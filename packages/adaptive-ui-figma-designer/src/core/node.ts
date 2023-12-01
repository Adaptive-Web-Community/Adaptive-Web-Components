import { ValuesOf } from "@microsoft/fast-foundation";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { type Color, formatHex8 } from "culori/fn";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedDesignTokens,
    AppliedStyleModules,
    AppliedStyleValues,
    DesignTokenValues,
    PluginNodeData,
    ReadonlyAppliedDesignTokens,
    ReadonlyAppliedStyleModules,
    ReadonlyDesignTokenValues,
} from "./model.js";

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

export type State = "Rest" | "Hover" | "Active" | "Focus" | "Disabled";

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
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
    public get inheritedDesignTokens(): ReadonlyDesignTokenValues {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyDesignTokenValues;
        }

        let designTokens = new DesignTokenValues();
        const parent = this.parent;
        if (parent !== null) {
            designTokens = new DesignTokenValues([
                ...parent.inheritedDesignTokens,
                ...(parent.componentDesignTokens
                    ? parent.componentDesignTokens
                    : new DesignTokenValues()),
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
        return this._componentAppliedStyleModules;
    }

    /**
     * Gets the applied design tokens inherited by an instance node from the main component.
     */
    public get componentAppliedDesignTokens(): ReadonlyAppliedDesignTokens | undefined {
        return this._componentAppliedDesignTokens;
    }

    /**
     * Gets the design tokens set for this node.
     */
    public get localDesignTokens(): ReadonlyDesignTokenValues {
        return this._localDesignTokens;
    }

    /**
     * Gets the design tokens inherited by an instance node from the main component.
     */
    public get componentDesignTokens(): ReadonlyDesignTokenValues | undefined {
        return this._componentDesignTokens;
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
    public abstract readonly states: StatesState;

    /**
     * The interactive state of the node.
     */
    public abstract get state(): string | null;

    /**
     * Gets whether this type of node can have children or not.
     */
    public abstract get canHaveChildren(): boolean;

    /**
     * Gets all child nodes.
     */
    public abstract get children(): PluginNode[];

    /**
     * Gets the parent node.
     */
    public abstract get parent(): PluginNode | null;

    /**
     * Gets the style properties this node supports.
     */
    public abstract get supports(): Array<StyleProperty>;

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

    /**
     * Gets the design tokens applied to the style of this node.
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
     * Gets the styler modules applied to the style of this node.
     */
    public get appliedStyleModules(): ReadonlyAppliedStyleModules {
        return this._appliedStyleModules;
    }

    /**
     * Sets the style modules applied to the style of this node.
     * @param appliedModules The complete style modules applied to the style.
     */
    public setAppliedStyleModules(appliedModules: AppliedStyleModules) {
        this._appliedStyleModules = appliedModules;
        if (appliedModules.length) {
            const json = JSON.stringify(appliedModules);
            this.setPluginData("appliedStyleModules", json);
        } else {
            this.deletePluginData("appliedStyleModules");
        }
    }

    /**
     * Gets additional data associated with this node.
     */
    public get additionalData(): AdditionalData {
        this._additionalData.set(AdditionalDataKeys.states, this.states);

        if (this.state) {
            this._additionalData.set(AdditionalDataKeys.state, this.state);
        }

        if (!this._additionalData.has(AdditionalDataKeys.toolParentFillColor) && this.parent?.fillColor) {
            // console.log("PluginNode.get_additionalData - adding:", AdditionalDataKeys.toolParentFillColor, this.debugInfo, formatHex8(this.parent?.fillColor));
            this._additionalData.set(AdditionalDataKeys.toolParentFillColor, formatHex8(this.parent.fillColor));
        }

        return this._additionalData;
    }

    /**
     * Updates the style property applied to this node.
     * @param values All applied style value.
     */
    public abstract paint(values: AppliedStyleValues): void;

    /**
     * Handle components that have custom dark mode configuration, like logos or illustration.
     */
    public abstract handleManualDarkMode(): boolean;

    /**
     * Delete entries in the design token cache for this node and any child nodes.
     */
    private invalidateDesignTokenCache(): void {
        function getIds(node: PluginNode): string[] {
            let found = [node.id];

            node.children.forEach((child: PluginNode) => {
                found = found.concat(getIds(child));
            });

            return found;
        }

        getIds(this).forEach((id: string) => DesignTokenCache.delete(id));
    }

    protected get debugInfo() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
        };
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
