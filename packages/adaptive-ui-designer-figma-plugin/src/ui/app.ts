import { css, customElement, FASTElement, html, observable, repeat, when } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/two-way.js";
import { staticallyCompose } from "@adaptive-web/components-fast";
import { StyleProperty, StylePropertyShorthand } from "@adaptive-web/adaptive-ui";
import type { AppliedDesignToken, DesignTokenValue, PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { StatesState } from "@adaptive-web/adaptive-ui-designer-core";
import type { PluginMessage, SkipInvisibleNodesMessage} from "../core/messages.js";
import SubtractIcon from "./assets/subtract.svg";
import { UIController } from "./ui-controller.js";
import type { CatalogToken } from "./tokens/catalog.js";
import { properties } from "./tokens/library.js";
import { AppliedDesignTokenItem, TreatmentDisplay, TreatmentDisplayList } from "./ui-controller-styles.js";
import { AddEventDetail, DesignTokenAdd, DesignTokensForm, DetachEventDetail, Drawer, StyleTokenItem, TokenChangeEventDetail, TokenGlyph, TokenGlyphValueType } from "./components/index.js";
import { designTokenTitle } from "./util.js";

StyleTokenItem;
TokenGlyph;
Drawer;
DesignTokenAdd;
DesignTokensForm;

const appliedTreatmentsTemplate = (
    group: string
) => html<App>`
    ${when(
        (x) => x.appliedTreatments.get(group)?.length,
        html<App>`
            <p class="title">Treatments</p>
            <div class="swatch-stack">
                ${repeat(
                    (x) => x.appliedTreatments.get(group)!,
                    html<TreatmentDisplay, App>`
                        <designer-style-token-item
                            title=${(x) => x.title}
                            :swatchStyle=${x => x.style}
                        >
                            <adaptive-button
                                slot="actions"
                                appearance="stealth"
                                aria-label="Remove treatment"
                                @click=${(x, c) => c.parent.controller.styles.removeTreatment(x.name)}
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

const availableTreatmentsTemplate = (
    group: string
) => html<App>`
    <p class="title">Treatments</p>
    <div class="swatch-stack">
        ${repeat(
            (x) => x.controller.styles.getAvailableTreatments().get(group)!,
            html<TreatmentDisplay, App>`
                <designer-style-token-item
                    title=${(x) => x.title}
                    :swatchStyle=${x => x.style}
                    content-button
                    @itemClick=${(x, c) => c.parent.controller.styles.applyTreatment(x.name)}
                >
                </designer-style-token-item>
            `
        )}
    </div>
`;

function getAppliedToken(applied: AppliedDesignTokenItem, app: App) {
    return app.controller.styles.getAppliableDesignToken(applied.tokenID);
}

function tokenValue(token: CatalogToken | null, app: App): string | null {
    return token ? app.controller.styles.getDesignTokenValueAsString(token) : null;
}

function appliedStyleProperties(tokenTypes: StyleProperty[], tokenIntendedFor: readonly StyleProperty[]): StyleProperty[] {
    return tokenTypes.filter(element => tokenIntendedFor.includes(element));
}

const appliedTokensTemplate = (
    tokenTypes: StyleProperty[],
    tokens: AppliedDesignTokenItem[] | null,
    title: string | null,
    glyphType?: TokenGlyphValueType
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
                    (_) => tokens!,
                    html<AppliedDesignTokenItem, App>`
                        <designer-style-token-item
                            title=${(x, c) => {
                                const token = c.parent.controller.styles.getAppliableDesignToken(x.tokenID);
                                return token ? designTokenTitle(token) : x.tokenID;
                            }}
                            :value=${(x, c) => tokenValue(getAppliedToken(x, c.parent), c.parent)}
                            glyphType=${(_) => glyphType}
                        >
                            <adaptive-button
                                slot="actions"
                                appearance="stealth"
                                aria-label="Remove design token"
                                @click=${(x, c) => c.parent.controller.styles.removeAppliedDesignToken([...x.targets], x.tokenID)}
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
    glyphType?: TokenGlyphValueType
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
                    html<CatalogToken, App>`
                        <designer-style-token-item
                            title=${(x) => designTokenTitle(x)}
                            :value=${(x, c) => tokenValue(x, c.parent)}
                            glyphType=${(_) => glyphType}
                            content-button
                            @itemClick=${(x, c) => c.parent.controller.styles.applyDesignToken(appliedStyleProperties(tokenTypes, x.appliesTo), x)}
                        >
                        </designer-style-token-item>
                    `
                )}
            </div>
        `
    )}
`;

const clipboardCopy = (content: string) => {
    const textArea = document.getElementById("copyTextArea") as HTMLTextAreaElement;
    textArea.value = content;
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand("copy");
        if (!successful) {
            console.warn("Copying text command was not successful");
        }
    } catch (err) {
        console.error("Error copying text", err);
    }
};

