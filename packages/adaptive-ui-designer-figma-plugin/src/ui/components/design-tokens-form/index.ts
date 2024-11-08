import {
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import { DesignToken, staticallyCompose } from "@microsoft/fast-foundation";
import SubtractIcon from "../../assets/subtract.svg";
import type { UIDesignTokenValue } from "../../ui-controller-tokens.js";
import { ChangeEventDetail, DesignTokenField } from "../design-token-field/index.js";

DesignTokenField;

export type TokenChangeEventDetail = UIDesignTokenValue;
export type DetachEventDetail = DesignToken<any>;

const template = html<DesignTokensForm>`
    <ul>
        ${repeat(
            x => x.designTokens,
            html<UIDesignTokenValue, DesignTokensForm>`
                <li>
                    <designer-design-token-field
                        :designToken=${x => x.token}
                        :value=${x => x.value}
                        @change="${(x, c) =>
                            c.parent.changeHandler(x, (c.event as CustomEvent).detail as ChangeEventDetail)}"
                    ></designer-design-token-field>
                    <adaptive-button
                        appearance="stealth"
                        aria-label="Remove design token"
                        title="Remove design token"
                        @click="${(x, c) => c.parent.detachHandler(x)}"
                    >
                        ${staticallyCompose(SubtractIcon)}
                    </adaptive-button>
                    ${when(
                        x => x.multipleValues,
                        html<UIDesignTokenValue>`
                            <span class="values">${x => x.multipleValues}</span>
                        `
                    )}
                </li>
            `
        )}
    </ul>
`;

const styles = css`
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        gap: 8px;
    }
`;

@customElement({
    name: "designer-design-tokens-form",
    template,
    styles,
})
export class DesignTokensForm extends FASTElement {
    @observable
    designTokens: UIDesignTokenValue[] = [];

    changeHandler(token: UIDesignTokenValue, value: string) {
        token.value = value;
        this.$emit("tokenChange", token as TokenChangeEventDetail);
    }

    detachHandler(token: UIDesignTokenValue) {
        // Remove the item from the list
        let detachIndex: number = -1;
        this.designTokens.find((curToken, index) => {
            detachIndex = index;
            return curToken === token;
        });
        this.designTokens.splice(detachIndex, 1);

        this.$emit("detach", token.token as DetachEventDetail);
    }
}
