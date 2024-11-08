import {
    css,
    customElement,
    ExecutionContext,
    FASTElement,
    html,
    observable,
    ref,
    repeat,
} from "@microsoft/fast-element";
import { DesignToken, staticallyCompose } from "@microsoft/fast-foundation";
import CheckmarkIcon from "../../assets/checkmark.svg";
import { DesignTokenField } from "../design-token-field/index.js";
import { UIDesignTokenValue } from "../../ui-controller-tokens.js";
import { designTokenTitle } from "../../util.js";

DesignTokenField;

export type AddEventDetail = UIDesignTokenValue;

const template = html<DesignTokenAdd>`
    <select @change="${(x, c) => x.selectHandler(c)}" ${ref("list")}>
        <option selected value="-">Add design token override...</option>
        ${repeat(
            x => x.designTokens,
            html<DesignToken<any>, DesignTokenAdd>`
                <option value="${x => x.name}">
                    ${x => designTokenTitle(x)}
                </option>
            `
        )}
    </select>
    <div class="add-form" ?hidden="${x => !x.selectedDesignToken}">
        <designer-design-token-field
            :designToken=${x => x.selectedDesignToken}
            ${ref("field")}
        ></designer-design-token-field>
        <adaptive-button
            appearance="stealth"
            aria-label="Add"
            title="Add"
            @click="${(x, c) => x.addHandler()}"
        >
            ${staticallyCompose(CheckmarkIcon)}
        </adaptive-button>
    </div>
`;

const styles = css`
    select {
        height: 32px;
        width: 100%;
    }

    .add-form {
        display: flex;
        gap: 8px;
        padding: 4px 0;
    }

    .add-form[hidden] {
        display: none;
    }
`;

@customElement({
    name: "designer-design-token-add",
    template,
    styles,
})
export class DesignTokenAdd extends FASTElement {
    @observable
    designTokens: DesignToken<any>[] = [];

    @observable
    selectedDesignToken?: DesignToken<any>;

    list?: HTMLSelectElement;

    field?: DesignTokenField;

    selectHandler(c: ExecutionContext) {
        const selectedTokenName = (c.event.target as unknown as HTMLSelectElement).value;

        if (selectedTokenName !== "-") {
            this.selectedDesignToken = this.designTokens.find((token) => {
                return token.name === selectedTokenName;
            });
            if (this.list) {
                this.list.value = "-";
            }

            if (this.field) {
                this.field.value = "" + this.selectedDesignToken?.default;
            }
        }
    }

    addHandler() {
        if (this.field?.value) {
            this.$emit("add", {
                token: this.selectedDesignToken,
                value: this.field.value,
            } as AddEventDetail);

            this.selectedDesignToken = undefined;
        }
    }
}
