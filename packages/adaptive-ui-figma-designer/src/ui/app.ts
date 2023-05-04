import { css, customElement, FASTElement, html, observable, repeat, when } from "@microsoft/fast-element";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { DesignTokenDefinition } from "../core/registry/design-token-registry.js";
import { PluginUINodeData } from "../core/model.js";
import { UIController, UIDesignTokenValue } from "./ui-controller.js";
import { DesignTokenAdd, DesignTokensForm, Drawer, TokenGlyph, TokenGlyphType } from "./components/index.js";

TokenGlyph;
Drawer;
DesignTokenAdd;
DesignTokensForm;

const assignedTokensTemplate = (
    tokens: DesignTokenDefinition[] | null,
    title: string | null,
    glyphType: TokenGlyphType = TokenGlyphType.backgroundSwatch
) => html<App>`
    ${when(
        (x) => tokens?.length,
        html<App>`
            ${when(
                (x) => title,
                html`<p class="title inset">${(x) => title}</p>`
            )}
            ${repeat(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (x) => tokens!,
                html<DesignTokenDefinition, App>`
                    <div class="applied-recipe">
                        <designer-token-glyph
                            circular
                            value=${(x, c) => c.parent.controller.getDefaultDesignTokenValue(x.token)}
                            orientation="horizontal"
                            type="${(x) => glyphType}"
                        >
                            ${(x) => x.name}
                        </designer-token-glyph>
                        <span>${(x, c) => c.parent.controller.getDefaultDesignTokenValue(x.token)}</span>
                        <adaptive-button
                            appearance="stealth"
                            aria-label="Detach"
                            @click=${(x, c) => c.parent.controller.removeRecipe(x)}
                        >
                            Detach
                        </adaptive-button>
                    </div>
                `
            )}
        `
    )}
`;

const availableTokensTemplate = (
    tokenType: StyleProperty,
    title: string | null,
    tokenLayout: "stack" | "grid" = "stack",
    glyphType: TokenGlyphType = TokenGlyphType.backgroundSwatch
) => html<App>`
    ${when(
        (x) => x.selectedNodes?.some((node) => node.supports.includes(tokenType)),
        html<App>`
            ${when((x) => title, html` <p class="title inset">${(x) => title}</p> `)}
            <div class="swatch-${tokenLayout}">
                ${repeat(
                    (x) => x.controller.recipeOptionsByType(tokenType),
                    html<DesignTokenDefinition, App>`
                        <designer-token-glyph
                            circular
                            value=${(x, c) => c.parent.controller.getDefaultDesignTokenValue(x.token)}
                            orientation="horizontal"
                            type="${(x) => glyphType}"
                            interactive
                            ?selected=${(x, c) => c.parent.controller.recipeIsAssigned(x.id).length > 0}
                            @click=${(x, c) => c.parent.controller.assignRecipe(x)}
                        >
                            ${(x) => x.name}
                        </designer-token-glyph>
                    `
                )}
            </div>
        `
    )}
`;

const syncLabel = "Evaluate and apply all design tokens and recipes to the current selection.";
const revertLabel = "Remove all plugin data from the current selection.";

const footerTemplate = html<App>`
    <footer>
        <p class="selection-label">
            ${(x) => x.selectedNodes?.map((node) => `${node.type}`).join(" | ") || "No selection"}
        </p>
        <div class="buttons">
            <adaptive-button
                appearance="accent"
                aria-label=${syncLabel}
                style="display: ${(x) => (x.controller.autoRefresh ? "none" : "")};"
                @click=${(x) => x.controller.refreshSelectedNodes()}
            >
                Sync
            </adaptive-button>
            <adaptive-button
                appearance="stealth"
                aria-label=${revertLabel}
                @click=${(x) => x.controller.resetNodes()}
            >
                Reset
            </adaptive-button>
        </div>
    </footer>
`;

