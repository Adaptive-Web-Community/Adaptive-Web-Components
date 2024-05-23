import { css, customElement, FASTElement, html, observable } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way.js";
import { DesignTokenDefinition, FormControlId } from "@adaptive-web/adaptive-ui-designer-core";

const tokenTemplatesByType = {
    default: html<DesignTokenField>`
        <input
            :value="${twoWay(x => x.value)}"
        />
    `,
    color: html<DesignTokenField>`
        <input
            type="color"
            :value="${twoWay(x => x.value)}"
        />
        <input
            class="hex"
            :value="${twoWay(x => x.value)}"
        />
    `,
    // Would like to use LayerBaseLuminance for the values,
    // but there appears to be a timing issue with two way binding
    luminance: html<DesignTokenField>`
        <select
            :value="${twoWay(x => x.value)}"
        >
            <option value="0.95">
                Light mode
            </option>
            <option value="0.15">
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
    @observable
    designToken?: DesignTokenDefinition;

    @observable
    value: string = "";
    valueChanged(prev: string, next: string) {
        this.$emit("change", this.value);
    }

    selectTemplate() {
        if (this.designToken) {
            if (this.designToken.formControlId === FormControlId.color) {
                return tokenTemplatesByType.color;
            } else if (this.designToken.id === "layer-fill-base-luminance") {
                return tokenTemplatesByType.luminance;
            }
        }
        return tokenTemplatesByType.default;
    }
}
