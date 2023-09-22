import { css, customElement, FASTElement, html, observable, repeat, when } from "@microsoft/fast-element";
import { staticallyCompose } from "@microsoft/fast-foundation";
import {
    StyleProperty,
    stylePropertyBorderFillAll,
    stylePropertyBorderThicknessAll,
    stylePropertyCornerRadiusAll
} from "@adaptive-web/adaptive-ui";
import { PluginUINodeData } from "../core/model.js";
import { DesignTokenDefinition } from "../core/registry/design-token-registry.js";
import SubtractIcon from "./assets/subtract.svg";
import { UIController } from "./ui-controller.js";
import { AppliedDesignTokenItem, StyleModuleDisplay, StyleModuleDisplayList } from "./ui-controller-styles.js";
import { DesignTokenAdd, DesignTokensForm, Drawer, TokenGlyph, TokenGlyphType } from "./components/index.js";

TokenGlyph;
Drawer;
DesignTokenAdd;
DesignTokensForm;

const appliedTokensTemplate = (
    tokens: AppliedDesignTokenItem[] | null,
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
                html<AppliedDesignTokenItem, App>`
                    <div class="applied-design-token">
                        <designer-token-glyph
                            circular
                            value=${(x) => x.value}
                            orientation="horizontal"
                            type=${(x) => glyphType}
                        >
                            ${(x, c) => c.parent.controller.styles.getAppliableDesignTokenDefinition(x.tokenID)?.title}
                        </designer-token-glyph>
                        <span>${(x) => x.value}</span>
                        <adaptive-button
                            appearance="stealth"
                            aria-label="Remove design token"
                            @click=${(x, c) => c.parent.controller.styles.removeAppliedDesignToken(x.target, x.tokenID)}
                        >
                            ${staticallyCompose(SubtractIcon)}
                        </adaptive-button>
                    </div>
                `
            )}
        `
    )}
`;

const availableTokensTemplate = (
    tokenType: StyleProperty[], // Changed to array to support _applying_ individual values like top/bottom, but only _checking_ the first one.
    title: string | null,
    tokenLayout: "stack" | "grid" = "stack",
    glyphType: TokenGlyphType = TokenGlyphType.backgroundSwatch
) => html<App>`
    ${when(
        (x) => x.selectedNodes?.some((node) => node.supports.includes(tokenType[0])),
        html<App>`
            ${when(
                (x) => title,
                html`<p class="title inset">${(x) => title}</p>`
            )}
            <div class="swatch-${tokenLayout}">
                ${repeat(
                    (x) => x.controller.styles.getAppliableDesignTokenOptionsByType(tokenType[0]),
                    html<DesignTokenDefinition, App>`
                        <designer-token-glyph
                            circular
                            value=${(x, c) => c.parent.controller.designTokens.getDefaultDesignTokenValueAsString(x.token)}
                            orientation="horizontal"
                            type=${(x) => glyphType}
                            interactive
                            ?selected=${(x, c) => c.parent.controller.styles.getNodesWithDesignTokenApplied(x.id).length > 0}
                            @click=${(x, c) => c.parent.controller.styles.applyDesignToken(tokenType, x)}
                        >
                            ${(x) => x.title}
                        </designer-token-glyph>
                    `
                )}
            </div>
        `
    )}
`;