const template = html<App>`
    <adaptive-tabs activeid="recipes">
        <adaptive-tab id="recipes">Recipes</adaptive-tab>
        <adaptive-tab id="tokens">Design Tokens</adaptive-tab>
        <adaptive-tab-panel id="recipesPanel">
            <div style="overflow-y: overlay;">
                ${when(
                    (x) => x.supportsColor,
                    html<App>`
                        <designer-drawer name="Color">
                            <div slot="collapsed-content">
                                ${(x) => assignedTokensTemplate(x.layerRecipes, "Layer")}
                                ${(x) => assignedTokensTemplate(x.backgroundRecipes, "Background")}
                                ${(x) => assignedTokensTemplate(x.foregroundRecipes, "Foreground")}
                                ${(x) => assignedTokensTemplate(x.strokeRecipes, "Stroke", TokenGlyphType.borderSwatch)}
                            </div>
                            <div>
                                ${(x) => availableTokensTemplate(StyleProperty.backgroundFill, "Fills")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.borderFill,
                                        "Strokes",
                                        "stack",
                                        TokenGlyphType.borderSwatch
                                    )}
                                ${(x) => availableTokensTemplate(StyleProperty.foregroundFill, "Foregrounds")}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsStrokeWidth,
                    html<App>`
                        <designer-drawer name="Stroke width">
                            <div slot="collapsed-content">
                                ${(x) => assignedTokensTemplate(x.strokeWidthRecipes, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.borderThickness,
                                        null,
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsCornerRadius,
                    html<App>`
                        <designer-drawer name="Corner radius">
                            <div slot="collapsed-content">
                                ${(x) => assignedTokensTemplate(x.cornerRadiusRecipes, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.cornerRadius,
                                        null,
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsText,
                    html<App>`
                        <designer-drawer name="Text">
                            <div slot="collapsed-content">
                                ${(x) => assignedTokensTemplate(x.textRecipes, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.fontFamily,
                                        "font name",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.fontSize,
                                        "font size",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StyleProperty.lineHeight,
                                        "Line height",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </designer-drawer>
                    `
                )}
            </div>
        </adaptive-tab-panel>
        <adaptive-tab-panel id="tokensPanel">
            ${when(
                (x) => x.supportsDesignSystem,
                html<App>`
                    <div class="tokens-panel-content">
                        <div>
                            <designer-design-token-add
                                :designTokens=${(x) => x.availableDesignTokens}
                                @add=${(x, c) =>
                                    x.controller.assignDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                            ></designer-design-token-add>
                            <adaptive-divider></adaptive-divider>
                        </div>
                        <div style="overflow-y: overlay;">
                            <designer-design-tokens-form
                                :designTokens=${(x) => x.designTokenValues}
                                @tokenChange=${(x, c) =>
                                    x.controller.assignDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                                @detach=${(x, c) => x.controller.removeDesignToken((c.event as CustomEvent).detail)}
                            ></designer-design-tokens-form>
                        </div>
                    </div>
                `
            )}
            ${when((x) => !x.supportsDesignSystem, html` <div>Selected layers don't support design tokens</div> `)}
        </adaptive-tab-panel>
    </adaptive-tabs>
    ${(x) => footerTemplate}
`;

const styles = css`
    :host {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100%;
    }

    adaptive-tabs::part(tablist) {
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    adaptive-tab-panel {
        height: calc(556px - 40px);
        overflow-y: overlay;
        padding: 0 8px;
    }

    adaptive-tab-panel::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
    }

    adaptive-tab-panel::-webkit-scrollbar-track {
        margin: 1px;
        background-color: transparent;
    }

    adaptive-tab-panel::-webkit-scrollbar-thumb {
        border: 2px solid #fff;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0);
    }

    adaptive-tab-panel:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.13);
    }

    adaptive-tab-panel::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(0, 0, 0, 0.13);
    }

    .swatch-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        justify-items: stretch;
        margin-inline-end: calc(var(--design-unit) * 2px);
    }

    .swatch-grid > * {
        margin-bottom: calc(var(--design-unit) * 3px);
    }

    .swatch-stack {
        display: flex;
        flex-direction: column;
    }

    .swatch-stack > * {
        padding: calc(var(--design-unit) * 2px) 0;
        padding-inline-start: calc(var(--design-unit) * 4px);
        padding-inline-end: calc(var(--design-unit) * 1px);
    }

    .inset {
        padding: 0 calc(var(--design-unit) * 2px);
    }

    .applied-recipe {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        padding-inline-start: calc(var(--design-unit) * 2px);
        margin-bottom: 8px;
    }

    .applied-recipe > span {
        margin: 0 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: right;
    }

    .tokens-panel-content {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }

    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px calc(var(--design-unit) * 2px) 4px calc(var(--design-unit) * 4px);
    }

    footer .selection-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    footer .buttons {
        display: flex;
        gap: 8px;
    }
