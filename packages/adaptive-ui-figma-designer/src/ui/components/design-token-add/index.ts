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
import { staticallyCompose } from "@microsoft/fast-foundation";
import { DesignTokenDefinition } from "@adaptive-web/adaptive-ui-designer-core";
import CheckmarkIcon from "../../assets/checkmark.svg";
import { DesignTokenField } from "../design-token-field/index.js";

DesignTokenField;

const template = html<DesignTokenAdd>`
    <select @change="${(x, c) => x.selectHandler(c)}" ${ref("list")}>
        <option selected value="-">Add design token override...</option>
        ${repeat(
            x => x.designTokens,
            html<DesignTokenDefinition, DesignTokenAdd>`
                <option value="${x => x.id}">
                    ${x => x.title} (${x => x.groupTitle})
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
    designTokens: DesignTokenDefinition[] = [];

    @observable
    selectedDesignToken?: DesignTokenDefinition;

    list: HTMLSelectElement;

    field: DesignTokenField;

    selectHandler(c: ExecutionContext) {
        const selectedTokenId = (c.event.target as HTMLSelectElement).value;

        if (selectedTokenId !== "-") {
            this.selectedDesignToken = this.designTokens.find((token) => {
                return token.id === selectedTokenId;
            });
            this.list.value = "-";

            if (this.field) {
                this.field.value = this.selectedDesignToken.token.default;
            }
        }
    }

    addHandler() {
        if (this.field.value) {
            this.$emit("add", {
                definition: this.selectedDesignToken,
                value: this.field.value,
            });

            this.selectedDesignToken = undefined;
        }
    }
}
