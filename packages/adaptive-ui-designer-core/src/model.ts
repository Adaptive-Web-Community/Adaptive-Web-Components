import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { PluginNode } from "./node.js";

type ValuesOf<T> = T[keyof T];

// TODO: This structure was used to pass design token values (specifically fill-color) but this isn't used
// anymore and it's not a good way to structure the data it _is_ being used for now. Refactor with `PluginNodeData`.
export const AdditionalDataKeys = {
    /**
     * A key for passing the fill color from the tool to the plugin.
     *
     * @remarks
     * Keeping it out of main design tokens to avoid a lot more special handling.
     */
    toolParentFillColor: "tool-parent-fill-color",

    /**
     * The state of interactive state configuration. Applies to component sets.
     */
    states: "states",

    /**
     * The interactive state of the node. Applies to all nodes.
     */
    state: "state",

    /**
     * Whether the selected nodes support code gen or not.
     */
    supportsCodeGen: "supports-code-gen",

    /**
     * The name of the component for code gen.
     *
     * @remarks
     * The design tool object model (Figma) doesn't provide the component name if only one component in a set is selected.
     */
    codeGenName: "code-gen-name",
} as const;

export type AdditionalDataKeys = ValuesOf<typeof AdditionalDataKeys>;

/**
 * Configuration options for a node.
 */
export interface Config {
    /**
     * Indicator to treat the node as flattened or inline with the containing hierarchy.
     * Usable on Component nodes which exist as a construction convenience and are not
     * actual implemented components.
     */
    inline?: boolean;
}

/**
 * A design token value.
 */
export interface DesignTokenValue {
    value: string;
}

/**
 * Whether a value, as read from plugin data, is a {@link DesignTokenValue}.
 */
export function isDesignTokenValue(value: unknown): value is DesignTokenValue {
    return typeof value === "object" && value !== null && "value" in value && typeof value.value === "string";
}

/**
 * A design token applied to a style property.
 */
export interface AppliedDesignToken {
    tokenID: string;
}

/**
 * Whether a value, as read from plugin data, is an {@link AppliedDesignToken}.
 */
export function isAppliedDesignToken(value: unknown): value is AppliedDesignToken {
    return typeof value === "object" && value !== null && "tokenID" in value && typeof value.tokenID === "string";
}

/**
 * A value applied to a style property, possibly from a token evaluation or fixed value.
 */
export interface AppliedStyleValue {
    value: any;
}

/**
 * Design tokens set for a node. The key is the design token ID.
 */
export type DesignTokenValues = Record<string, DesignTokenValue>;

/**
 * Readonly design tokens set for a node. The key is the design token ID.
 */
export type ReadonlyDesignTokenValues = Readonly<DesignTokenValues>;

/**
 * Style modules applied to the style of a node.
 */
export type AppliedStyleModules = string[]; // TODO This is more accurate as a Set

/**
 * Readonly style modules applied to the style of a node.
 */
export type ReadonlyAppliedStyleModules = readonly string[]; // TODO This is more accurate as a Set

/**
 * Design tokens applied to the style of a node. The key is the target style property.
 */
export type AppliedDesignTokens = Partial<Record<StyleProperty, AppliedDesignToken>>;

/**
 * Readonly design tokens applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedDesignTokens = Readonly<AppliedDesignTokens>;

/**
 * Values applied to the style of a node. The key is the target style property.
 */
export type AppliedStyleValues = Partial<Record<StyleProperty, AppliedStyleValue>>;

/**
 * Readonly values applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedStyleValues = Readonly<AppliedStyleValues>;

/**
 * Additional data exchanged between the design tool and plugin. Not persisted.
 */
export type AdditionalData = Partial<Record<AdditionalDataKeys, string>>;

/**
 * Defines the data stored by the plugin on a node instance.
 */
export interface PluginNodeData {
    /**
     * Configuration options for a node.
     */
    config: Config;

    /**
     * Design token values set directly to the node.
     */
    designTokens: DesignTokenValues;

    /**
     * Token + value pairs applied to the style of a node, evaluated from local and inherited design tokens.
     */
    appliedDesignTokens: AppliedDesignTokens;

    /**
     * Style modules applied to the node.
     */
    appliedStyleModules: AppliedStyleModules;
}

/**
 * Represents a Node on the UI side.
 */
export interface PluginUINodeData extends PluginNodeData {
    /**
     * The ID of the node in the tool.
     */
    id: string;

    /**
     * The node type.
     */
    type: string;

    /**
     * The node given name.
     */
    name: string;

    /**
     * The {@link StyleProperty} the node supports.
     */
    supports: Array<StyleProperty>;

    /**
     * For other transient data exchanged between the design tool and the plugin.
     */
    additionalData: AdditionalData;

    /**
     * The design token values inherited by this node from layer hierarchy.
     */
    inheritedDesignTokens: ReadonlyDesignTokenValues;

    /**
     * The design token values from the chain of reference nodes, like the main component for an instance node.
     */
    refDesignTokens?: ReadonlyDesignTokenValues;

    /**
     * Applied style modules from the chain of reference nodes, like the main component for an instance node.
     */
    refAppliedStyleModules?: ReadonlyAppliedStyleModules;

    /**
     * Applied design tokens from the chain of reference nodes, like the main component for an instance node.
     */
    refAppliedDesignTokens?: ReadonlyAppliedDesignTokens;

    /**
     * The resultant set of effective applied design tokens and values that need to be updated
     * to the node. This will include the sum of applied design tokens inherited from the main
     * component, applied directly to this node, or applied via style modules.
     */
    effectiveAppliedStyleValues: AppliedStyleValues;

    /**
     * Children of this node that have design tokens set or applied.
     */
    children: PluginUINodeData[];
}

export const pluginNodesToUINodes = async (
    nodes: PluginNode[],
    includeInherited: boolean,
    includeChildren: boolean,
): Promise<PluginUINodeData[]> => {
    const convertedNodes = await Promise.all(nodes.map(
        async (node): Promise<PluginUINodeData> => {
            // TODO Not all children, only nodes with design tokens.
            const children = includeChildren ? await pluginNodesToUINodes(await node.getChildren(), false, true) : [];
            const inheritedDesignTokens = includeInherited
                ? await node.getInheritedDesignTokens()
                : {};

            return {
                id: node.id,
                type: node.type,
                name: node.name,
                supports: await node.getSupports(),
                additionalData: await node.getAdditionalData(),
                inheritedDesignTokens,
                refDesignTokens: node.refDesignTokens,
                refAppliedStyleModules: node.refAppliedStyleModules,
                refAppliedDesignTokens: node.refAppliedDesignTokens,
                effectiveAppliedStyleValues: {},
                children,
                config: node.config,
                designTokens: { ...node.designTokens },
                appliedStyleModules: [...node.appliedStyleModules],
                appliedDesignTokens: { ...node.appliedDesignTokens },
            };
        }
    ));

    return convertedNodes;
}
