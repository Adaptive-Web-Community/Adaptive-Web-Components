import { StyleProperty, Styles } from "@adaptive-web/adaptive-ui";
import { nameToTitle } from "../core/registry/recipes.js";
import { DesignTokenDefinition } from "../core/registry/design-token-registry.js";
import { AppliedDesignToken } from "../core/model.js";
import { UIController } from "./ui-controller.js";

/**
 * A display definition for a single style module.
 */
export type StyleModuleDisplay = {
    name: string;
    title: string;
    styles: Styles;
}

/**
 * A list of style modules grouped by the single top-level group name.
 */
export type StyleModuleDisplayList = Map<string, StyleModuleDisplay[]>;

/**
 * A display representation of applied design tokens.
 */
export interface AppliedDesignTokenItem {
    target: StyleProperty;
    tokenID: string;
    value: string;
}

/**
 * A sub-controller responsible for managing applied styles.
 *
 * This controller handles both applied style modules as well as individual applied design tokens.
 */
export class StylesController {
    constructor(
        private readonly controller: UIController,
    ) {
    }

    private styleModuleSort(a: [string, Styles], b: [string, Styles]): number {
        return a[0].localeCompare(b[0]);
    }

    private styleModuleReduce(accumulated: StyleModuleDisplayList, current: [string, Styles]) {
        const [topGroup, ...remaining] = current[0].split(".");
        const topGroupFormatted = nameToTitle(topGroup);
        const modules = accumulated.has(topGroupFormatted) ? accumulated.get(topGroupFormatted) : [];
        modules.push({
            name: current[0],
            title: remaining.map((value) => nameToTitle(value)).join(" / "),
            styles: current[1],
        });
        accumulated.set(topGroupFormatted, modules);
        return accumulated;
    }

    /**
     * Get a display representation of all registered style modules.
     */
    public getAvailableStyleModules(): StyleModuleDisplayList {
        return new Array(...Styles.Shared.entries())
            .sort(this.styleModuleSort)
            .reduce<StyleModuleDisplayList>(this.styleModuleReduce, new Map());
    }

    /**
     * Gets a display representation of applied style modules for the selected nodes.
     *
     * @returns Applied style modules
     */
    public getAppliedStyleModules(): StyleModuleDisplayList {
        const allModules: Map<string, Styles> = new Map();

        // TODO: Handle multiple values better
        this.controller.selectedNodes.forEach(node => {
            node.appliedStyleModules.forEach((name) => {
                if (!allModules.has(name)) {
                    allModules.set(name, Styles.Shared.get(name));
                }
            })
        });

        const modules = new Array(...allModules.entries())
            .sort(this.styleModuleSort)
            .reduce<StyleModuleDisplayList>(this.styleModuleReduce, new Map());

        // console.log("getAppliedStyleModules", modules);
        
        return modules;
    }

    /**
     * Apply a style module to the selected nodes.
     *
     * @param name - The name of the style module
     */
    public applyStyleModule(name: string) {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.applyStyleModule - name", name);

            if (!node.appliedStyleModules.includes(name)) {
                node.appliedStyleModules.push(name);
                // console.log("  node", node);
            }
        });

        this.controller.refreshSelectedNodes("applyStyleModule");
    }

    /**
     * Remove a style module from the selected nodes.
     *
     * @param name - The name of the style module
     */
    public removeStyleModule(name: string) {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.removeStyleModule - name", name);

            const foundIndex = node.appliedStyleModules.indexOf(name);
            if (foundIndex > -1) {
                node.appliedStyleModules.splice(foundIndex, 1);
            }
            // console.log("  node", node);
        });

        this.controller.refreshSelectedNodes("removeStyleModule");
    }

    /**
     * Gets a display representation of applied design tokens for the selected nodes.
     *
     * @param target - Style property type
     * @returns Applied design tokens
     */
    public getAppliedDesignTokens(target: StyleProperty): AppliedDesignTokenItem[] {
        const tokens: AppliedDesignTokenItem[] = [];

        // TODO: Handle multiple values better
        this.controller.selectedNodes.forEach(node => {
            const applied = node.appliedDesignTokens.get(target);
            if (applied) {
                tokens.push({
                    target,
                    tokenID: applied.tokenID,
                    value: applied.value
                });
            }
        });

        return tokens;
    }

    /**
     * Gets a list of appliable design tokens for the style property type.
     *
     * @param target - Style property type
     * @returns List of available appliable design tokens
     */
    public getAppliableDesignTokenOptionsByType(target: StyleProperty): DesignTokenDefinition[] {
        const val = this.controller.appliableDesignTokenRegistry.find(target);
        return val;
    }

    /**
     * Gets the full design token definition for a token by ID.
     *
     * @param id - The design token ID
     * @returns The full design token definition
     */
    public getAppliableDesignTokenDefinition(id: string): DesignTokenDefinition | null {
        return this.controller.appliableDesignTokenRegistry.get(id);
    }

    /**
     * Gets the node IDs to which the design tokens is applied.
     *
     * @param id - The design token ID
     */
    public getNodesWithDesignTokenApplied(id: string): string[] {
        return this.controller.selectedNodes
            .filter(node => {
                return Object.keys(node.appliedDesignTokens).includes(id);
            })
            .map(node => node.id);
    }

    /**
     * Applies a design token to the selected nodes.
     *
     * @param targets - The target style property types
     * @param token - The design token definition
     */
    public applyDesignToken(targets: StyleProperty[], token: DesignTokenDefinition): void {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.applyDesignToken - targets", targets, token);

            targets.forEach(target =>
                node.appliedDesignTokens.set(target, new AppliedDesignToken(token.id, null))
            );

            // console.log("  added applied design token to node", node);
        });

        this.controller.refreshSelectedNodes("applyDesignToken");
    }

    /**
     * Removes an applied design token from the selected nodes.
     *
     * @param target - The target style property type
     * @param tokenID - The design token ID
     */
    public removeAppliedDesignToken(target: StyleProperty, tokenID: string): void {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.removeAppliedDesignToken - target", target, tokenID);

            const applied = node.appliedDesignTokens.get(target);
            if (applied?.tokenID === tokenID) {
                node.appliedDesignTokens.delete(target);
                // console.log("--------------------------------");
                // console.log("  removed applied design token from node", target, node);
            }
        });

        this.controller.refreshSelectedNodes("removeAppliedDesignToken");
    }
}
