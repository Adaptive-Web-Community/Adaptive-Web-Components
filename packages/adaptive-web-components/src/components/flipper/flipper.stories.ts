import { html } from "@microsoft/fast-element";
import { FlipperDirection } from "@microsoft/fast-foundation";
import type { FASTFlipper } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTFlipper>>`
    <adaptive-flipper
        direction="${x => x.direction}"
        ?disabled="${x => x.disabled}"
        :hiddenFromAT="${x => x.hiddenFromAT}"
    ></adaptive-flipper>
`;

export default {
    title: "Components/Flipper",
    args: {
        disabled: false,
        hiddenFromAT: true,
    },
    argTypes: {
        direction: { control: "radio", options: Object.values(FlipperDirection) },
        disabled: { control: "boolean" },
        hiddenFromAT: { control: "boolean" },
    },
} as Meta<FASTFlipper>;

export const Flipper: Story<FASTFlipper> = renderComponent(storyTemplate).bind({});
