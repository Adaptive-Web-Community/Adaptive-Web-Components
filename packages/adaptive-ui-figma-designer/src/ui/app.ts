import { css, customElement, FASTElement, html, observable, repeat, when } from "@microsoft/fast-element";
import { staticallyCompose } from "@microsoft/fast-foundation";
import {
    StyleProperty,
    stylePropertyBorderFillAll,
    stylePropertyBorderThicknessAll,
    stylePropertyCornerRadiusAll,
    stylePropertyPaddingAll
} from "@adaptive-web/adaptive-ui";
import {
    cornerRadiusControl,
    neutralFillStealthHover,
    neutralStrokeReadableRest,
    neutralStrokeStrongRest
} from "@adaptive-web/adaptive-ui/reference";
import type { PluginMessage, PluginUINodeData } from "../core/model.js";
import { StatesState } from "../core/node.js";
import { DesignTokenDefinition } from "../core/registry/design-token-registry.js";
import SubtractIcon from "./assets/subtract.svg";
import { UIController } from "./ui-controller.js";
import { AppliedDesignTokenItem, StyleModuleDisplay, StyleModuleDisplayList } from "./ui-controller-styles.js";
import { DesignTokenAdd, DesignTokensForm, Drawer, StyleTokenItem, TokenGlyph, TokenGlyphType } from "./components/index.js";

StyleTokenItem;
TokenGlyph;
Drawer;
DesignTokenAdd;
DesignTokensForm;

const appliedStylesTemplate = (
    group: string
) => html<App>`
    ${when(
        (x) => x.appliedStyleModules.get(group)?.length,
        html<App>`
            <p class="title">Styles</p>
            <div class="swatch-stack">
                ${repeat(
                    (x) => x.appliedStyleModules.get(group),
                    html<StyleModuleDisplay, App>`
                        <div class="style-module applied">
                            <span class="content">
                                ${(x) => x.title}
                            </span>
                            <designer-token-glyph
                                circular
                                type=${TokenGlyphType.stylesSwatch}
                                :styles=${x => x.styles}
                                interactive
                            >
                            </designer-token-glyph>
                            <adaptive-button
                                appearance="stealth"
                                aria-label="Remove style"
                                @click=${(x, c) => c.parent.controller.styles.removeStyleModule(x.name)}
                            >
                                ${staticallyCompose(SubtractIcon)}
                            </adaptive-button>
                        </div>
                    `
                )}
            </div>
        `
    )}
`;

const availableStylesTemplate = (
    group: string
) => html<App>`
    <p class="title">Styles</p>
    <div class="swatch-stack">
        ${repeat(
            (x) => x.controller.styles.getAvailableStyleModules().get(group),
            html<StyleModuleDisplay, App>`
                <div class="style-module available">
                    <span
                        class="content"
                        role="button"
                        @click=${(x, c) => c.parent.controller.styles.applyStyleModule(x.name)}
                    >
                        ${(x) => x.title}
                    </span>
                    <designer-token-glyph
                        circular
                        type=${TokenGlyphType.stylesSwatch}
                        :styles=${x => x.styles}
                        interactive
                    >
                    </designer-token-glyph>
                </div>
            `
        )}
    </div>
`;

const appliedTokensTemplate = (
    tokens: AppliedDesignTokenItem[] | null,
    title: string | null,
    glyphType?: TokenGlyphType
) => html<App>`
    ${when(
        (_) => tokens?.length,
        html<App>`
            ${when(
                (_) => title,
                html`<p class="title">${(_) => title}</p>`
            )}
            <div class="swatch-stack">
                ${repeat(
                    (_) => tokens,
                    html<AppliedDesignTokenItem, App>`
                        <designer-style-token-item
                            title=${(x, c) => c.parent.controller.styles.getAppliableDesignTokenDefinition(x.tokenID)?.title}
                            value=${(x) => x.value}
                            glyphType=${(_) => glyphType}
                        >
                            <adaptive-button
                                slot="actions"
                                appearance="stealth"
                                aria-label="Remove design token"
                                @click=${(x, c) => c.parent.controller.styles.removeAppliedDesignToken(x.targets, x.tokenID)}
                            >
                                ${staticallyCompose(SubtractIcon)}
                            </adaptive-button>
                        </designer-style-token-item>
                    `
                )}
            </div>
        `
    )}
`;

