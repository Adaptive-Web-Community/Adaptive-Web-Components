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
 * A design token value.
 */
export class DesignTokenValue {
    constructor(public value: string) {
    }
}

/**
 * A token + value pair from an applied design token.
 */
export class AppliedDesignToken {
    constructor(public tokenID: string, public value: string) {
    }
}

/**
 * A value applied to a style property, possibly from a token evaluation or fixed value.
 */
export class AppliedStyleValue {
    constructor(public value: any) {
    }
}

/**
 * Map of design tokens set for a node. The key is the design token ID.
 */
export class DesignTokenValues extends Map<string, DesignTokenValue> {}

/**
 * Readonly Map of design tokens set for a node. The key is the design token ID.
 */
export type ReadonlyDesignTokenValues = ReadonlyMap<string, DesignTokenValue>;

/**
 * Array of style modules applied to the style of a node.
 */
export class AppliedStyleModules extends Array<string> {}

/**
 * Readonly Array of style modules applied to the style of a node.
 */
export type ReadonlyAppliedStyleModules = ReadonlyArray<string>;

/**
 * Map of design tokens applied to the style of a node. The key is the target style property.
 */
export class AppliedDesignTokens extends Map<StyleProperty, AppliedDesignToken> {}

/**
 * Readonly Map of design tokens applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedDesignTokens = ReadonlyMap<StyleProperty, AppliedDesignToken>;

/**
 * Map of values applied to the style of a node. The key is the target style property.
 */
export class AppliedStyleValues extends Map<StyleProperty, AppliedStyleValue> {}

/**
 * Readonly Map of values applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedStyleValues = ReadonlyMap<StyleProperty, AppliedStyleValue>;

/**
 * Map of additional data exchanged between the design tool and plugin. Not persisted.
 */
export class AdditionalData extends Map<string, string> {}

/**
 * Defines the data stored by the plugin on a node instance.
 */
export interface PluginNodeData {
    /**
     * Design token values set directly to the node.
     */
    designTokens: DesignTokenValues;

    /**
     * Style modules applied to the node.
     */
    appliedStyleModules: AppliedStyleModules;

    /**
     * Token + value pairs applied to the style of a node, evaluated from local and inherited design tokens.
     */
    appliedDesignTokens: AppliedDesignTokens;
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
     * The design token values inherited by an instance node from the main component.
     */
    componentDesignTokens?: ReadonlyDesignTokenValues;

    /**
     * Applied style modules inherited by an instance node from the main component.
     */
    componentAppliedStyleModules?: ReadonlyAppliedStyleModules;

    /**
     * Applied design tokens inherited by an instance node from the main component.
     */
    componentAppliedDesignTokens?: ReadonlyAppliedDesignTokens;

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

export const pluginNodesToUINodes = (
    nodes: PluginNode[],
    includeInherited: boolean,
    includeChildren: boolean,
): PluginUINodeData[] => {
    const convertedNodes = nodes.map(
        (node): PluginUINodeData => {
            // TODO Not all children, only nodes with design tokens.
            const children = includeChildren ? pluginNodesToUINodes(node.children, false, true) : [];
            const inheritedDesignTokens = includeInherited
                ? node.inheritedDesignTokens
                : new DesignTokenValues();

            return {
                id: node.id,
                type: node.type,
                name: node.name,
                supports: node.supports,
                additionalData: node.additionalData,
                inheritedDesignTokens,
                componentDesignTokens: node.componentDesignTokens,
                componentAppliedStyleModules: node.componentAppliedStyleModules,
                componentAppliedDesignTokens: node.componentAppliedDesignTokens,
                effectiveAppliedStyleValues: new AppliedStyleValues(),
                children,
                designTokens: node.localDesignTokens as DesignTokenValues,
                appliedStyleModules: node.appliedStyleModules as AppliedStyleModules,
                appliedDesignTokens: node.appliedDesignTokens as AppliedDesignTokens,
            };
        }
    );

    return convertedNodes;
}
