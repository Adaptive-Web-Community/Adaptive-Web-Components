import { ElementStylesRenderer, Interactivity } from "@adaptive-web/adaptive-ui";
import type { Styles } from "@adaptive-web/adaptive-ui";
import { cornerRadiusControl, densityControl, typeRampBaseFontSize } from "@adaptive-web/adaptive-ui/reference";
import { componentBaseStyles } from "@adaptive-web/adaptive-web-components";
import {
    attr,
    css,
    customElement,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";

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
        border-radius: ${cornerRadiusControl};
        padding: ${densityControl.padding};
        font-size: ${typeRampBaseFontSize};
        cursor: pointer;
    }
`;

@customElement({
    name: "app-adaptive-component",
    template: template(),
    styles
})
export class AdaptiveComponent extends FASTElement {
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    @observable
    public styles?: Styles;
    protected stylesChanged(prev: Styles, next: Styles) {
        if (prev) {
            this.$fastController.removeStyles(this._addedStyles);
        }
        if (next) {
            this._addedStyles = new ElementStylesRenderer(next).render({}, Interactivity.disabledAttribute);
            this.$fastController.addStyles(this._addedStyles);
        }
    }

    // Keep track of the styles we added so we can remove them without recreating.
    private _addedStyles?: ElementStyles;
}
