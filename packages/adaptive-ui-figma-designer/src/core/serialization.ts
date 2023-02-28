import { AdditionalData, AppliedDesignTokens, AppliedRecipes, PluginUINodeData, RecipeEvaluations } from "../core/model.js";
import type { DesignTokenType } from "../core/model.js";

/**
 * Serializable version of PluginUINodeData that works across Figma's iframe sandbox setup.
 */
export interface SerializableNodeData {
    id: string;
    type: string;
    supports: Array<DesignTokenType>;
    children: SerializableNodeData[];
    inheritedDesignTokens: string;
    componentDesignTokens?: string;
    designTokens: string;
    componentRecipes?: string;
    recipes: string;
    recipeEvaluations: string;
    additionalData: string;
}

/**
 * Serializable version of the Figma selected node state.
 */
export interface SerializableUIState {
    selectedNodes: SerializableNodeData[];
}

/**
 * Converts node data from the UI to serializable format.
 * @param nodes Node data in the UI format.
 * @returns Node data in the serializable format.
 */
export function serializeUINodes(
    nodes: PluginUINodeData[]
): SerializableNodeData[] {
    const serializedNodes = nodes.map(
        (node): SerializableNodeData => {
            return {
                id: node.id,
                type: node.type,
                supports: node.supports,
                children: serializeUINodes(node.children),
                inheritedDesignTokens: (node.inheritedDesignTokens as AppliedDesignTokens).serialize(),
                componentDesignTokens: (node.componentDesignTokens as AppliedDesignTokens)?.serialize(),
                designTokens: node.designTokens.serialize(),
                componentRecipes: (node.componentRecipes as AppliedRecipes)?.serialize(),
                recipes: node.recipes.serialize(),
                recipeEvaluations: node.recipeEvaluations.serialize(),
                additionalData: node.additionalData.serialize(),
            };
        }
    );

    return serializedNodes;
}

/**
 * Converts node data from the serializable to UI format.
 * @param nodes Node data in the serializable format.
 * @returns Node data in the UI format.
 */
export function deserializeUINodes(
    nodes: SerializableNodeData[]
): PluginUINodeData[] {
    const deserializedNodes = nodes.map(
        (node): PluginUINodeData => {
            const inheritedDesignTokens = new AppliedDesignTokens();
            inheritedDesignTokens.deserialize(node.inheritedDesignTokens);
            const componentDesignTokens = new AppliedDesignTokens();
            componentDesignTokens.deserialize(node.componentDesignTokens);
            const designTokens = new AppliedDesignTokens();
            designTokens.deserialize(node.designTokens);
            const recipes = new AppliedRecipes();
            recipes.deserialize(node.recipes);
            const componentRecipes = new AppliedRecipes();
            componentRecipes.deserialize(node.componentRecipes);
            const recipeEvaluations = new RecipeEvaluations();
            recipeEvaluations.deserialize(node.recipeEvaluations);
            const additionalData = new AdditionalData();
            additionalData.deserialize(node.additionalData);

            return {
                id: node.id,
                type: node.type,
                supports: node.supports,
                children: deserializeUINodes(node.children),
                inheritedDesignTokens,
                componentDesignTokens,
                designTokens,
                componentRecipes,
                recipes,
                recipeEvaluations,
                additionalData,
            };
        }
    );

    return deserializedNodes;
}
