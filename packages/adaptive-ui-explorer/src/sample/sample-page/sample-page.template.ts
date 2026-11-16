import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { staticallyCompose } from "@adaptive-web/components-fast";
import { downloadIcon, playIcon } from "../assets.js";
import { SamplePage } from "./sample-page.js";

export function samplePageTemplate<T extends SamplePage>(): ElementViewTemplate<T> {
    return html<T>`
        <adaptive-card>
            <div class="image-container">
                <adaptive-badge class="badge">
                    Badge
                </adaptive-badge>
            </div>
            <div class="text-container">
                <h3>Example card</h3>
                <p>
                    At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a
                    tortor. Felis orci tellus netus risus et ultricies augue aliquet.
                    Suscipit mattis mus amet nibh...
                </p>
                <adaptive-divider></adaptive-divider>
                <div class="sample-control">
                    <span class="sample-control-icon"></span>
                    <span class="sample-control-text">Label</span>
                </div>
            </div>
        </adaptive-card>
        <div class="preview-controls">
            <adaptive-progress aria-label="Example progress bar"></adaptive-progress>
            <adaptive-menu aria-label="Example menu">
                <adaptive-menu-item>
                    Menu item 1
                </adaptive-menu-item>
                <adaptive-menu-item>
                    Menu item 2
                </adaptive-menu-item>
                <adaptive-menu-item>
                    Menu item 3
                </adaptive-menu-item>
                <adaptive-divider></adaptive-divider>
                <adaptive-menu-item>
                    Menu item 4
                </adaptive-menu-item>
            </adaptive-menu>
            <div class="control-container">
                <adaptive-radio-group
                    class="example-radios"
                    name="example radio group"
                    label="Example radios"
                    hide-label
                    orientation="vertical"
                    value="radio2"
                >
                    <adaptive-radio value="radio1" label="Radio 1"></adaptive-radio>
                    <adaptive-radio value="radio2" label="Radio 2"></adaptive-radio>
                </adaptive-radio-group>
                <div class="control-container-grid">
                    <adaptive-switch label="Switch"></adaptive-switch>
                    <adaptive-checkbox class="checkbox" label="Checkbox"></adaptive-checkbox>
                </div>
            </div>
            <adaptive-text-field
                placeholder="Text field"
                label="Text field"
            ></adaptive-text-field>
            <div class="control-container-2">
                <adaptive-slider label="Example slider" hide-label></adaptive-slider>
            </div>
            <div class="control-container">
                <adaptive-button>
                    Button
                    <span slot="start">
                        ${staticallyCompose(downloadIcon)}
                    </span>
                </adaptive-button>
                <adaptive-button>
                    Button
                    <span slot="start">
                        ${staticallyCompose(playIcon)}
                    </span>
                </adaptive-button>
            </div>
        </div>
    `;
}
