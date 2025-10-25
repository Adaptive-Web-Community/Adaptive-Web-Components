import { AppliedDesignTokens, AppliedStyleModules, DesignTokenValues, PluginNodeData, PluginNodeDataAccessor, serializeMap } from "@adaptive-web/adaptive-ui-designer-core";
import { FIGMA_SHARED_DATA_NAMESPACE } from "@adaptive-web/adaptive-ui-designer-figma";
import { FigmaPluginNode } from "./node.js";

/**
 * Represents the plugin data value with the sourceID wrapper.
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
    type: "NEW_MODEL" | "LEGACY";
    // For NEW_MODEL, this is the validated delta map.
    // For LEGACY, this is the full map requiring deduplication.
    data: string | null;
}

/*
This data model and token processing is to handle an unfortunate consequence of the Figma component model.

An instance component will inherit plugin data from the main component by default. For instance:

Main component (set plugin data "A=1") --> Instance (get plugin data "A=1")

This is mostly beneficial as when it comes to applying design tokens, we want to apply whatever was defined on main.

However, once you override the value at an instance level, you no longer directly get the value from main:

Instance (set plugin data "A=2") --> Instance (get plugin data "A=2")

In our normal workflow we're reevaluating the applied tokens, so the instance may have the same overall structure
but with different values. This would also normally be fine as we're going to evaluate for current values anyway.

The problem is that once we've updated the values on the instance don't directly get any _changes_ made on the main.

Main component (set plugin data "A=1, B=2") --> Instance (get plugin data "A=2")

Notice we don't have the addition of "B=2". It's a simple string and the value is already set, so it doesn't change.

The solution is to *store* the fully evaluated tokens on the instance node, but to *read* back both the main and instance
values, and to deduplicate them.

In the example above, we'd read "A=2" from the instance, "A=1, B=2" from the main, then assemble the full list, keeping
any overrides from the instance: "A=2, B=2".

Refinement: The main component is not the most authoritative, but rather the reference component in the chain. This is
to handle composed nesting, where another component places an instance of a main, overrides a value, and then an instance
of the second component is being evaluated.

In the case of the "design tokens" the key will be the name of the token, like "corner-radius".
In the case of the "applied design tokens" the key will be the style target, like "backgroundFill".
*/

/**
 * Utility functions for resolving plugin data for Figma nodes.
 */
