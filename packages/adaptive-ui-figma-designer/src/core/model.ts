import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { PluginNode } from "./node.js";

/**
 * A key for passing the fill color from the tool to the plugin. Keeping it out of main design tokens to avoid a lot more special handling.
 */
export const TOOL_PARENT_FILL_COLOR = "tool-parent-fill-color";

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
    constructor(public value: string) {
    }
}

function mapReplacer(key: string, value: any) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: [...value],
        };
    } else {
        return value;
    }
}

function mapReviver(key: string, value: any) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

/**
 * An Array that can be serialized to JSON and deserialized with correct typing.
 *
 * @remarks
 * This is mostly for consistency with SerializableMap.
 */
export class SerializableArray<T> extends Array<T> {
    public deserialize(json: string | undefined): void {
        if (this.length > 0) {
            throw "There are already entries in this Array. Expected empty Array.";
        }

        if (json) {
            try {
                const array = JSON.parse(json as string) as Array<T>;
                array.forEach((value) => {
                    this.push(value);
                });
            } catch (e) {
                // console.warn(e);
                // Ignore, empty string
            }
        }
    }

    public serialize(): string {
        const json = JSON.stringify(this);
        return json;
    }
}

/**
 * A Map that can be serialized to JSON and deserialized with correct typing.
 */
export class SerializableMap<K, V> extends Map<K, V> {
    public deserialize(json: string | undefined): void {
        if (this.size > 0) {
            throw "There are already entries in this Map. Expected empty Map.";
        }

        if (json) {
            try {
                const map = JSON.parse(json as string, mapReviver) as Map<K, V>;
                map.forEach((v, k) => {
                    this.set(k, v);
                });
            } catch (e) {
                // console.warn(e);
                // Ignore, empty string
            }
        }
    }

    public serialize(): string {
        const json = JSON.stringify(this, mapReplacer);
        return json;
    }
}

/**
 * Map of design tokens set for a node. The key is the design token ID.
 */
export class DesignTokenValues extends SerializableMap<string, DesignTokenValue> {}

/**
 * Readonly Map of design tokens set for a node. The key is the design token ID.
 */
export type ReadonlyDesignTokenValues = ReadonlyMap<string, DesignTokenValue>;

/**
 * Array of style modules applied to the style of a node.
 */
export class AppliedStyleModules extends SerializableArray<string> {}

/**
 * Readonly Array of style modules applied to the style of a node.
 */
export type ReadonlyAppliedStyleModules = ReadonlyArray<string>;

/**
 * Map of design tokens applied to the style of a node. The key is the target style property.
 */
export class AppliedDesignTokens extends SerializableMap<StyleProperty, AppliedDesignToken> {}

/**
 * Readonly Map of design tokens applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedDesignTokens = ReadonlyMap<StyleProperty, AppliedDesignToken>;

/**
 * Map of values applied to the style of a node. The key is the target style property.
 */
export class AppliedStyleValues extends SerializableMap<StyleProperty, AppliedStyleValue> {}

/**
 * Readonly Map of values applied to the style of a node. The key is the target style property.
 */
export type ReadonlyAppliedStyleValues = ReadonlyMap<StyleProperty, AppliedStyleValue>;

/**
 * Map of additional data exchanged between the design tool and plugin. Not persisted.
 */
export class AdditionalData extends SerializableMap<string, string> {}

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
    includeInherited: boolean
): PluginUINodeData[] => {
    const convertedNodes = nodes.map(
        (node): PluginUINodeData => {
            // TODO Not all children, only nodes with design tokens.
            const children = pluginNodesToUINodes(node.children, false);
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