`;

@customElement({
    name: "designer-app",
    template,
    styles,
})
export class App extends FASTElement {
    @observable
    public readonly controller: UIController;

    @observable
    public supportsColor: boolean = true;

    @observable
    public supportsStrokeWidth: boolean;

    @observable
    public supportsCornerRadius: boolean;

    @observable
    public supportsText: boolean;

    @observable
    public layerRecipes: DesignTokenDefinition[] | null;

    @observable
    public backgroundRecipes: DesignTokenDefinition[] | null;

    @observable
    public foregroundRecipes: DesignTokenDefinition[] | null;

    @observable
    public strokeRecipes: DesignTokenDefinition[] | null;

    @observable
    public strokeWidthRecipes: DesignTokenDefinition[] | null;

    @observable
    public cornerRadiusRecipes: DesignTokenDefinition[] | null;

    @observable
    public textRecipes: DesignTokenDefinition[] | null;

    @observable
    public supportsDesignSystem: boolean;

    @observable
    public designTokenValues: UIDesignTokenValue[] | null;

    @observable
    public availableDesignTokens: DesignTokenDefinition[] | null;

    @observable
    public selectedNodes: PluginUINodeData[] | null;
    protected selectedNodesChanged(prev: PluginUINodeData[] | null, next: PluginUINodeData[] | null) {
        this.controller.setSelectedNodes(next);

        this.supportsColor =
            this.selectedNodes?.some(
                (node) =>
                    node.supports.includes(StyleProperty.backgroundFill) ||
                    node.supports.includes(StyleProperty.foregroundFill) ||
                    node.supports.includes(StyleProperty.borderFill)
            ) || false;
        this.supportsStrokeWidth = this.controller.supports(StyleProperty.borderThickness);
        this.supportsCornerRadius = this.controller.supports(StyleProperty.cornerRadius);
        this.supportsText = this.controller.supports(StyleProperty.fontFamily);

        this.backgroundRecipes = this.controller.appliedRecipes(StyleProperty.backgroundFill);
        this.foregroundRecipes = this.controller.appliedRecipes(StyleProperty.foregroundFill);
        this.strokeRecipes = this.controller.appliedRecipes(StyleProperty.borderFill);
        this.strokeWidthRecipes = this.controller.appliedRecipes(StyleProperty.borderThickness);
        this.cornerRadiusRecipes = this.controller.appliedRecipes(StyleProperty.cornerRadius);
        this.textRecipes = [
            ...this.controller.appliedRecipes(StyleProperty.fontFamily),
            ...this.controller.appliedRecipes(StyleProperty.fontSize),
            ...this.controller.appliedRecipes(StyleProperty.lineHeight),
        ];

        this.supportsDesignSystem = true;

        // Get all applied design tokens except fillColor because it's handled through a recipe or plain color from the design tool.
        this.designTokenValues = this.controller.getDesignTokenValues();
        //.filter(token => token.definition.id !== "fillColor");

        // Get all design tokens that can be added, which is the full list except any already applied /* or fillColor (see above). */
        this.availableDesignTokens = this.controller.getDesignTokenDefinitions().filter(
            (definition) =>
                this.designTokenValues!.find((appliedToken) => appliedToken.definition.id === definition.id) || true
                //&& definition.id !== "fillColor"
        );
    }

    constructor() {
        super();

        this.controller = new UIController((nodes) => this.dispatchState(nodes));
    }

    private dispatchState(selectedNodes: PluginUINodeData[]): void {
        this.$emit("dispatch", selectedNodes);
    }
}
