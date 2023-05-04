import { ColorRGBA64 } from "@microsoft/fast-colors";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import {
    AdditionalData,
    DesignTokenValues,
    PluginNodeData,
    ReadonlyDesignTokenValues,
    ReadonlyRecipeEvaluations,
    RecipeEvaluation,
    RecipeEvaluations,
    TOOL_FILL_COLOR_TOKEN,
} from "./model.js";

const DesignTokenCache: Map<string, ReadonlyDesignTokenValues> = new Map();

/**
 * The abstract class the plugin Controller interacts with.
 * Acts as a basic intermediary for node structure and data storage only.
 * Implementation details of this class will need to be created
 * for each design tool.
 */
export abstract class PluginNode {
    protected _componentDesignTokens?: DesignTokenValues;
    protected _componentRecipes?: RecipeEvaluations;
    protected _localDesignTokens: DesignTokenValues = new DesignTokenValues();
    protected _recipeEvaluations: RecipeEvaluations = new RecipeEvaluations();
    protected _additionalData: AdditionalData = new AdditionalData();

    /**
     * Retrieves the design token overrides on ancestor nodes.
     */
    public get inheritedDesignTokens(): ReadonlyDesignTokenValues {
        // Return value from the cache if we have it
        if (DesignTokenCache.has(this.id)) {
            return DesignTokenCache.get(this.id) as ReadonlyDesignTokenValues;
        }

        let designTokens = new DesignTokenValues();
        const parent = this.parent();
        if (parent !== null) {
            designTokens = new DesignTokenValues([
                ...parent.inheritedDesignTokens,
                ...(parent.componentDesignTokens
                    ? parent.componentDesignTokens
                    : new DesignTokenValues()),
                ...parent.localDesignTokens,
            ]);
        }

        // console.log("  PluginNode.inheritedDesignTokens", this.id, this.type, designTokens.entries());

        DesignTokenCache.set(this.id, designTokens);

        return designTokens;
    }

    public get componentRecipes(): ReadonlyRecipeEvaluations | undefined {
        return this._componentRecipes as ReadonlyRecipeEvaluations;
    }

    protected loadLocalDesignTokens(): void {
        const json = this.getPluginData("designTokens");
        // console.log("  loadLocalDesignTokens", this.id, this.type, json);
        this._localDesignTokens.deserialize(json);
    }

    /**
     * Gets a readonly map of design token overrides applied to this node.
     */
    public get localDesignTokens(): ReadonlyDesignTokenValues {
        return this._localDesignTokens;
    }

    public get componentDesignTokens(): ReadonlyDesignTokenValues {
        return this._componentDesignTokens as ReadonlyDesignTokenValues;
    }

    public abstract id: string;
    public abstract type: string;
    public abstract canHaveChildren(): boolean;
    public abstract children(): PluginNode[];
    public abstract parent(): PluginNode | null;
    public abstract supports(): Array<StyleProperty>;

    /**
     * Sets the design tokens to the node and design tool.
     * @param tokens The complete design tokens override map.
     */
    public setDesignTokens(tokens: DesignTokenValues) {
        this._localDesignTokens = tokens;
        if (tokens.size) {
            const json = tokens.serialize();
            this.setPluginData("designTokens", json);
        } else {
            this.deletePluginData("designTokens");
        }

        this.invalidateDesignTokenCache();
    }

    protected loadRecipeEvaluations(): void {
        const json = this.getPluginData("recipeEvaluations");
        this._recipeEvaluations.deserialize(json);
    }

    /**
     * Gets a readonly map of recipe evaluations applied to this node.
     */
    public get recipeEvaluations(): ReadonlyRecipeEvaluations {
        return this._recipeEvaluations;
    }

    public setRecipeEvaluations(evaluations: RecipeEvaluations) {
        this._recipeEvaluations = evaluations;
        if (evaluations.size) {
            const json = evaluations.serialize();
            this.setPluginData("recipeEvaluations", json);
        } else {
            this.deletePluginData("recipeEvaluations");
        }
    }

    public get additionalData(): AdditionalData {
        return this._additionalData;
    }

    public abstract paint(target: StyleProperty, data: RecipeEvaluation): void;

    /**
     * Retrieve the effective fill color for the node.
     * This color is communicated to color recipes as the fillColor context for a node.
     */
    public abstract getEffectiveFillColor(): ColorRGBA64 | null;

    /**
     * Handle components that have custom dark mode configuration, like logos or illustration.
     */
    public abstract handleManualDarkMode(): boolean;

    /**
     * Setup special handling for fill color. It should either be a recipe or a fixed color applied in the design tool.
     * Must be called after design tokens and recipe evaluations are loaded.
     */
    protected setupFillColor(): void {
        if (this.canHaveChildren()) {
            // console.log("  PluginNode.setupFillColor - checking", this.id, this.type);
            // If the fill color comes from a recipe, don't pass it again.
            let foundFill = false;
            this._recipeEvaluations.forEach((evaluation, target) => {
                // console.log("    evaluation", target, "value", evaluation.value);
                if (target === StyleProperty.backgroundFill) {
                    foundFill = true;
                }
            });
            if (!foundFill) {
                const nodeFillColor = this.getEffectiveFillColor();
                // console.log("    fill not found - effective color", nodeFillColor?.toStringHexRGB());
                if (nodeFillColor) {
                    // eslint-disable-next-line max-len
                    // console.log("      PluginNode.setupFillColor - setting", TOOL_FILL_COLOR_TOKEN, this.id, this.type, nodeFillColor.toStringHexRGB());
                    this._additionalData.set(TOOL_FILL_COLOR_TOKEN, nodeFillColor.toStringHexRGB());
                }
            }
        }
    }

    /**
     * Delete entries in the design token cache for this node and any child nodes.
     */
    private invalidateDesignTokenCache(): void {
        function getIds(node: PluginNode): string[] {
            let found = [node.id];

            node.children().forEach((child: PluginNode) => {
                found = found.concat(getIds(child));
            });

            return found;
        }

        getIds(this).forEach((id: string) => DesignTokenCache.delete(id));
    }

    /**
     * Gets custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined;

    /**
     * Sets custom data to the design tool storage.
     * @param key The data storage key.
     * @param value The new serialized value.
     */
    protected abstract setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void;

    /**
     * Deletes custom data from the design tool storage.
     * @param key The data storage key.
     */
    protected abstract deletePluginData<K extends keyof PluginNodeData>(key: K): void;
}
