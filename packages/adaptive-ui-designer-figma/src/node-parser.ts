import FigmaRestAPI from "@figma/rest-api-spec";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedDesignTokens,
    AppliedStyleModules,
    AppliedStyleValues,
    DesignTokenValues,
    PluginNodeData,
    PluginUINodeData,
} from "../core/model.js.js";

const SHARED_PLUGIN_DATA_KEY = "adaptive_ui";
function getPluginData<T extends FigmaRestAPI.Node, K extends keyof PluginNodeData>(node: T, key: K): string | null {
    const data = node.sharedPluginData;
    if (data && (data as any)[SHARED_PLUGIN_DATA_KEY]) {
        return (data as any)[SHARED_PLUGIN_DATA_KEY][key];
    }

    return null;
}
function hasChildren<T extends FigmaRestAPI.Node>(node: T): node is FigmaRestAPI.HasChildrenTrait & T {
    return "children" in node;
}

export function parseNode(node: FigmaRestAPI.Node): PluginUINodeData {
    const children = hasChildren(node) ? node.children : [];
    const additionalData: AdditionalData = new AdditionalData(); // Where do I get data for this?

    if (node.type === "COMPONENT_SET") {
        additionalData.set(AdditionalDataKeys.codeGenName, node.name);
    }

    const appliedDesignTokens: AppliedDesignTokens = new AppliedDesignTokens(); // shared plugin data
    const appliedStyleModules: AppliedStyleModules = new AppliedStyleModules(); // Shared plugin data

    appliedDesignTokens.deserialize(getPluginData(node, "appliedDesignTokens") || undefined);
    appliedStyleModules.deserialize(getPluginData(node, "appliedStyleModules") || undefined);

    return {
        id: node.id,
        name: node.name,
        type: node.type,
        supports: [],
        children: children.map(parseNode),
        additionalData,
        appliedDesignTokens,
        appliedStyleModules,
        effectiveAppliedStyleValues: new AppliedStyleValues(),
        designTokens: new DesignTokenValues(), // Intentionally empty
        inheritedDesignTokens: new DesignTokenValues(), // Intentionally empty
    };
}