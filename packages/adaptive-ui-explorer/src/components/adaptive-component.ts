import { renderElementStyles } from "@adaptive-web/adaptive-ui";
import type { Styles } from "@adaptive-web/adaptive-ui";
import {
    css,
    customElement,
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
    :host {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        box-sizing: border-box;
        font-size: 14px;
        justify-items: start;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        cursor: pointer;
    }

`;

const params = {
    interactivitySelector: "",
    nonInteractivitySelector: "",
};

@customElement({
    name: "app-adaptive-component",
    template: template(),
    styles
})
export class AdaptiveComponent extends FASTElement {
    @observable
    public styles?: Styles;
    protected stylesChanged(prev: Styles, next: Styles) {
        console.log("stylesChanged", next);
        
        // if (prev) {
        //     prev.forEach((s) => this.$fastController.removeStyles(s));
        // }
        const elementStyles = renderElementStyles(next, params);
        elementStyles.forEach((s) => this.$fastController.addStyles(s));
    }
}