export class PluginDataResolver implements PluginNodeDataAccessor {
    public getPluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K): string | null {
        let value: string | null = node.getFigmaNode().getSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key as string);
        if (value === "") {
            value = null;
        }
        if (value !== null) {
            // console.log("    getPluginData", node.debugInfo, key, value, typeof value);
        }
        return value;
    }

    public setPluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K, value: string): void {
        // console.log("    setPluginData", node.debugInfo, key, value);
        // Handle the empty value case like a delete
        const valueToSet = (value == null || value === "") ? "" : JSON.stringify({
            sourceID: node.id,
            data: value,
        } as FigmaPluginDataWrapper);
        node.getFigmaNode().setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, valueToSet);
    }

    public deletePluginData<K extends keyof PluginNodeData>(node: FigmaPluginNode, key: K): void {
        // console.log("    deletePluginData", node.debugInfo, key);
        node.getFigmaNode().setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, "");
    }

    /**
     * Gets the local design tokens for a given node, without inherited values.
     * @param node - The node to get the local design tokens for.
     * @param rawData - The raw data to extract the design tokens from.
     * @returns The local design tokens for the node.
     */
    public async getLocalDesignTokens(node: FigmaPluginNode): Promise<DesignTokenValues> {
        const rawData = this.getPluginData(node, "designTokens");
        const result = this.getLayerOverride(rawData, node.id);
        const deserializedDesignTokens = node.deserializeLocalDesignTokens(result.data);

        if (result.type === "LEGACY") {
            const refNode = node.getRefNode();
            if (refNode !== null) {
                // console.log("    found ref node, deduplicating local design tokens");
                refNode.localDesignTokens.forEach((value, tokenId) => {
                    // If the token values are the same between the nodes, remove it from the local.
                    if (deserializedDesignTokens.get(tokenId)?.value === value.value) {
                        // console.log("      removing design token", node.debugInfo, tokenId);
                        deserializedDesignTokens.delete(tokenId);
                    }
                });
            }

            // Write back the cleaned up local data.
            const updatedValue = deserializedDesignTokens.size ? serializeMap(deserializedDesignTokens) : "";
            // console.log("      writing back cleaned local design tokens", node.debugInfo, updatedValue);
            this.setPluginData(node, "designTokens", updatedValue);
        }

        if (deserializedDesignTokens.size) {
            // console.log("    local design tokens", node.debugInfo, serializeMap(deserializedDesignTokens));
        }

        return deserializedDesignTokens;
    }

    /**
     * Gets the local applied design tokens for a given node, without inherited values.
     * @param node - The node to get the local applied design tokens for.
     * @param rawData - The raw data to extract the applied design tokens from.
     * @returns The local applied design tokens for the node.
     */
    public async getAppliedDesignTokens(node: FigmaPluginNode): Promise<AppliedDesignTokens> {
        const rawData = this.getPluginData(node, "appliedDesignTokens");
        const result = this.getLayerOverride(rawData, node.id);
        const deserializedAppliedDesignTokens = node.deserializeAppliedDesignTokens(result.data);

        if (result.type === "LEGACY") {
            // There is a historic data issue problem we're cleaning up here.
            if (node.name === "Focus indicator" && node.id !== "1548:20317") {
                // console.log("      cleaning up errant focus indicator overrides", node.debugInfo);
                this.deletePluginData(node, "appliedDesignTokens");
            } else {
                const refNode = node.getRefNode();
                if (refNode !== null) {
                    // console.log("    found ref node, deduplicating applied design tokens");
                    refNode.appliedDesignTokens.forEach((applied, target) => {
                        // If the target and token are the same between the nodes, remove it from the local.
                        if (deserializedAppliedDesignTokens.get(target)?.tokenID === applied.tokenID) {
                            // console.log("      removing applied design token", node.debugInfo, target, applied.tokenID);
                            deserializedAppliedDesignTokens.delete(target);
                        }
                    });
                }

                deserializedAppliedDesignTokens.forEach((applied) => {
                    // console.log("      removing legacy 'value' property");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    delete (applied as any).value;
                });

                // Write back the cleaned up local data.
                const updatedValue = deserializedAppliedDesignTokens.size ? serializeMap(deserializedAppliedDesignTokens) : "";
                // console.log("      writing back cleaned applied design tokens", node.debugInfo, updatedValue);
                this.setPluginData(node, "appliedDesignTokens", updatedValue);
            }
        }

        if (deserializedAppliedDesignTokens.size) {
            // console.log("    applied design tokens", node.debugInfo, serializeMap(deserializedAppliedDesignTokens));
        }

        return deserializedAppliedDesignTokens;
    }

    /**
     * Gets the local styles for a given node, without inherited values.
     * @param node - The node to get the local styles for.
     * @param rawData - The raw data to extract the styles from.
     * @returns The local styles for the node.
     */
    public async getAppliedStyleModules(node: FigmaPluginNode): Promise<AppliedStyleModules> {
        const rawData = this.getPluginData(node, "appliedStyleModules");
        const result = this.getLayerOverride(rawData, node.id);
        const deserializedAppliedStyleModules = node.deserializeAppliedStyleModules(result.data);
        let filteredAppliedStyleModules = deserializedAppliedStyleModules

        if (result.type === "LEGACY") {
            const refNode = node.getRefNode();
            if (refNode !== null) {
                // console.log("    found ref node, deduplicating applied style modules");
                filteredAppliedStyleModules = deserializedAppliedStyleModules
                    .filter((parsedName) => refNode.appliedStyleModules.indexOf(parsedName) === -1);
            }

            // Remove duplicates while preserving order (legacy data bug, should not happen)
            filteredAppliedStyleModules.reverse();
            filteredAppliedStyleModules = [...new Set(filteredAppliedStyleModules)];
            filteredAppliedStyleModules.reverse();

            // Write back the cleaned up local data.
            const updatedValue = filteredAppliedStyleModules.length ? JSON.stringify(filteredAppliedStyleModules) : "";
            // console.log("      writing back cleaned applied style modules", node.debugInfo, updatedValue);
            this.setPluginData(node, "appliedStyleModules", updatedValue);
        }

        if (filteredAppliedStyleModules.length > 0) {
            // console.log("    applied style modules", node.debugInfo, filteredAppliedStyleModules.join(","));
        }

        return filteredAppliedStyleModules;
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
                    // console.log("      found data with sourceID", (data as FigmaPluginDataWrapper).sourceID);

                    // Potential NEW_MODEL data found
                    const wrapper = data as FigmaPluginDataWrapper;

                    // NEW_MODEL node ID validation
                    if (wrapper.sourceID === nodeID) {
                        // console.log("      sourceID matches nodeID");
                        // Validated local override
                        return { type: "NEW_MODEL", data: wrapper.data };
                    }

                    // NEW_MODEL inherited value (ignore and treat as no local data)
                    // console.log("      sourceID does not match nodeID, treating as inherited");
                    return { type: "NEW_MODEL", data: null };
                } else {
                    // console.log("      no sourceID found, treating as legacy data");
                    // LEGACY: No sourceID property means it's the old schema.
                    // The legacy data is the entire parsed object.
                    return { type: "LEGACY", data: rawData };
                }
            } catch (e) {
                console.warn(`Error inspecting plugin data for node ${nodeID}:`, e);
            }
        }

        return { type: "NEW_MODEL", data: null }; // Treat as no local data
    }
}