const syncLabel = "Evaluate and apply all design tokens for the current selection.";
const genStylesLabel = "Copies styling code for this component.";
const revertLabel = "Remove all plugin data from the current selection.";

const viewNodeTemplate = html<PluginUINodeData>`
    <adaptive-tree-item ?expanded="${(_) => true}">
        ${(x) => x.name} (${(x) => x.id}, ${(x) => x.type})
        ${when(
            (x) => Object.keys(x.designTokens).length > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Design tokens
                    ${repeat(
                        (x) => Object.entries(x.designTokens),
                        html<[string, DesignTokenValue]>`
                            <adaptive-tree-item>
                                ${(x) => x[0]}: ${(x) => x[1].value}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${when(
            (x) => Object.keys(x.appliedDesignTokens).length > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Applied design tokens
                    ${repeat(
                        (x) => Object.entries(x.appliedDesignTokens),
                        html<[StyleProperty, AppliedDesignToken]>`
                            <adaptive-tree-item>
                                ${(x) => x[0]}: ${(x) => x[1].tokenID}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${when(
            (x) => x.appliedTreatments.length > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Applied treatments
                    ${repeat(
                        (x) => x.appliedTreatments,
                        html<string>`
                            <adaptive-tree-item>
                                ${(x) => x}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${when(
            (x) => Object.keys(x.refDesignTokens ?? {}).length > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Ref design tokens
                    ${repeat(
                        (x) => Object.entries(x.refDesignTokens ?? {}),
                        html<[string, DesignTokenValue]>`
                            <adaptive-tree-item>
                                ${(x) => x[0]}: ${(x) => x[1].value}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${when(
            (x) => Object.keys(x.refAppliedDesignTokens ?? {}).length > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Ref applied design tokens
                    ${repeat(
                        (x) => Object.entries(x.refAppliedDesignTokens ?? {}),
                        html<[StyleProperty, AppliedDesignToken]>`
                            <adaptive-tree-item>
                                ${(x) => x[0]}: ${(x) => x[1].tokenID}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${when(
            (x) => (x.refAppliedTreatments?.length ?? 0) > 0,
            html<PluginUINodeData>`
                <adaptive-tree-item ?expanded="${(_) => true}">
                    Ref applied treatments
                    ${repeat(
                        (x) => x.refAppliedTreatments,
                        html<string>`
                            <adaptive-tree-item>
                                ${(x) => x}
                            </adaptive-tree-item>
                        `)}
                </adaptive-tree-item>
            `
        )}
        ${repeat(
            (x) => x.children,
            html<PluginUINodeData>`
                ${(_) => viewNodeTemplate}
            `,
        )}
    </adaptive-tree-item>
`;

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
                aria-label=${genStylesLabel}
                style="display: ${(x) => (x.controller.code.supportsCodeGen ? "block" : "none")};"
                @click=${(x) => {
                    const val = x.controller.code.generateForSelectedNodes();
                    clipboardCopy(val);
                }}
            >
                Gen styles
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
    <div class="tabs">
        <adaptive-tablist panels="panels">
            <adaptive-tab id="styling" selected>Styling</adaptive-tab>
            <adaptive-tab id="tokens">Design Tokens</adaptive-tab>
            <adaptive-tab id="settings">Settings</adaptive-tab>
            <adaptive-tab id="view">View</adaptive-tab>
        </adaptive-tablist>
        <div id="panels">
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
                                ${(x) => appliedTreatmentsTemplate("Styles")}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Styles")}
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
                                ${(x) => appliedTreatmentsTemplate("Color")}
                                ${(x) => appliedTokensTemplate([StyleProperty.backgroundFill], x.layerTokens, "Layer", TokenGlyphValueType.background)}
                                ${(x) => appliedTokensTemplate([StyleProperty.backgroundFill], x.backgroundTokens, "Background", TokenGlyphValueType.background)}
                                ${(x) => appliedTokensTemplate(StylePropertyShorthand.borderFill, x.borderFillTokens, "Stroke", TokenGlyphValueType.border)}
                                ${(x) => appliedTokensTemplate([StyleProperty.foregroundFill], x.foregroundTokens, "Foreground", TokenGlyphValueType.foreground)}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Color")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.backgroundFill],
                                        "Fill",
                                        "stack",
                                        TokenGlyphValueType.background)}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StylePropertyShorthand.borderFill,
                                        "Stroke",
                                        "stack",
                                        TokenGlyphValueType.border
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.foregroundFill],
                                        "Foreground",
                                        "stack",
                                        TokenGlyphValueType.foreground
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
                                ${(x) => appliedTreatmentsTemplate("Shape")}
                                ${(x) => appliedTokensTemplate(StylePropertyShorthand.cornerRadius, x.cornerRadiusTokens, null)}
                                ${(x) => appliedTokensTemplate(StylePropertyShorthand.borderThickness, x.borderThicknessTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Shape")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StylePropertyShorthand.cornerRadius,
                                        "Corner radius",
                                    )}
                                ${(x) =>
                                    availableTokensTemplate(
                                        StylePropertyShorthand.borderThickness,
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
                                ${(x) => appliedTreatmentsTemplate("Density")}
                                ${(x) => appliedTokensTemplate([...StylePropertyShorthand.padding, StyleProperty.gap], x.densityTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Density")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [...StylePropertyShorthand.padding, StyleProperty.gap],
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
                                ${(x) => appliedTreatmentsTemplate("Text")}
                                ${(x) => appliedTreatmentsTemplate("Font") /* TODO legacy, remove */}
                                ${(x) => appliedTokensTemplate([StyleProperty.fontFamily], x.textTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Text")}
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
                ${when(
                    (x) => x.supportsShadow,
                    html<App>`
                        <designer-drawer name="Shadow">
                            <div slot="collapsed-content">
                                ${(x) => appliedTreatmentsTemplate("Shadow")}
                                ${(x) => appliedTokensTemplate([StyleProperty.shadow], x.shadowTokens, null)}
                            </div>
                            <div>
                                ${(x) => availableTreatmentsTemplate("Shadow")}
                                ${(x) =>
                                    availableTokensTemplate(
                                        [StyleProperty.shadow],
                                        "Shadow",
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
                                        ((c.event as CustomEvent).detail as AddEventDetail).token,
                                        ((c.event as CustomEvent).detail as AddEventDetail).value
                                    )}
                            ></designer-design-token-add>
                            <adaptive-divider></adaptive-divider>
                        </div>
                        <div style="overflow-y: overlay;">
                            <designer-design-tokens-form
                                :designTokens=${(x) => x.controller.designTokens.designTokenValues}
                                @tokenChange=${(x, c) =>
                                    x.controller.designTokens.setDesignToken(
                                        ((c.event as CustomEvent).detail as TokenChangeEventDetail).token,
                                        ((c.event as CustomEvent).detail as TokenChangeEventDetail).value
                                    )}
                                @detach=${(x, c) =>
                                    x.controller.designTokens.removeDesignToken(
                                        ((c.event as CustomEvent).detail as DetachEventDetail)
                                    )}
                            ></designer-design-tokens-form>
                        </div>
                    </div>
                `
            )}
            ${when((x) => !x.supportsDesignSystem, html` <div>Selected layers don't support design tokens</div> `)}
        </adaptive-tab-panel>
        <adaptive-tab-panel id="settingsPanel">
            <div class="settings-layout">
                <adaptive-switch label="Auto refresh" :checked="${twoWay((x) => x.controller.autoRefreshEnabled)}"></adaptive-switch>
                <adaptive-switch label="Skip invisible nodes (composition mode)" :checked="${twoWay((x) => x.skipInvisibleNodes)}"></adaptive-switch>
            </div>
        </adaptive-tab-panel>
        <adaptive-tab-panel id="viewPanel">
            <div class="view-layout">
                <adaptive-tree-view>
                    ${repeat(
                        (x) => x.selectedNodes ?? [],
                        html<PluginUINodeData, App>`
                            ${(_) => viewNodeTemplate}
                        `,
                    )}
                </adaptive-tree-view>
            </div>
        </adaptive-tab-panel>
        </div>
    </div>
    ${(x) => footerTemplate}
`;

const styles = css`
    :host {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100%;
    }

    adaptive-tablist {
        border-bottom: var(--shape-strokeThickness-default) solid var(--color-neutral-stroke-subtle-rest);
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
        margin-inline-end: calc(var(--global-designUnit) * 2);
    }

    .swatch-grid > * {
        margin-bottom: calc(var(--global-designUnit) * 3);
    }

    .swatch-stack {
        display: flex;
        flex-direction: column;
    }

    .swatch-stack > * {
        padding: var(--global-designUnit) 0;
        padding-inline-start: calc(var(--global-designUnit) * 4);
        padding-inline-end: var(--global-designUnit);
    }

    .title {
        padding: 0 calc(var(--global-designUnit) * 3);
        color: ${properties.color.neutral.stroke.readable.var};
    }

    .tokens-panel-content {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
    }

    .settings-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }

    footer {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 4px calc(var(--global-designUnit) * 2) 4px calc(var(--global-designUnit) * 4);
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
    public supportsStyling: boolean = false;

    @observable
    public supportsColor: boolean = false;

    @observable
    public supportsBorderThickness: boolean = false;

    @observable
    public supportsDensity: boolean = false;

    @observable
    public supportsCornerRadius: boolean = false;

    @observable
    public supportsText: boolean = false;

    @observable
    public supportsShadow: boolean = false;

    @observable
    public layerTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public backgroundTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public foregroundTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public borderFillTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public borderThicknessTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public densityTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public cornerRadiusTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public textTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public shadowTokens: AppliedDesignTokenItem[] | null = null;

    @observable
    public supportsDesignSystem: boolean = false;

    @observable
    public appliedTreatments: TreatmentDisplayList = new Map();

    @observable
    public statesState: StatesState | "unknown" = "unknown";

    @observable
    public selectionDescription: string = "No selection";

    @observable
    public selectedNodes: PluginUINodeData[] | null = null;
    protected selectedNodesChanged(prev: PluginUINodeData[] | null, next: PluginUINodeData[] | null) {
        if (this.controller) {
            this.controller.selectedNodes = next || [];

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
            this.supportsShadow = this.controller.supports(StyleProperty.shadow);

            this.supportsStyling =
                this.supportsColor ||
                this.supportsBorderThickness ||
                this.supportsDensity ||
                this.supportsCornerRadius ||
                this.supportsText ||
                this.supportsShadow;

            this.supportsDesignSystem = true;

            this.refreshObservables();
        }
    }

    @observable
    public skipInvisibleNodes: boolean = true;
    protected skipInvisibleNodesChanged(prev: boolean, next: boolean) {
        const message: SkipInvisibleNodesMessage = {
            type: "SKIP_INVISIBLE_NODES",
            value: next
        };
        this.dispatchMessage(message);
    }

    constructor() {
        super();

        this.controller = new UIController((message) => this.dispatchMessage(message));
    }

    private refreshObservables() {
        if (this.controller) {
            this.backgroundTokens = this.controller.styles.getAppliedDesignTokens([StyleProperty.backgroundFill]);
            this.foregroundTokens = this.controller.styles.getAppliedDesignTokens([StyleProperty.foregroundFill]);
            this.borderFillTokens = this.controller.styles.getAppliedDesignTokens(StylePropertyShorthand.borderFill);
            this.borderThicknessTokens = this.controller.styles.getAppliedDesignTokens(StylePropertyShorthand.borderThickness);
            this.densityTokens = this.controller.styles.getAppliedDesignTokens([...StylePropertyShorthand.padding, StyleProperty.gap]);
            this.cornerRadiusTokens = this.controller.styles.getAppliedDesignTokens(StylePropertyShorthand.cornerRadius);
            this.textTokens = this.controller.styles.getAppliedDesignTokens([
                StyleProperty.fontFamily,
                StyleProperty.fontStyle,
                StyleProperty.fontWeight,
                StyleProperty.fontSize,
                StyleProperty.lineHeight
            ]);
            this.shadowTokens = this.controller.styles.getAppliedDesignTokens([StyleProperty.shadow]);

            this.appliedTreatments = this.controller.styles.getAppliedTreatments();

            this.statesState = this.controller.states.getState();
        }
    }

    private dispatchMessage(message: PluginMessage): void {
        this.refreshObservables();
        this.$emit("dispatch", message);
    }
}
