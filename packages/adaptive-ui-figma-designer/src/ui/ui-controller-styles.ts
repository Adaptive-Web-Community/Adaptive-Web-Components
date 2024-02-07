import { StyleProperty, Styles } from "@adaptive-web/adaptive-ui";
import { nameToTitle } from "../core/registry/recipes.js";
import { DesignTokenDefinition } from "../core/registry/design-token-registry.js";
import { STYLE_REMOVE } from "../core/controller.js";
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
    targets: StyleProperty[];
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
                // Rename so we can process the removal
                node.appliedStyleModules[foundIndex] = STYLE_REMOVE + name;
            }
            // console.log("  node", node);
        });

        this.controller.refreshSelectedNodes("removeStyleModule");
    }

    /**
     * Gets a display representation of applied design tokens for the style property types.
     *
     * @param targets - Style property types
     * @returns Applied design tokens
     */
    public getAppliedDesignTokens(targets: StyleProperty[]): AppliedDesignTokenItem[] {
        const tokens: AppliedDesignTokenItem[] = [];

        // Collect the individual tokens applied for the requested targets
        // TODO: Handle multiple values better
        this.controller.selectedNodes.forEach(node => {
            targets.forEach((target) => {
                const applied = node.appliedDesignTokens.get(target);
                if (applied) {
                    tokens.push({
                        targets: [target],
                        tokenID: applied.tokenID,
                        value: applied.value
                    });
                }
            });
        });

        // Group by tokenID and value
        return tokens.reduce((accumulated: AppliedDesignTokenItem[], current: AppliedDesignTokenItem): AppliedDesignTokenItem[] => {
            const found = accumulated.find((item) => {
                return item.tokenID === current.tokenID && item.value === current.value
            });

            if (found) {
                found.targets.push(...current.targets);
            } else {
                accumulated.push(current);
            }

            return accumulated;
        }, []);
    }

    /**
     * Gets a list of appliable design tokens for the style property types.
     *
     * @param targets - Style property types
     * @returns List of available appliable design tokens
     */
    public getAppliableDesignTokenOptions(targets: StyleProperty[]): DesignTokenDefinition[] {
        const tokens: DesignTokenDefinition[] = [];

        // Collect the individual tokens available for the requested targets
        // TODO: Handle multiple values better
        targets.forEach(target => {
            const appliable = this.controller.appliableDesignTokenRegistry.find(target);
            if (appliable) {
                tokens.push(...appliable);
            }
        });

        // Group by token name
        return tokens.reduce((accumulated: DesignTokenDefinition[], current: DesignTokenDefinition): DesignTokenDefinition[] => {
            const found = accumulated.find((item) => {
                return item.token.name === current.token.name
            });

            if (!found) {
                accumulated.push(current);
            }

            return accumulated;
        }, []).sort((a, b): number => a.title.localeCompare(b.title));
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
     * @param targets - The target style property types
     * @param tokenID - The design token ID
     */
    public removeAppliedDesignToken(targets: StyleProperty[], tokenID: string): void {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.removeAppliedDesignToken - targets", targets, tokenID);

            targets.forEach(target => {
                const applied = node.appliedDesignTokens.get(target);
                if (applied?.tokenID === tokenID) {
                    // Set to null so we can process the removal
                    node.appliedDesignTokens.set(target, null);
                    // console.log("--------------------------------");
                    // console.log("  removed applied design token from node", target, node);
                }
            });
        });

        this.controller.refreshSelectedNodes("removeAppliedDesignToken");
    }
}