const availableTokensTemplate = (
    tokenTypes: StyleProperty[],
    title: string | null,
    tokenLayout: "stack" | "grid" = "stack",
    glyphType?: TokenGlyphType
) => html<App>`
    ${when(
        (x) => x.selectedNodes?.some((node) => tokenTypes.some((prop) => node.supports.includes(prop))),
        html<App>`
            ${when(
                (_) => title,
                html`<p class="title">${(_) => title}</p>`
            )}
            <div class="swatch-${tokenLayout}">
                ${repeat(
                    (x) => x.controller.styles.getAppliableDesignTokenOptions(tokenTypes),
                    html<DesignTokenDefinition, App>`
                        <designer-style-token-item
                            title=${(x) => x.title}
                            value=${(x, c) => c.parent.controller.designTokens.getDefaultDesignTokenValueAsString(x.token)}
                            glyphType=${(_) => glyphType}
                            content-button
                            @click=${(x, c) => c.parent.controller.styles.applyDesignToken(x.intendedFor, x)}
                        >
                        </designer-style-token-item>
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
        <p class="selection-label" title=${(x) => x.selectionDescription}>
            ${(x) => x.selectionDescription}
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
                ${when(
                    (x) => x.statesState !== StatesState.notAvailable,
                    html<App>`
                        ${when(
                            (x) => x.statesState === StatesState.configured,
                            html<App>`
                                <p>Interactive states are already configured for this component set.</p>
                            `,
                            html<App>`
                                <p>Automatically create interactive states for this component set.</p>
                                <p>This will use the existing components for rest state, and create hover, active, focus, and disabled variants.</p>
                                <p>Prototype interactions will also be created.</p>
                                <button @click=${(x) => x.controller.states.createStates()}>Create States</button>
                            `
                        )}
                    `
                )}
                ${when(
                    (x) => x.supportsStyling,
                    html<App>`
                        <designer-drawer name="Use cases">
                            <div slot="collapsed-content">
                                ${(x) => appliedStylesTemplate("Styles")}
                            </div>
                            <div>
                                ${(x) => availableStylesTemplate("Styles")}
                            </div>
                        </designer-drawer>
                    `,
                    html`
                        ${when(
                            (x) => x.statesState === StatesState.notAvailable,
                            html<App>`
                                <p>Selected layers don't support styling</p>
                            `
                        )}
                    `
                )}
                ${when(
                    (x) => x.supportsColor,
                    html<App>`
                        <designer-drawer name="Color">
                            <div slot="collapsed-content">
                                ${(x) => appliedStylesTemplate("Color")}
                                ${(x) => appliedTokensTemplate(x.layerTokens, "Layer", TokenGlyphType.backgroundSwatch)}
                                ${(x) => appliedTokensTemplate(x.backgroundTokens, "Background", TokenGlyphType.backgroundSwatch)}
                                ${(x) => appliedTokensTemplate(x.borderFillTokens, "Stroke", TokenGlyphType.borderSwatch)}
                                ${(x) => appliedTokensTemplate(x.foregroundTokens, "Foreground", TokenGlyphType.icon)}
                            </div>
                            <div>
                                ${(x) => availableStylesTemplate("Color")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.backgroundFill],
                                        "Fill",
                                        "stack",
                                        TokenGlyphType.backgroundSwatch)}
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyBorderFillAll,
                                        "Stroke",
                                        "stack",
                                        TokenGlyphType.borderSwatch
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.foregroundFill],
                                        "Foreground",
                                        "stack",
                                        TokenGlyphType.icon
                                    )}
                            </div>
                        </designer-drawer>
                    `
                )}
                ${when(
                    (x) => x.supportsBorderThickness || x.supportsCornerRadius,
                    html<App>`
                        <designer-drawer name="Shape">
                            <div slot="collapsed-content">
                                ${(x) => appliedStylesTemplate("Shape")}
                                ${(x) => appliedTokensTemplate(x.cornerRadiusTokens, null)}
                                ${(x) => appliedTokensTemplate(x.borderThicknessTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableStylesTemplate("Shape")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyCornerRadiusAll,
                                        "Corner radius",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        stylePropertyBorderThicknessAll,
                                        "Stroke thickness",
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
                                ${(x) => appliedStylesTemplate("Density")}
                                ${(x) => appliedTokensTemplate(x.densityTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableStylesTemplate("Density")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [...stylePropertyPaddingAll, StyleProperty.gap],
                                        "Density",
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
                                ${(x) => appliedStylesTemplate("Text")}
                                ${(x) => appliedStylesTemplate("Font") /* TODO legacy, remove */}
                                ${(x) => appliedTokensTemplate(x.textTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableStylesTemplate("Text")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontFamily],
                                        "Font family",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontStyle],
                                        "Font style",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontWeight],
                                        "Font weight",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.fontSize],
                                        "Font size",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.lineHeight],
                                        "Line height",
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
        border-bottom: var(--stroke-width) solid var(--neutral-stroke-divider-rest);
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
        margin-inline-end: calc(var(--design-unit) * 2);
    }

    .swatch-grid > * {
        margin-bottom: calc(var(--design-unit) * 3);
    }

    .swatch-stack {
        display: flex;
        flex-direction: column;
    }

    .swatch-stack > * {
        padding: var(--design-unit) 0;
        padding-inline-start: calc(var(--design-unit) * 4);
        padding-inline-end: var(--design-unit);
    }

    .title {
        padding: 0 calc(var(--design-unit) * 3);
        color: ${neutralStrokeReadableRest}
    }

    .style-module {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .style-module .content {
        display: flex;
        justify-content: space-between;
        flex-grow: 1;
        border-radius: ${cornerRadiusControl};
        color: ${neutralStrokeStrongRest};
        padding: 8px 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .style-module .content[role="button"] {
        cursor: pointer;
    }

    .style-module .content[role="button"]:hover {
        background: ${neutralFillStealthHover};
    }

    .tokens-panel-content {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }

    footer {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 4px calc(var(--design-unit) * 2) 4px calc(var(--design-unit) * 4);
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
    public supportsStyling: boolean;

    @observable
    public supportsColor: boolean;

    @observable
    public supportsBorderThickness: boolean;

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
    public borderFillTokens: AppliedDesignTokenItem[] | null;

    @observable
    public borderThicknessTokens: AppliedDesignTokenItem[] | null;

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
    public statesState: StatesState | "unknown" = "unknown";

    @observable
    public selectionDescription: string;

    @observable
    public selectedNodes: PluginUINodeData[] | null;
    protected selectedNodesChanged(prev: PluginUINodeData[] | null, next: PluginUINodeData[] | null) {
        this.controller.selectedNodes = next;

        this.selectionDescription = this.selectedNodes?.map((node) => `${node.type}`).join(" | ") || "No selection";

        this.supportsColor =
            this.selectedNodes?.some(
                (node) =>
                    node.supports.includes(StyleProperty.backgroundFill) ||
                    node.supports.includes(StyleProperty.foregroundFill) ||
                    node.supports.includes(StyleProperty.borderFillTop)
            ) || false;
        this.supportsBorderThickness = this.controller.supports(StyleProperty.borderThicknessTop);
        this.supportsDensity = this.controller.supports(StyleProperty.gap);
        this.supportsCornerRadius = this.controller.supports(StyleProperty.cornerRadiusTopLeft);
        this.supportsText = this.controller.supports(StyleProperty.fontFamily);

        this.supportsStyling =
            this.supportsColor ||
            this.supportsBorderThickness ||
            this.supportsDensity ||
            this.supportsCornerRadius ||
            this.supportsText;

        this.supportsDesignSystem = true;

        this.refreshObservables();
    }

    constructor() {
        super();

        this.controller = new UIController((message) => this.dispatchMessage(message));
    }

    private refreshObservables() {
        this.backgroundTokens = this.controller.styles.getAppliedDesignTokens([StyleProperty.backgroundFill]);
        this.foregroundTokens = this.controller.styles.getAppliedDesignTokens([StyleProperty.foregroundFill]);
        this.borderFillTokens = this.controller.styles.getAppliedDesignTokens(stylePropertyBorderFillAll);
        this.borderThicknessTokens = this.controller.styles.getAppliedDesignTokens(stylePropertyBorderThicknessAll);
        this.densityTokens = this.controller.styles.getAppliedDesignTokens([...stylePropertyPaddingAll, StyleProperty.gap]);
        this.cornerRadiusTokens = this.controller.styles.getAppliedDesignTokens(stylePropertyCornerRadiusAll);
        this.textTokens = this.controller.styles.getAppliedDesignTokens([
            StyleProperty.fontFamily,
            StyleProperty.fontStyle,
            StyleProperty.fontWeight,
            StyleProperty.fontSize,
            StyleProperty.lineHeight
        ]);

        this.appliedStyleModules = this.controller.styles.getAppliedStyleModules();

        this.statesState = this.controller.states.getState();
    }

    private dispatchMessage(message: PluginMessage): void {
        this.refreshObservables();
        this.$emit("dispatch", message);
    }
}
