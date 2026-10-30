import FigmaRestAPI from "@figma/rest-api-spec";
import {
    AdditionalData,
    AdditionalDataKeys,
    AppliedTreatments,
    Config,
    deserializeRecord,
    formerPluginDataKeys,
    isAppliedDesignToken,
    PluginDataKey,
    PluginUINodeData,
} from "@adaptive-web/adaptive-ui-designer-core";
import { FIGMA_SHARED_DATA_NAMESPACE } from "./constants.js";

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

// The REST API gives the shared plugin data of a node as `{ [namespace]: { [key]: string } }`, which its types leave `unknown`.
function getPluginData(node: FigmaRestAPI.Node, key: PluginDataKey): string | null {
    const data = node.sharedPluginData;
    const namespace = isObject(data) ? data[FIGMA_SHARED_DATA_NAMESPACE] : undefined;
    const value = isObject(namespace) ? namespace[key] : undefined;
    return typeof value === "string" ? value : null;
}

function hasChildren<T extends FigmaRestAPI.Node>(node: T): node is FigmaRestAPI.HasChildrenTrait & T {
    return "children" in node;
}

// The treatments of a node, from the key that earlier versions stored them under when the node doesn't have the current one.
function getAppliedTreatments(node: FigmaRestAPI.Node): AppliedTreatments {
    const json = getPluginData(node, "appliedTreatments") ?? getPluginData(node, formerPluginDataKeys.appliedTreatments);
    if (!json) {
        return [];
    }

    try {
        const names: unknown = JSON.parse(json);
        if (Array.isArray(names) && names.every(name => typeof name === "string")) {
            return names;
        }
        console.warn("Plugin data of the applied treatments isn't a list of names", json);
    } catch (e) {
        console.warn(`Plugin data of the applied treatments can't be read: ${e instanceof Error ? e.message : e}`, json);
    }
    return [];
}

/**
 * Convert a Figma REST API node to a {@link PluginUINodeData}
 * @param node - The Figma REST API node.
 * @returns The corresponding PluginUINodeData.
 */
export function parseNode(node: FigmaRestAPI.Node): PluginUINodeData {
    const children = hasChildren(node) ? node.children : [];
    const additionalData: AdditionalData = {}; // Where do I get data for this?

    if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
        additionalData[AdditionalDataKeys.codeGenName] = node.name;
    }

    const configData = getPluginData(node, "config");
    const config: Config = configData ? JSON.parse(configData) : {};

    return {
        id: node.id,
        name: node.name,
        type: node.type,
        supports: [],
        children: children.map(parseNode),
        config,
        additionalData,
        appliedDesignTokens: deserializeRecord(getPluginData(node, "appliedDesignTokens"), isAppliedDesignToken),
        appliedTreatments: getAppliedTreatments(node),
        effectiveAppliedStyleValues: {},
        designTokens: {}, // Intentionally empty
        inheritedDesignTokens: {}, // Intentionally empty
    };
}
