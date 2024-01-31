import { ElementViewTemplate, html, repeat } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way.js";
import { WcagContrastLevel } from "@adaptive-web/adaptive-ui/reference";
import { ComponentType } from "../../component-type.js";
import { ControlPane } from "./control-pane.js";

function titleCase(str: string): string {
    return str.split("").reduce((accumulated: string, value: string, index: number): string => {
        return accumulated.concat(index === 0 ? value.toUpperCase() : value);
    }, "");
}

export function controlPaneTemplate<T extends ControlPane>(): ElementViewTemplate<T> {
    return html<T>`
        <p class="title">Settings</p>

        <adaptive-radio-group
            id="componentType"
            orientation="vertical"
            :value=${twoWay((x) => x.state.componentType)}
        >
            <label slot="label">Component type</label>
            ${repeat(
                (_) => Object.keys(ComponentType),
                html<string, T>`
                    <adaptive-radio value=${(x) => x}>${(x) => titleCase(x)}</adaptive-radio>
                `
            )}
        </adaptive-radio-group>

        <div>
            <label>Neutral base color</label>
            <input
                type="color"
                value=${(x) => x.state.neutralColor}
                @change=${(x, c) =>
                    x.state.neutralColor = c.eventTarget<HTMLInputElement>().value
                }
            />
        </div>

        <adaptive-switch
            id="showOnlyLayerBackgrounds"
            :checked=${twoWay((x) => x.state.showOnlyLayerBackgrounds)}
        >Show layer backgrounds only</adaptive-switch>

        <div>
            <label>Accent base color</label>
            <input
                type="color"
                value=${(x) => x.state.accentColor}
                @change=${(x, c) =>
                    x.state.accentColor = c.eventTarget<HTMLInputElement>().value
                }
            />
        </div>

        <div>
            <label>Highlight base color</label>
            <input
                type="color"
                value=${(x) => x.state.highlightColor}
                @change=${(x, c) =>
                    x.state.highlightColor = c.eventTarget<HTMLInputElement>().value
                }
            />
        </div>

        <adaptive-radio-group
            id="wcagContrastLevel"
            orientation="vertical"
            :value=${twoWay((x) => x.state.wcagContrastLevel)}
        >
            <label slot="label">WCAG Contrast Level</label>
            ${repeat(
                (_) => Object.keys(WcagContrastLevel),
                html<string, T>`
                    <adaptive-radio value=${(x) => x}>${(x) => x.toUpperCase()}</adaptive-radio>
                `
            )}
        </adaptive-radio-group>

        <adaptive-switch
            id="disabledState"
            :checked=${twoWay((x) => x.state.disabledState)}
        >Disabled state</adaptive-switch>
    `;
}
