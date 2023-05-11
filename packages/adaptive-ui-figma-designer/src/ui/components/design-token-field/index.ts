import { LayerBaseLuminance } from "@adaptive-web/adaptive-ui";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    css,
    customElement,
    ExecutionContext,
    FASTElement,
    html,
    observable,
    ref,
} from "@microsoft/fast-element";
import { DesignTokenDefinition, FormControlId } from "../../../core/registry/design-token-registry.js";

const defaultTokenTemplate = html<DesignTokenField>`
    <input
        value="${x => x.value}"
        @change="${(x, c) => {
            x.updateValue((c.event.target as HTMLInputElement).value);
        }}"
    />
`;

const colorInputChangeHandler = (x: DesignTokenField, c: ExecutionContext) => {
    const hex: string = (c.event.target as HTMLInputElement).value;
    const parsed = parseColorHexRGB(hex);
    if (parsed instanceof ColorRGBA64) {
        x.updateValue(hex);
    }
};

const tokenTemplatesByType = {
    color: html<DesignTokenField>`
        <input
            type="color"
            id="${x => x.designToken?.id}"
            ${ref("colorRef")}
            @change="${colorInputChangeHandler}"
        />
        <input
            type="text"
            id="${x => x.designToken?.id}Hex"
            class="hex"
            value="${x => x.value}"
            @change="${colorInputChangeHandler}"
        />
    `,
    luminance: html<DesignTokenField>`
        <select
            @change="${(x, c) => {
                x.updateValue((c.event.target as HTMLSelectElement).value);
            }}"
        >
            <option></option>
            <option
                value="${LayerBaseLuminance.LightMode}"
                ?selected="${x =>
                    Number.parseFloat(x.value) === LayerBaseLuminance.LightMode}"
            >
                Light mode
            </option>
            <option
                value="${LayerBaseLuminance.DarkMode}"
                ?selected="${x =>
                    Number.parseFloat(x.value) === LayerBaseLuminance.DarkMode}"
            >
                Dark mode
            </option>
        </select>
    `,
};

const template = html<DesignTokenField>`
    <label>
        <span>${x => x.designToken?.title}</span>
        ${x => x.selectTemplate()}
    </label>
`;

const styles = css`
    :host {
        display: flex;
        flex-grow: 1;
    }

    label {
        display: inline-flex;
        align-items: center;
        flex-grow: 1;
        gap: 8px;
    }

    span {
        flex-grow: 1;
    }

    input,
    select {
        height: 32px;
    }

    select {
        width: 120px;
    }

    input.hex {
        width: 80px;
    }
`;

@customElement({
    name: "designer-design-token-field",
    template,
    styles,
})
export class DesignTokenField extends FASTElement {
    colorRef: HTMLInputElement;

    @observable
    designToken?: DesignTokenDefinition;

    @observable
    value?: any;
    valueChanged(prev: any, next: any) {
        this.setColorInputValue(next);
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.setColorInputValue(this.value);
    }

    // There seems to be a bug in the platform color picker element where the previous color is displayed
    // even when the attribute changes. Setting the value in code works though.
    setColorInputValue(value: string) {
        if (this.colorRef && this.designToken && this.designToken.formControlId == FormControlId.color) {
            this.colorRef.value = value;
        }
    }

    updateValue(value: any) {
        this.value = value;
        this.$emit("change", this.value);
    }

    selectTemplate() {
        if (this.designToken) {
            if (this.designToken.formControlId === FormControlId.color) {
                return tokenTemplatesByType["color"];
            } else if (this.designToken.id === "baseLayerLuminance") {
                return tokenTemplatesByType["luminance"];
            }
        }
        return defaultTokenTemplate;
    }
}
