import { type ElementViewTemplate, html, repeat } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/two-way.js";
import { type Color, formatColor, parseColor, WcagContrastLevel } from "@adaptive-web/adaptive-ui";
import { ComponentType } from "../../component-type.js";
import type { State } from "../../state.js";
import { ControlPane } from "./control-pane.js";

// Sets a color of the state from a color input, if its value is a color.
function setColor(state: State, property: "neutralColor" | "accentColor" | "highlightColor", input: HTMLInputElement): void {
    const color: Color | undefined = parseColor(input.value);
    if (color) {
        state[property] = color;
    }
}

function titleCase(str: string): string {
    return str.split("").reduce((accumulated: string, value: string, index: number): string => {
        return accumulated.concat(index === 0 ? value.toUpperCase() : value);
    }, "");
}

// Each radio is checked by the state as well as the group's value: the value checks the radios that the group has, and is set before they
// are in it.
export function controlPaneTemplate<T extends ControlPane>(): ElementViewTemplate<T> {
    return html<T>`
        <p class="title">Settings</p>

        <adaptive-radio-group
            id="componentType"
            orientation="vertical"
            label="Component type"
            :value=${twoWay((x) => x.state.componentType)}
        >
            ${repeat(
                (_) => Object.values(ComponentType),
                html<string, T>`
                    <adaptive-radio value=${(x) => x} label=${(x) => titleCase(x)} ?checked=${(x, c) => x === c.parent.state.componentType}></adaptive-radio>
                `
            )}
        </adaptive-radio-group>

        <div>
            <label for="neutralColor">Neutral base color</label>
            <input
                id="neutralColor"
                type="color"
                value=${(x) => formatColor(x.state.neutralColor)}
                @change=${(x, c) => setColor(x.state, "neutralColor", c.eventTarget<HTMLInputElement>())}
            />
        </div>

        <adaptive-switch
            id="neutralAsOverlay"
            :checked=${twoWay((x) => x.state.neutralAsOverlay)}
            label="Neutral as overlay"
        ></adaptive-switch>

        <adaptive-switch
            id="showOnlyLayerBackgrounds"
            :checked=${twoWay((x) => x.state.showOnlyLayerBackgrounds)}
            label="Show layer backgrounds only"
        ></adaptive-switch>

        <div>
            <label for="accentColor">Accent base color</label>
            <input
                id="accentColor"
                type="color"
                value=${(x) => formatColor(x.state.accentColor)}
                @change=${(x, c) => setColor(x.state, "accentColor", c.eventTarget<HTMLInputElement>())}
            />
        </div>

        <div>
            <label for="highlightColor">Highlight base color</label>
            <input
                id="highlightColor"
                type="color"
                value=${(x) => formatColor(x.state.highlightColor)}
                @change=${(x, c) => setColor(x.state, "highlightColor", c.eventTarget<HTMLInputElement>())}
            />
        </div>

        <adaptive-radio-group
            id="wcagContrastLevel"
            orientation="vertical"
            label="WCAG Contrast Level"
            :value=${twoWay((x) => x.state.wcagContrastLevel)}
        >
            ${repeat(
                (_) => Object.values(WcagContrastLevel),
                html<string, T>`
                    <adaptive-radio value=${(x) => x} label=${(x) => x.toUpperCase()} ?checked=${(x, c) => x === c.parent.state.wcagContrastLevel}></adaptive-radio>
                `
            )}
        </adaptive-radio-group>

        <adaptive-switch
            id="disabledState"
            :checked=${twoWay((x) => x.state.disabledState)}
            label="Disabled state"
        ></adaptive-switch>

        <adaptive-switch
            id="showSwatches"
            :checked=${twoWay((x) => x.state.showSwatches)}
            label="Show swatches"
        ></adaptive-switch>

        <div>
            <label for="type-scale-base-size-px">Type scale base size (px)</label>
            <input
                id="type-scale-base-size-px"
                type="number"
                min="8"
                max="32"
                step="1"
                value=${(x) => x.state.typeScaleBaseSize}
                @input=${(x, c) =>
                    x.state.typeScaleBaseSize = parseFloat(c.eventTarget<HTMLInputElement>().value)
                }
            />
        </div>

        <div>
            <label for="type-scale-multiplier">Type scale multiplier</label>
            <input
                id="type-scale-multiplier"
                type="number"
                min="1.0"
                max="2.0"
                step="0.01"
                value=${(x) => x.state.typeScaleMultiplier}
                @input=${(x, c) =>
                    x.state.typeScaleMultiplier = parseFloat(c.eventTarget<HTMLInputElement>().value)
                }
            />
        </div>

        <div>
            <label for="type-scale-line-height-ratio">Type scale line height ratio</label>
            <input
                id="type-scale-line-height-ratio"
                type="number"
                min="1.0"
                max="2.0"
                step="0.01"
                value=${(x) => x.state.typeScaleLineHeightRatio}
                @input=${(x, c) =>
                    x.state.typeScaleLineHeightRatio = parseFloat(c.eventTarget<HTMLInputElement>().value)
                }
            />
        </div>

        <div>
            <label for="type-scale-line-height-ratio-multiline">Type scale line height ratio (multiline)</label>
            <input
                id="type-scale-line-height-ratio-multiline"
                type="number"
                min="1.0"
                max="2.0"
                step="0.01"
                value=${(x) => x.state.typeScaleLineHeightMultilineRatio}
                @input=${(x, c) =>
                    x.state.typeScaleLineHeightMultilineRatio = parseFloat(c.eventTarget<HTMLInputElement>().value)
                }
            />
        </div>

        <div>
            <label for="type-scale-line-height-snap-px">Type scale line height snap (px)</label>
            <input
                id="type-scale-line-height-snap-px"
                type="number"
                min="1"
                max="10"
                step="1"
                value=${(x) => x.state.typeScaleLineHeightSnap}
                @input=${(x, c) =>
                    x.state.typeScaleLineHeightSnap = parseFloat(c.eventTarget<HTMLInputElement>().value)
                }
            />
        </div>

        <adaptive-switch
            id="multiline"
            :checked=${twoWay((x) => x.state.multiline)}
            label="Multiline typography"
        ></adaptive-switch>
    `;
}
