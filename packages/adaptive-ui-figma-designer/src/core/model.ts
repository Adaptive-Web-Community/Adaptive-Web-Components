import { PluginNode } from "./node.js";

/**
 * A key for passing the fill color from the tool to the plugin. Keeping it out of main design tokens to avoid a lo more special handling.
 */
export const TOOL_FILL_COLOR_TOKEN = "fillColor";

export enum DesignTokenType {
    designToken = "designToken",
    layerFill = "layerFill",
    backgroundFill = "backgroundFill",
    foregroundFill = "foregroundFill",
    strokeFill = "strokeFill",
    strokeWidth = "strokeWidth",
    cornerRadius = "cornerRadius",
    fontName = "fontName",
    fontSize = "fontSize",
    lineHeight = "lineHeight",
}

/**
 * Optional scoping for a design token value. For instance, apply a token to a particular component or all "rest" states of any component.
 */
export class DesignTokenScope {
    public component?: string;
    public part?: string;
    public state?: string;
    public appearance?: string;
}

/**
 * A design token value applied to a node and optionally scoped.
 */
export class AppliedDesignToken extends DesignTokenScope {
    public value?: string;
}

/**
 * A recipe applied to a node and optionally scoped.
 */
export class AppliedRecipe extends DesignTokenScope {}

/**
 * An attribute + value pair from an evaluated recipe.
 */
export class RecipeEvaluation {
    public type: DesignTokenType;
    public value: string;

    constructor(type: DesignTokenType, value: string) {
        this.type = type;
        this.value = value;
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
 * Map of design tokens applied to a node. The key is the design token ID.
 */
export class AppliedDesignTokens extends SerializableMap<string, AppliedDesignToken> {}

/**
 * Readonly Map of design tokens applied to a node. The key is the design token ID.
 */
export type ReadonlyAppliedDesignTokens = ReadonlyMap<string, AppliedDesignToken>;

/**
 * Map of recipes applied to a node. The key is the recipe ID.
 */
export class AppliedRecipes extends SerializableMap<string, AppliedRecipe> {}

/**
 * Readonly Map of recipes applied to a node. The key is the recipe ID.
 */
export type ReadonlyAppliedRecipes = ReadonlyMap<string, AppliedRecipe>;

/**
 * Map of recipe evaluations applied to a node. The key is the recipe ID.
 */
export class RecipeEvaluations extends SerializableMap<string, Array<RecipeEvaluation>> {}

/**
 * Readonly Map of recipe evaluations applied to a node. The key is the recipe ID.
 */
export type ReadonlyRecipeEvaluations = ReadonlyMap<string, Array<RecipeEvaluation>>;

/**
 * Map of additional data exchanged between the design tool and plugin. Not persisted.
 */
export class AdditionalData extends SerializableMap<string, any> {}

/**
 * Defines the data stored by the plugin on a node instance.
 */
export interface PluginNodeData {
    /**
     * Design token overrides applied directly to the node.
     */
    designTokens: AppliedDesignTokens;

    /**
     * Recipes applied directly to the node.
     */
    recipes: AppliedRecipes;

    /**
     * Attribute and value pairs applied to the node evaluated from local and inherited recipes.
     */
    recipeEvaluations: RecipeEvaluations;
}

/**
 * Represents a Node on the UI side.
 */
export interface PluginUINodeData extends PluginNodeData {
    /**
     * The ID of the node
     */
    id: string;

    /**
     * The node type
     */
    type: string;

    /**
     * The recipe types that the node supports
     */
    supports: Array<DesignTokenType>;

    /**
     * For other transient data exchanged between the design tool and the plugin.
     */
    additionalData: AdditionalData;

    /**
     * The design token values inherited by this node from layer hierarchy.
     */
    inheritedDesignTokens: ReadonlyAppliedDesignTokens;

    /**
     * The design token values inherited by an instance node from the main component.
     */
    componentDesignTokens?: ReadonlyAppliedDesignTokens;

    /**
     * Recipes inherited by an instance node from the main component.
     */
    componentRecipes?: ReadonlyAppliedRecipes;

    /**
     * Children of this node that have design tokens or recipes applied.
     */
    children: PluginUINodeData[];
}

export const pluginNodesToUINodes = (
    nodes: PluginNode[],
    includeInherited: boolean
): PluginUINodeData[] => {
    const convertedNodes = nodes.map(
        (node): PluginUINodeData => {
            // TODO Not all children, only nodes with design tokens or recipes.
            const children = pluginNodesToUINodes(node.children(), false);
            const inheritedDesignTokens = includeInherited
                ? node.inheritedDesignTokens
                : new AppliedDesignTokens();

            return {
                id: node.id,
                type: node.type,
                supports: node.supports(),
                additionalData: node.additionalData,
                inheritedDesignTokens,
                componentDesignTokens: node.componentDesignTokens,
                componentRecipes: node.componentRecipes,
                children,
                designTokens: node.localDesignTokens as AppliedDesignTokens,
                recipes: node.recipes as AppliedRecipes,
                recipeEvaluations: node.recipeEvaluations as RecipeEvaluations,
            };
        }
    );

    return convertedNodes;
}
