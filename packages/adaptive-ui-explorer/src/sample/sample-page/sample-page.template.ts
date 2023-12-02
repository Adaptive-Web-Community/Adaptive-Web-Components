import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { staticallyCompose } from "@microsoft/fast-foundation";
import { downloadIcon, playIcon } from "../assets.js";
import { SamplePage } from "./sample-page.js";

export function samplePageTemplate<T extends SamplePage>(): ElementViewTemplate<T> {
    return html<T>`
        <adaptive-card>
            <div class="image-container">
                <adaptive-badge fill="primary" color="primary" class="badge">
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
                <adaptive-menu-item role="menuitem" aria-label="Example menu item">
                    Menu item 1
                </adaptive-menu-item>
                <adaptive-menu-item role="menuitem" aria-label="Example menu item">
                    Menu item 2
                </adaptive-menu-item>
                <adaptive-menu-item role="menuitem" aria-label="Example menu item">
                    Menu item 3
                </adaptive-menu-item>
                <adaptive-divider></adaptive-divider>
                <adaptive-menu-item role="menuitem" aria-label="Example menu item">
                    Menu item 4
                </adaptive-menu-item>
            </adaptive-menu>
            <div class="control-container">
                <adaptive-radio-group
                    class="example-radios"
                    name="example radio group"
                    orientation="vertical"
                    value="radio2"
                >
                    <adaptive-radio value="radio1" aria-label="Example radio 1">Radio 1</adaptive-radio>
                    <adaptive-radio value="radio2" aria-label="Example radio 2">Radio 2</adaptive-radio>
                </adaptive-radio-group>
                <div class="control-container-grid">
                    <adaptive-switch aria-label="Example switch">Switch</adaptive-switch>
                    <adaptive-checkbox class="checkbox" aria-label="Example checkbox">
                        Checkbox
                    </adaptive-checkbox>
                </div>
            </div>
            <adaptive-text-field
                placeholder="Text field"
                aria-label="Example text field"
            >Text field</adaptive-text-field>
            <div class="control-container-2">
                <adaptive-slider aria-label="Example slider"></adaptive-slider>
                <adaptive-flipper></adaptive-flipper>
                <adaptive-flipper disabled></adaptive-flipper>
            </div>
            <div class="control-container">
                <adaptive-button appearance="accent" aria-label="Example 'download' button">
                    Button
                    <span slot="start">
                        ${staticallyCompose(downloadIcon)}
                    </span>
                </adaptive-button>
                <adaptive-button appearance="neutral" aria-label="Example 'play' button">
                    Button
                    <span slot="start">
                        ${staticallyCompose(playIcon)}
                    </span>
                </adaptive-button>
            </div>
        </div>
    `;
}
