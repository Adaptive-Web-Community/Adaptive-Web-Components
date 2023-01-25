import { html } from "@microsoft/fast-element";
import type { FASTToolbar } from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, StoryArgs } from "../../utilities/storybook-helpers.js";

const componentTemplate = html<StoryArgs<FASTToolbar>>`
    <adaptive-toolbar
        orientation="${(x) => x.orientation}"
    >
        ${(x) => x.content}
    </adaptive-toolbar>
`;

export default {
    title: "Components/Toolbar",
    args: {
        content: html`
            <button slot="start">Start Slot Button</button>
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
        orientation: Orientation.horizontal,
    },
    argTypes: {
        content: { table: { disable: true } },
        orientation: { options: Object.values(Orientation), control: "radio" },
    },
} as Meta<FASTToolbar>;

export const Toolbar = renderComponent(componentTemplate).bind({});