const syncLabel = "Evaluate and apply all design tokens for the current selection.";
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
    <adaptive-tabs activeid="styling">
        <adaptive-tab id="styling">Styling</adaptive-tab>
        <adaptive-tab id="tokens">Design Tokens</adaptive-tab>
        <adaptive-tab-panel id="stylingPanel">
            <div style="overflow-y: overlay;">
                <designer-drawer name="Style modules">
                    <div slot="collapsed-content">
                        ${repeat(
                            (x) => new Array(...x.appliedStyleModules.entries()),
                            html<[string, StyleModuleDisplay[]], App>`
                                <p class="title inset">${(x) => x[0]}</p>
                                <div class="swatch-stack">
                                    ${repeat(
                                        (x) => x[1],
                                        html<StyleModuleDisplay, App>`
                                            <div class="applied-style-module">
                                                <designer-token-glyph
                                                    orientation="horizontal"
                                                    type=${TokenGlyphType.icon}
                                                >
                                                    ${(x) => x.title}
                                                </designer-token-glyph>
                                                <adaptive-button
                                                    appearance="stealth"
                                                    aria-label="Remove style module"
                                                    @click=${(x, c) => c.parentContext.parent.controller.styles.removeStyleModule(x.name)}
                                                >
                                                    ${staticallyCompose(SubtractIcon)}
                                                </adaptive-button>
                                            </div>
                                        `
                                    )}
                                </div>
                            `
                        )}
                    </div>
                    <div>
                        ${repeat(
                            (x) => new Array(...x.controller.styles.getAvailableStyleModules().entries()),
                            html<[string, StyleModuleDisplay[]], App>`
                                <p class="title inset">${(x) => x[0]}</p>
                                <div class="swatch-stack">
                                    ${repeat(
                                        (x) => x[1],
                                        html<StyleModuleDisplay, App>`
                                            <designer-token-glyph
                                                orientation="horizontal"
                                                type=${TokenGlyphType.icon}
                                                interactive
                                                @click=${(x, c) => c.parentContext.parent.controller.styles.applyStyleModule(x.name)}
                                            >
                                                ${(x) => x.title}
                                            </designer-token-glyph>
                                        `
                                    )}
                                </div>
                            `
                        )}
                    </div>
                </designer-drawer>
                ${when(
                    (x) => x.supportsColor,
                    html<App>`
                        <designer-drawer name="Color">
                            <div slot="collapsed-content">
                                ${(x) => appliedTokensTemplate(x.layerTokens, "Layer")}
                                ${(x) => appliedTokensTemplate(x.backgroundTokens, "Background")}
                                ${(x) => appliedTokensTemplate(x.foregroundTokens, "Foreground")}
                                ${(x) => appliedTokensTemplate(x.strokeTokens, "Stroke", TokenGlyphType.borderSwatch)}
                            </div>
                            <div>
                                ${(x) => availableTokensTemplate([StyleProperty.backgroundFill], "Fill")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyBorderFillAll,
                                        "Stroke",
                                        "stack",
                                        TokenGlyphType.borderSwatch
                                    )}
                                ${(x) => availableTokensTemplate([StyleProperty.foregroundFill], "Foreground")}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsStrokeWidth,
                    html<App>`
                        <designer-drawer name="Stroke width">
                            <div slot="collapsed-content">
                                ${(x) => appliedTokensTemplate(x.strokeWidthTokens, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyBorderThicknessAll,
                                        null,
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsDensity,
                    html<App>`
                        <designer-drawer name="Density">
                            <div slot="collapsed-content">
                                ${(x) => appliedTokensTemplate(x.densityTokens, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.gap],
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
                                ${(x) => appliedTokensTemplate(x.cornerRadiusTokens, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyCornerRadiusAll,
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
                                ${(x) => appliedTokensTemplate(x.textTokens, null, TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontFamily],
                                        "Font family",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontSize],
                                        "Font size",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.lineHeight],
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
                                :designTokens=${(x) => x.controller.designTokens.availableDesignTokens}
                                @add=${(x, c) =>
                                    x.controller.designTokens.setDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                            ></designer-design-token-add>
                            <adaptive-divider></adaptive-divider>
                        </div>
                        <div style="overflow-y: overlay;">
                            <designer-design-tokens-form
                                :designTokens=${(x) => x.controller.designTokens.designTokenValues}
                                @tokenChange=${(x, c) =>
                                    x.controller.designTokens.setDesignToken(
                                        (c.event as CustomEvent).detail.definition,
                                        (c.event as CustomEvent).detail.value
                                    )}
                                @detach=${(x, c) => x.controller.designTokens.removeDesignToken((c.event as CustomEvent).detail)}
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

    .applied-design-token,
    .applied-style-module {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        padding-inline-start: calc(var(--design-unit) * 2px);
        margin-bottom: 8px;
    }

    .applied-style-module {
        grid-template-columns: 1fr auto;
    }

    .applied-design-token > span {
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
    public supportsDensity: boolean;

    @observable
    public supportsCornerRadius: boolean;

    @observable
    public supportsText: boolean;

    @observable
    public layerTokens: AppliedDesignTokenItem[] | null;

    @observable
    public backgroundTokens: AppliedDesignTokenItem[] | null;

    @observable
    public foregroundTokens: AppliedDesignTokenItem[] | null;

    @observable
    public strokeTokens: AppliedDesignTokenItem[] | null;

    @observable
    public strokeWidthTokens: AppliedDesignTokenItem[] | null;

    @observable
    public densityTokens: AppliedDesignTokenItem[] | null;

    @observable
    public cornerRadiusTokens: AppliedDesignTokenItem[] | null;

    @observable
    public textTokens: AppliedDesignTokenItem[] | null;

    @observable
    public supportsDesignSystem: boolean;

    @observable
    public appliedStyleModules: StyleModuleDisplayList = new Map();

    @observable
    public selectedNodes: PluginUINodeData[] | null;
    protected selectedNodesChanged(prev: PluginUINodeData[] | null, next: PluginUINodeData[] | null) {
        this.controller.selectedNodes = next;

        this.supportsColor =
            this.selectedNodes?.some(
                (node) =>
                    node.supports.includes(StyleProperty.backgroundFill) ||
                    node.supports.includes(StyleProperty.foregroundFill) ||
                    node.supports.includes(StyleProperty.borderFillTop)
            ) || false;
        this.supportsStrokeWidth = this.controller.supports(StyleProperty.borderThicknessTop);
        this.supportsDensity = this.controller.supports(StyleProperty.gap);
        this.supportsCornerRadius = this.controller.supports(StyleProperty.cornerRadiusTopLeft);
        this.supportsText = this.controller.supports(StyleProperty.fontFamily);

        this.supportsDesignSystem = true;

        this.refreshObservables();
    }

    constructor() {
        super();

        this.controller = new UIController((nodes) => this.dispatchState(nodes));
    }

    private refreshObservables() {
        this.backgroundTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.backgroundFill);
        this.foregroundTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.foregroundFill);
        this.strokeTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.borderFillTop);
        this.strokeWidthTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.borderThicknessTop);
        this.densityTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.gap);
        this.cornerRadiusTokens = this.controller.styles.getAppliedDesignTokens(StyleProperty.cornerRadiusTopLeft);
        this.textTokens = [
            ...this.controller.styles.getAppliedDesignTokens(StyleProperty.fontFamily),
            ...this.controller.styles.getAppliedDesignTokens(StyleProperty.fontSize),
            ...this.controller.styles.getAppliedDesignTokens(StyleProperty.lineHeight),
        ];

        this.appliedStyleModules = this.controller.styles.getAppliedStyleModules();
    }

    private dispatchState(selectedNodes: PluginUINodeData[]): void {
        this.refreshObservables();
        this.$emit("dispatch", selectedNodes);
    }
}
