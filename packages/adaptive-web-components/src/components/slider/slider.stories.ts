import { html, repeat } from "@microsoft/fast-element";
import { FASTSlider, SliderMode } from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as sliderLabelStoryTemplate } from "../slider-label/slider-label.stories.js";

const storyTemplate = html<StoryArgs<FASTSlider>>`
    <adaptive-slider
        min="${(x) => x.min}"
        max="${(x) => x.max}"
        orientation="${(x) => x.orientation}"
        step="${(x) => x.step}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-slider>
`;

export default {
    title: "Components/Slider",
    args: {
        disabled: false,
        readOnly: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        max: { control: "number" },
        min: { control: "number" },
        mode: { control: "radio", options: Object.values(SliderMode) },
        orientation: { control: "radio", options: Object.values(Orientation) },
        readOnly: { control: "boolean" },
        step: { control: "number" },
        value: { control: "number" },
    },
} as Meta<FASTSlider>;

export const Slider: Story<FASTSlider> = renderComponent(storyTemplate).bind({});

export const SliderWithLabels: Story<FASTSlider> = Slider.bind({});
SliderWithLabels.args = {
    min: 0,
    max: 100,
    step: 10,
    storyContent: html`
        ${repeat((x) => x.storyItems, sliderLabelStoryTemplate)}
    `,
    storyItems: [
        { position: 0, storyContent: "0℃" },
        { position: 10, storyContent: "10℃" },
        { position: 90, storyContent: "90℃" },
        { position: 100, storyContent: "100℃" },
    ],
};
/*SliderWithLabels.decorators = [
    Story => {
        const renderedStory = Story() as FASTSlider;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host([orientation="horizontal"]) {
                    padding: 0 1em;
                }
            `);
        });

        return renderedStory;
    },
];*/

export const SliderVertical: Story<FASTSlider> = renderComponent(
    html<StoryArgs<FASTSlider>>`
        <div style="height: 300px;">
            ${storyTemplate}
        </div>
    `
).bind({});
SliderVertical.args = {
    orientation: Orientation.vertical,
};

export const SliderVerticalWithLabels: Story<FASTSlider> = renderComponent(
    html<StoryArgs<FASTSlider>>`
        <div style="height: 300px;">
            ${storyTemplate}
        </div>
    `
).bind({});
SliderVerticalWithLabels.args =
    Object.assign({}, SliderWithLabels.args, { orientation: Orientation.vertical });
