import { parseColor, type TreatmentRef } from "@adaptive-web/adaptive-ui";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import {
    attr,
    css,
    customElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import { ComponentType } from "../component-type.js";
import { type ExplorerLibrary, properties, tokens } from "../library.js";
import { ScopeElement } from "../scope.js";
import { StyleExample } from "./style-example.js";

StyleExample;

interface Example {
    label: string;
    treatment: TreatmentRef;
}

const { accent, highlight, layer, neutral } = tokens.color;

// The treatments shown on each background, for each type of component.
const examples: { readonly [K in ComponentType]?: readonly Example[] } = {
    [ComponentType.backplate]: [
        { label: "Accent hue shift", treatment: accent.treatments.hueShiftGradientFillSubtleElement },
        { label: "Accent to Highlight", treatment: accent.treatments.toHighlightGradientFillSubtleElement },
        { label: "Accent ideal", treatment: accent.treatments.fillIdealControl },
        { label: "Accent readable", treatment: accent.treatments.fillReadableControl },
        { label: "Accent stealth", treatment: accent.treatments.fillStealthControl },
        { label: "Accent subtle", treatment: accent.treatments.fillSubtleControl },
        { label: "Accent subtle inverse", treatment: accent.treatments.fillSubtleInverseControl },
        { label: "Layer interactive", treatment: layer.treatments.fillInteractiveControl },
        { label: "Neutral ideal", treatment: neutral.treatments.fillIdealControl },
        { label: "Neutral readable", treatment: neutral.treatments.fillReadableControl },
        { label: "Neutral stealth", treatment: neutral.treatments.fillStealthControl },
        { label: "Neutral subtle", treatment: neutral.treatments.fillSubtleControl },
        { label: "Neutral subtle inverse", treatment: neutral.treatments.fillSubtleInverseControl },
        { label: "Highlight ideal", treatment: highlight.treatments.fillIdealControl },
        { label: "Highlight readable", treatment: highlight.treatments.fillReadableControl },
        { label: "Highlight stealth", treatment: highlight.treatments.fillStealthControl },
        { label: "Highlight subtle", treatment: highlight.treatments.fillSubtleControl },
        { label: "Highlight subtle inverse", treatment: highlight.treatments.fillSubtleInverseControl },
    ],
    [ComponentType.text]: [
        { label: "Accent control", treatment: accent.treatments.foregroundReadableControl },
        { label: "Neutral element", treatment: neutral.treatments.foregroundStrongElement },
        { label: "Hint / placeholder element", treatment: neutral.treatments.foregroundReadableElement },
        { label: "Highlight control", treatment: highlight.treatments.foregroundReadableControl },
    ],
    [ComponentType.form]: [
        { label: "Accent outline", treatment: accent.treatments.outlineDiscernibleControl },
        { label: "Accent discernible", treatment: accent.treatments.fillDiscernibleControl },
        { label: "Neutral outline", treatment: neutral.treatments.outlineDiscernibleControl },
        { label: "Neutral discernible", treatment: neutral.treatments.fillDiscernibleControl },
        { label: "Divider subtle", treatment: neutral.treatments.dividerSubtleElement },
        { label: "Divider discernible", treatment: neutral.treatments.dividerDiscernibleElement },
        { label: "Highlight outline", treatment: highlight.treatments.outlineDiscernibleControl },
        { label: "Highlight discernible", treatment: highlight.treatments.fillDiscernibleControl },
    ],
};

const exampleTemplate = html<Example, ColorBlock>`
    <app-style-example
        :treatment=${x => x.treatment}
        :disabledState=${(_, c) => c.parent.disabledState}
        :showSwatches=${(_, c) => c.parent.showSwatches}
    >
        ${x => x.label}
    </app-style-example>
`;

const template = html<ColorBlock>`
    <div class="title">
        <p class="swatch">${x => `Swatch ${x.index} - ${x.color}`}</p>
        <p class="layerName">
            ${when(
                x => x.layerName,
                html<ColorBlock>`
                    Layer: ${x => x.layerName}
                `
            )}
        </p>
    </div>
    ${repeat(x => (x.component && examples[x.component]) ?? [], exampleTemplate)}
`;

const styles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: stretch;
        text-align: center;
        position: relative;
        transition: opacity 0.1s linear;
        height: max-content;
        min-height: 100%;
        padding: 36px;
        gap: 24px;
        background-color: ${properties.color.context.var};
        color: ${properties.color.neutral.stroke.readable.var};
    }

    .title {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .title p {
        margin: 0;
    }

    .swatch {
        font-weight: 600;
        text-transform: uppercase;
    }

    .layerName {
        font-weight: normal;
    }
`;

/**
 * A background: a scope whose color context is a color, with examples of treatments on it.
 */
@customElement({
    name: "app-color-block",
    template,
    styles,
})
export class ColorBlock extends ScopeElement {
    @attr
    public index?: number;

    @attr
    public component?: ComponentType;

    @attr
    public color?: string;
    protected colorChanged(): void {
        this.scopeChanged();
    }

    @attr({ attribute: "layer-name" })
    public layerName?: string;

    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;

    protected updateScope(library: ExplorerLibrary): void {
        const color = this.color ? parseColor(this.color) : undefined;
        if (color) {
            library.tokens.color.context.set(color);
        }
    }
}
