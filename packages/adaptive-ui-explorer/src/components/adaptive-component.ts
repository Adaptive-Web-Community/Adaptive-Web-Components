import { type ComponentAnatomy, type ComponentConditions, type ComponentParts, Interactivity, type TreatmentRef } from "@adaptive-web/adaptive-ui";
import { AdaptiveDesignSystem, componentBaseStyles } from "@adaptive-web/components-fast";
import {
    attr,
    css,
    customElement,
    type ElementStyles,
    type ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { properties } from "../library.js";

function template<T extends AdaptiveComponent>(): ElementViewTemplate<T> {
    return html<T>`
        <template tabindex="0">
            <span class="content" part="content">
                <slot></slot>
            </span>
        </template>
    `;
}

const styles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        align-items: center;
        justify-items: start;
        border-radius: ${properties.shape.cornerRadius.default.var};
        padding: ${properties.density.control.vertical.padding.var} ${properties.density.control.horizontal.padding.var};
        font-size: ${properties.typography.ramp.default.fontSize.base.var};
        cursor: pointer;
    }
`;

// An element that has the states of a treatment, and is disabled by its attribute.
const anatomy: ComponentAnatomy<ComponentConditions, ComponentParts> = {
    conditions: {},
    parts: {},
    interactivity: Interactivity.disabledAttribute,
};

/**
 * An element styled by a treatment, which the design system renders.
 */
@customElement({
    name: "app-adaptive-component",
    template: template(),
    styles
})
export class AdaptiveComponent extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    @observable
    public treatment?: TreatmentRef;
    protected treatmentChanged(_prev: TreatmentRef | undefined, next: TreatmentRef | undefined) {
        if (this._addedStyles) {
            this.$fastController.removeStyles(this._addedStyles);
        }
        this._addedStyles = next ? AdaptiveDesignSystem.assembleStyles([], anatomy, { styleRules: [{ treatments: [next] }] }) : undefined;
        this.$fastController.addStyles(this._addedStyles);
    }

    // Keep track of the styles we added so we can remove them without recreating.
    private _addedStyles?: ElementStyles;
}
