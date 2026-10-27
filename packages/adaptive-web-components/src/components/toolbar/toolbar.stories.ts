import { html } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Toolbar as ToolbarElement } from "./toolbar.js";

const storyTemplate = html<StoryArgs<ToolbarElement>>`
    <adaptive-toolbar
        orientation="${(x) => x.orientation}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-toolbar>
`;

export default {
    title: "Components/Toolbar",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: html`
            <span slot="label">Formatting</span>
            <button slot="start">Start Slot Button</button>
            <adaptive-button>Adaptive Button</adaptive-button>
            <adaptive-anchor href="javascript:void;">Adaptive Anchor</adaptive-anchor>
            <button>Button</button>
            <select>
                <option>Option 1</option>
                <option>Second option</option>
                <option>Option 3</option>
            </select>
            <label for="check-1">
                <input type="checkbox" name="checkbox" id="check-1" />
                Checkbox 1
            </label>
            <label for="check-2">
                <input type="checkbox" name="checkbox" id="check-2" />
                Checkbox 2
            </label>
            <label for="check-3">
                <input type="checkbox" name="checkbox" id="check-3" />
                Checkbox 3
            </label>
            <input type="text" name="text" id="text-input" />
            <button slot="end">End Slot Button</button>
        `,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        orientation: { control: "radio", options: Object.values(Orientation) },
    },
} as Meta<ToolbarElement>;

export const Toolbar = renderComponent(storyTemplate).bind({});
