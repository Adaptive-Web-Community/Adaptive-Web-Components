import { sentenceCase } from "change-case";
import { resolveTokenName, StyleProperty } from "@adaptive-web/adaptive-ui";
import { STYLE_REMOVE } from "@adaptive-web/adaptive-ui-designer-core";
import { entriesOf } from "design-token-library";
import { appliableTokens, type CatalogToken } from "./tokens/catalog.js";
import { library, names } from "./tokens/library.js";
import { tokenValueAsString, treatmentPreviewStyle } from "./tokens/preview.js";
import { UIController } from "./ui-controller.js";
import { designTokenTitle } from "./util.js";

/**
 * A display definition for a single treatment.
 */
export type TreatmentDisplay = {
    name: string;
    title: string;
    /**
     * The style of a swatch that shows the treatment.
     */
    style: string;
}

/**
 * A list of treatments grouped by the panel they are in.
 */
export type TreatmentDisplayList = Map<string, TreatmentDisplay[]>;

/**
 * A display representation of applied design tokens.
 */
export interface AppliedDesignTokenItem {
    targets: Set<StyleProperty>;
    tokenID: string;
    // values: Set<string>; // TODO: consider bringing this back
}

function nameToTitle(name: string): string {
    const base = name.replace(/-/g, ' ').replace(/density_/, '');
    return sentenceCase(base);
}

/**
 * The panel of the UI that a treatment is in, by the first group of its name.
 */
const treatmentPanels: Readonly<Record<string, string>> = {
    treatments: "Styles",
    color: "Color",
    shape: "Shape",
    density: "Density",
    typography: "Text",
    elevation: "Shadow",
};

// The name of the treatment tokens, without the `$root` of a group, in the order of the library.
function treatmentNames(): string[] {
    return Array.from(
        entriesOf(library, { whatToShow: "token", filter: ({ token }) => token.$type === "treatment" && !token.$deprecated }),
        ({ path }) => (path[path.length - 1] === "$root" ? path.slice(0, -1) : path).join(".")
    );
}

/**
 * A sub-controller responsible for managing applied styles.
 *
 * This controller handles both applied treatments as well as individual applied design tokens.
 */
export class StylesController {
    private readonly appliable = appliableTokens(library);
    private readonly treatments = this.treatmentDisplays();

    constructor(
        private readonly controller: UIController,
    ) {
    }

    private treatmentDisplays(): TreatmentDisplayList {
        const displays: TreatmentDisplayList = new Map();
        for (const name of treatmentNames().sort((a, b) => a.localeCompare(b))) {
            const [group, ...remaining] = name.split(".");
            const panel = treatmentPanels[group];
            if (panel === undefined) {
                continue;
            }
            const modules = displays.get(panel) ?? [];
            modules.push({
                name,
                // The group that holds treatments is in every name, so it is left out of the title.
                title: remaining.filter(part => part !== "treatments" && part !== "treatment").map(nameToTitle).join(" / "),
                // Rendered when it is shown
                get style() {
                    return treatmentPreviewStyle(name);
                },
            });
            displays.set(panel, modules);
        }
        return displays;
    }

    /**
     * Get a display representation of all treatments of the library.
     */
    public getAvailableTreatments(): TreatmentDisplayList {
        return this.treatments;
    }

    /**
     * Gets a display representation of applied treatments for the selected nodes.
     *
     * @returns Applied treatments
     */
    public getAppliedTreatments(): TreatmentDisplayList {
        const applied = new Set<string>();

        // TODO: Handle multiple values better
        this.controller.selectedNodes.forEach(node => {
            node.appliedTreatments.forEach(name => applied.add(resolveTokenName(names, name)?.name ?? name));
        });

        const displays: TreatmentDisplayList = new Map();
        for (const [panel, treatments] of this.treatments) {
            const inPanel = treatments.filter(treatment => applied.has(treatment.name));
            if (inPanel.length > 0) {
                displays.set(panel, inPanel);
            }
        }

        UIController.logger.debug("getAppliedTreatments", displays);

        return displays;
    }

