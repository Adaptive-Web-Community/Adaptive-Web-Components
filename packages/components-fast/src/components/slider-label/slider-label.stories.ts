import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { SliderLabel as SliderLabelElement } from "./slider-label.js";

export const storyTemplate = html<StoryArgs<SliderLabelElement>>`
    <adaptive-slider-label
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
        hideMark: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        hideMark: { control: "boolean" },
        position: { control: "number" },
    },
} as Meta<SliderLabelElement>;

export const SliderLabel: Story<SliderLabelElement> = renderComponent(storyTemplate).bind({});
