import FigmaRestAPI from "@figma/rest-api-spec";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedDesignTokens,
    AppliedStyleModules,
    AppliedStyleValues,
    Config,
    deserializeMap,
    DesignTokenValues,
    PluginNodeData,
    PluginUINodeData,
} from "@adaptive-web/adaptive-ui-designer-core";
import { FIGMA_SHARED_DATA_NAMESPACE } from "./constants.js";

function getPluginData<T extends FigmaRestAPI.Node, K extends keyof PluginNodeData>(node: T, key: K): string | null {
    const data = node.sharedPluginData;
    if (data && (data as any)[FIGMA_SHARED_DATA_NAMESPACE]) {
        return (data as any)[FIGMA_SHARED_DATA_NAMESPACE][key];
    }

    return null;
}

function hasChildren<T extends FigmaRestAPI.Node>(node: T): node is FigmaRestAPI.HasChildrenTrait & T {
    return "children" in node;
}

/**
 * Convert a Figma REST API node to a {@link PluginUINodeData}
 * @param node 
 * @returns 
 */
export function parseNode(node: FigmaRestAPI.Node): PluginUINodeData {
    const children = hasChildren(node) ? node.children : [];
    const additionalData: AdditionalData = new AdditionalData(); // Where do I get data for this?

    if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
        additionalData.set(AdditionalDataKeys.codeGenName, node.name);
    }

    const configData = getPluginData(node, "config");
    const appliedTokensPluginData = getPluginData(node, "appliedDesignTokens");
    const appliedStylesPluginData = getPluginData(node, "appliedStyleModules");
    const config: Config = configData
        ? JSON.parse(configData)
        : new Config();
    const appliedDesignTokens: AppliedDesignTokens = appliedTokensPluginData
        ? deserializeMap(appliedTokensPluginData)
        : new AppliedDesignTokens();
    const appliedStyleModules: AppliedStyleModules = appliedStylesPluginData
        ? JSON.parse(appliedStylesPluginData)
        : new AppliedStyleModules();

    return {
        id: node.id,
        name: node.name,
        type: node.type,
        supports: [],
        children: children.map(parseNode),
        config,
        additionalData,
        appliedDesignTokens,
        appliedStyleModules,
        effectiveAppliedStyleValues: new AppliedStyleValues(),
        designTokens: new DesignTokenValues(), // Intentionally empty
        inheritedDesignTokens: new DesignTokenValues(), // Intentionally empty
    };
}
