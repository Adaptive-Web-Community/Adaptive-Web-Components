import { observable } from "@microsoft/fast-element";
import { resolveTokenName } from "@adaptive-web/adaptive-ui";
import type { PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { type CatalogToken, givenTokens } from "./tokens/catalog.js";
import { library, names } from "./tokens/library.js";
import { tokenValueAsString } from "./tokens/preview.js";
import { UIController } from "./ui-controller.js";

/**
 * A token as the UI shows it: the one that a node has a value for, which may not be in the library any more.
 */
export interface UIDesignToken {
    /**
     * The name of the token.
     */
    readonly name: string;

    /**
     * The `$type` of the token, if it is one of the library.
     */
    readonly type?: string;
}

/**
 * A token that a designer is offered to give a value to, with the value it has now.
 */
export interface AvailableDesignToken extends CatalogToken {
    /**
     * The value of the token in the library, as a string for the field that a value is written in.
     */
    readonly defaultValue: string;
}

/**
 * Simple display information for representing design tokens applied to one or more nodes.
 */
export interface UIDesignTokenValue {
    /**
     * The design token.
     */
    token: UIDesignToken;

    /**
     * Represents the design token value if all selected nodes have the same value.
     */
    value: string;

    /**
     * If the selected nodes have multiple different values this will be a list for display.
     */
    multipleValues?: string;
}

// The current name of a name that a node stored, which may be a name the token had.
const currentName = (name: string): string => resolveTokenName(names, name)?.name ?? name;

/**
 * A sub-controller responsible for managing design tokens.
 */
export class DesignTokenController {
    private readonly given = givenTokens(library);

    /**
     * A display representation of design tokens applied to the selected nodes.
     */
    @observable
    public designTokenValues: UIDesignTokenValue[] | null = null;

    /**
     * A list of all design tokens which are not already applied to the selected nodes.
     */
    @observable
    public availableDesignTokens: AvailableDesignToken[] | null = null;

    constructor(
        private readonly controller: UIController,
    ) {
    }

    /**
     * Allow this controller to do any necessary setup when the selected nodes change.
     */
    public selectedNodesChanged() {
        this.setupDesignTokenObservables();
    }

    /**
     * Sets up the observables for all and available (unused) design tokens. 
     */
    private setupDesignTokenObservables() {
        this.designTokenValues = this.getDesignTokenValues();

        // Get all design tokens that can be added, which is the full list except any already applied.
        this.availableDesignTokens = this.given
            .filter((token) => this.designTokenValues?.find((applied) => applied.token.name === token.name) === undefined)
            .map((token) => ({ ...token, defaultValue: this.getDefaultDesignTokenValueAsString(token) }));
    }

    /**
     * Gets a display representation of design tokens applied to the selected nodes.
     *
     * @returns Applied design tokens.
     */
    private getDesignTokenValues(): UIDesignTokenValue[] {
        const tokenValuesMap = this.controller.selectedNodes
            .flatMap(node =>
                Object.entries(node.designTokens).map(([designTokenId, designToken]) => ({
                    designTokenId: currentName(designTokenId),
                    value: designToken.value
                }))
            )
            .filter(item => item.value)
            .reduce((acc, item) => {
                const values = acc.get(item.designTokenId) || new Set<string>();
                values.add(item.value);
                acc.set(item.designTokenId, values);
                return acc;
            }, new Map<string, Set<string>>());

        // This must include all design tokens, not only the ones that are offered.
        return Array.from(tokenValuesMap.entries()).map(([tokenName, valueSet]) => {
            const token = this.given.find(t => t.name === tokenName);
            return {
                token: token || { name: tokenName },
                value: valueSet.size === 1 ? valueSet.values().next().value as string : "",
                multipleValues: valueSet.size > 1 ? [...valueSet].join(", ") : undefined,
            };
        });
    }

    /**
     * Gets the default token value as a string for display.
     *
     * @param token - The design token
     * @returns The default token value as a string for display
     */
    public getDefaultDesignTokenValueAsString(token: UIDesignToken): string {
        return tokenValueAsString(token.name) ?? "";
    }

    private setDesignTokenForNode(node: PluginUINodeData, token: UIDesignToken, value: string | null): void {
        // Remove the value under any name the token had, so a name that was renamed is written again by its current name.
        for (const key of Object.keys(node.designTokens)) {
            if (currentName(key) === token.name) {
                delete node.designTokens[key];
            }
        }
        if (value) {
            node.designTokens[token.name] = { value };
        }
    }

    /**
     * Sets a design token value (override) for the selected nodes.
     *
     * @param token - The design token
     * @param value - The value for this design token for the selected nodes, as it was written
     */
    public setDesignToken(token: UIDesignToken, value: string): void {
        this.controller.selectedNodes.forEach(node => this.setDesignTokenForNode(node, token, value));

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("setDesignToken " + token.name);
    }

    /**
     * Removes a design token value (override) from the selected nodes.
     *
     * @param token - The design token
     */
    public removeDesignToken(token: UIDesignToken): void {
        this.controller.selectedNodes.forEach(node => this.setDesignTokenForNode(node, token, null));

        this.setupDesignTokenObservables();

        this.controller.refreshSelectedNodes("removeDesignToken " + token.name);
    }
}
