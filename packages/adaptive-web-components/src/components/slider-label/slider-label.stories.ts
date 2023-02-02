import { html } from "@microsoft/fast-element";
import type { FASTSliderLabel } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTSliderLabel>>`
    <adaptive-slider-label
        ?disabled="${(x) => x.disabled}"
        ?hide-mark="${(x) => x.hideMark}"
        position="${(x) => x.position}"
    >
        ${(x) => x.storyContent}
    </adaptive-slider-label>
`;

export default {
    title: "Components/Slider/Slider Label",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Slider label",
        disabled: false,
        hideMark: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        disabled: { control: "boolean" },
        hideMark: { control: "boolean" },
        position: { control: "number" },
    },
} as Meta<FASTSliderLabel>;

export const SliderLabel: Story<FASTSliderLabel> = renderComponent(storyTemplate).bind({});
