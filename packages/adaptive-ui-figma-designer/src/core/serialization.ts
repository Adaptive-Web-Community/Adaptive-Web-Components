import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { AdditionalData, AppliedDesignTokens, AppliedStyleModules, DesignTokenValues, PluginUINodeData } from "../core/model.js";

/**
 * Serializable version of PluginUINodeData that works across Figma's iframe sandbox setup.
 */
export interface SerializableNodeData {
    id: string;
    type: string;
    name: string;
    supports: Array<StyleProperty>;
    children: SerializableNodeData[];
    inheritedDesignTokens: string;
    componentDesignTokens?: string;
    designTokens: string;
    componentAppliedStyleModules?: string;
    appliedStyleModules: string;
    componentAppliedDesignTokens?: string;
    appliedDesignTokens: string;
    additionalData: string;
    effectiveAppliedStyleValues: string;
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
                name: node.name,
                supports: node.supports,
                children: serializeUINodes(node.children),
                inheritedDesignTokens: (node.inheritedDesignTokens as DesignTokenValues).serialize(),
                componentDesignTokens: (node.componentDesignTokens as DesignTokenValues)?.serialize(),
                designTokens: node.designTokens.serialize(),
                componentAppliedStyleModules: (node.componentAppliedStyleModules as AppliedStyleModules)?.serialize(),
                appliedStyleModules: node.appliedStyleModules.serialize(),
                componentAppliedDesignTokens: (node.componentAppliedDesignTokens as AppliedDesignTokens)?.serialize(),
                appliedDesignTokens: node.appliedDesignTokens.serialize(),
                additionalData: node.additionalData.serialize(),
                effectiveAppliedStyleValues: node.effectiveAppliedStyleValues.serialize(),
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
            const inheritedDesignTokens = new DesignTokenValues();
            inheritedDesignTokens.deserialize(node.inheritedDesignTokens);
            const componentDesignTokens = new DesignTokenValues();
            componentDesignTokens.deserialize(node.componentDesignTokens);
            const designTokens = new DesignTokenValues();
            designTokens.deserialize(node.designTokens);
            const componentAppliedStyleModules = new AppliedStyleModules();
            componentAppliedStyleModules.deserialize(node.componentAppliedStyleModules);
            const appliedStyleModules = new AppliedStyleModules();
            appliedStyleModules.deserialize(node.appliedStyleModules);
            const componentAppliedDesignTokens = new AppliedDesignTokens();
            componentAppliedDesignTokens.deserialize(node.componentAppliedDesignTokens);
            const appliedDesignTokens = new AppliedDesignTokens();
            appliedDesignTokens.deserialize(node.appliedDesignTokens);
            const additionalData = new AdditionalData();
            additionalData.deserialize(node.additionalData);
            const effectiveAppliedStyleValues = new AppliedDesignTokens();
            effectiveAppliedStyleValues.deserialize(node.effectiveAppliedStyleValues);

            return {
                id: node.id,
                type: node.type,
                name: node.name,
                supports: node.supports,
                children: deserializeUINodes(node.children),
                inheritedDesignTokens,
                componentDesignTokens,
                designTokens,
                componentAppliedStyleModules,
                appliedStyleModules,
                componentAppliedDesignTokens,
                appliedDesignTokens,
                additionalData,
                effectiveAppliedStyleValues: effectiveAppliedStyleValues,
            };
        }
    );

    return deserializedNodes;
}
