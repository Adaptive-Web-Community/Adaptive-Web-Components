import { PluginNodeData, PluginNodeDataAccessor } from "@adaptive-web/adaptive-ui-designer-core";
import { FIGMA_SHARED_DATA_NAMESPACE } from "@adaptive-web/adaptive-ui-designer-figma";
import { getLogger } from "@adaptive-web/adaptive-ui-designer-core";
import { FigmaPluginNode } from "./node.js";

const logger = getLogger().getSubLogger({ name: "PluginDataResolver", minLevel: 3 });

/**
 * Represents the plugin data value with the sourceID wrapper.
 *
 * @deprecated
 */
interface FigmaPluginDataWrapper {
    /**
     * The actual plugin data payload.
     */
    data: string | null;

    /**
     * The ID of the node that explicitly set this value.
     */
    sourceID: string;
}

/**
 * A universal return type that clearly indicates the schema type and provides the appropriate data structure.
 */
interface OverrideReadResult {
    // Ran into issues with the NEW_MODEL, so reverting back to LEGACY and moving deduplication logic to the node.
    type: "NEW_MODEL" | "LEGACY";
    // For NEW_MODEL, this is the validated delta map.
    // For LEGACY, this is the full map requiring deduplication.
    data: string | null;
}

/**
 * Utility functions for managing plugin data for Figma nodes.
 */
export class PluginDataResolver implements PluginNodeDataAccessor {
    public getPluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K): string | null {
        let value: string | null = node.getFigmaNode().getSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key as string);
        if (value === "") {
            value = null;
        }
        if (value !== null) {
            logger.debug("    getPluginData", node.debugInfo, key, value, typeof value);
        }
        return value;
    }

    public setPluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K, value: string | null): void {
        logger.debug("    setPluginData", node.debugInfo, key, value);
        // Handle the empty value case like a delete
        const valueToSet = (value == null || value === "") ? "" : value;
        node.getFigmaNode().setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, valueToSet);
    }

    public deletePluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K): void {
        logger.debug("    deletePluginData", node.debugInfo, key);
        node.getFigmaNode().setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, "");
    }

    public async getDesignTokensRawData(node: FigmaPluginNode): Promise<string | null> {
        return this.handleRawData(node, "designTokens");
    }

    public async getAppliedDesignTokensRawData(node: FigmaPluginNode): Promise<string | null> {
        return this.handleRawData(node, "appliedDesignTokens");
    }

    public async getAppliedStyleModulesRawData(node: FigmaPluginNode): Promise<string | null> {
        return this.handleRawData(node, "appliedStyleModules");
    }

    private handleRawData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K): string | null {
        const rawData = this.getPluginData(node, key);

        if (rawData !== null) {
            const result = this.getLayerOverride(rawData, node.id);

            if (result.type === "NEW_MODEL") {
                // Write back the plain raw data.
                logger.debug("      writing back plain raw data", node.debugInfo, result.data);
                this.setPluginData(node, key, result.data);

                // Read back the data from the node.
                return this.getPluginData(node, key);
            }
        }

        return rawData;
    }

    /**
     * Implements schema detection and node ID validation.
     * @returns The OverrideReadResult for the layer's stored data.
     */
    private getLayerOverride(rawData: string | null, nodeID: string): OverrideReadResult {
        if (rawData && rawData !== "") {
            try {
                const data = JSON.parse(rawData);

                // Schema detection and validation

                // Check for the sourceID property, which defines the NEW_MODEL schema
                if (typeof (data as FigmaPluginDataWrapper).sourceID === "string" && (data as FigmaPluginDataWrapper).data) {
                    logger.debug("      found data with sourceID", (data as FigmaPluginDataWrapper).sourceID);

                    // Potential NEW_MODEL data found
                    const wrapper = data as FigmaPluginDataWrapper;

                    // We'll keep the Node ID validation for now to run cleanup in the main library file.
                    // Note this won't work for remote components outside of the local file.

                    // NEW_MODEL node ID validation
                    if (wrapper.sourceID === nodeID) {
                        logger.debug("      sourceID matches nodeID");
                        // Validated local override
                        return { type: "NEW_MODEL", data: wrapper.data };
                    }

                    // NEW_MODEL inherited value (ignore and treat as no local data)
                    logger.debug("      sourceID does not match nodeID, treating as inherited");
                    return { type: "NEW_MODEL", data: null };
                } else {
                    logger.debug("      no sourceID found, treating as legacy data");
                    // LEGACY: No sourceID property means it's the old schema.
                    // The legacy data is the entire parsed object.
                    return { type: "LEGACY", data: rawData };
                }
            } catch (e) {
                logger.warn(`Error inspecting plugin data for node ${nodeID}:`, e);
            }
        }

        return { type: "LEGACY", data: null }; // Treat as no local data
    }
}