    /**
     * Apply a treatment to the selected nodes.
     *
     * @param name - The name of the treatment
     */
    public applyTreatment(name: string) {
        this.controller.selectedNodes.forEach(node => {
            if (!node.appliedTreatments.some(applied => (resolveTokenName(names, applied)?.name ?? applied) === name)) {
                node.appliedTreatments.push(name);
            }
        });

        this.controller.refreshSelectedNodes("applyTreatment");
    }

    /**
     * Remove a treatment from the selected nodes.
     *
     * @param name - The name of the treatment
     */
    public removeTreatment(name: string) {
        this.controller.selectedNodes.forEach(node => {
            const foundIndex = node.appliedTreatments.findIndex(applied => (resolveTokenName(names, applied)?.name ?? applied) === name);
            if (foundIndex > -1) {
                // Rename so we can process the removal
                node.appliedTreatments[foundIndex] = STYLE_REMOVE + name;
            }
        });

        this.controller.refreshSelectedNodes("removeTreatment");
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
        //    Especially interactive groups
        this.controller.selectedNodes.forEach(node => {
            targets.forEach((target) => {
                const applied = node.appliedDesignTokens[target];
                if (applied) {
                    tokens.push({
                        targets: new Set([target]),
                        tokenID: applied.tokenID,
                        // values: new Set([applied.value])
                    });
                }
            });
        });

        // Group by tokenID and value
        return tokens.reduce((accumulated: AppliedDesignTokenItem[], current: AppliedDesignTokenItem): AppliedDesignTokenItem[] => {
            const found = accumulated.find((item) => {
                return item.tokenID === current.tokenID
            });

            if (found) {
                found.targets = new Set([...found.targets, ...current.targets]);
                // found.values = new Set([...found.values, ...current.values]);
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
    public getAppliableDesignTokenOptions(targets: StyleProperty[]): CatalogToken[] {
        // Collect the individual tokens available for the requested targets, once by name
        // TODO: Handle multiple values better
        return this.appliable
            .filter(token => token.appliesTo.some(property => targets.includes(property)))
            .sort((a, b): number => designTokenTitle(a).localeCompare(designTokenTitle(b)));
    }

    /**
     * Gets the design token by ID, which is its name, or a name that it had.
     *
     * @param id - The design token ID
     * @returns The design token
     */
    public getAppliableDesignToken(id: string): CatalogToken | null {
        const resolved = resolveTokenName(names, id);
        if (resolved === undefined) {
            return null;
        }
        // The name of a state of an interactive token is the name of the token, and the state.
        const name = resolved.state === undefined ? resolved.name : resolved.name.slice(0, -(resolved.state.length + 1));
        return this.appliable.find(token => token.name === name) ?? null;
    }

    /**
     * Gets the value of a design token to show it, which is its value at rest.
     *
     * @param token - The design token
     * @returns The value as CSS
     */
    public getDesignTokenValueAsString(token: CatalogToken): string | null {
        return tokenValueAsString(token.name) ?? null;
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
     * @param token - The design token
     */
    public applyDesignToken(targets: StyleProperty[], token: CatalogToken): void {
        this.controller.selectedNodes.forEach(node => {
            // console.log("--------------------------------");
            // console.log("StylesController.applyDesignToken - targets", targets, token);

            targets.forEach(target =>
                node.appliedDesignTokens[target] = { tokenID: token.name }
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
                const applied = node.appliedDesignTokens[target];
                if (applied?.tokenID === tokenID) {
                    // Mark it so we can process the removal
                    node.appliedDesignTokens[target] = { tokenID: STYLE_REMOVE };
                    // console.log("--------------------------------");
                    // console.log("  removed applied design token from node", target, node);
                }
            });
        });

        this.controller.refreshSelectedNodes("removeAppliedDesignToken");
    }
}
