import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as sliderLabelStoryTemplate } from "../slider-label/slider-label.stories.js";
import type { Slider as SliderElement } from "./slider.js";

const storyTemplate = html<StoryArgs<SliderElement>>`
    <adaptive-slider
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        min="${(x) => x.min}"
        max="${(x) => x.max}"
        orientation="${(x) => x.orientation}"
        step="${(x) => x.step}"
        value="${(x) => x.value}"
        ?disabled="${(x) => x.disabled}"
        ?readonly="${(x) => x.readOnly}"
    >
        ${(x) => x.storyContent}
    </adaptive-slider>
`;

export default {
    title: "Components/Slider",
    args: {
        label: "Volume",
        disabled: false,
        readOnly: false,
    },
    argTypes: {
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        max: { control: "number" },
        min: { control: "number" },
        orientation: { control: "radio", options: Object.values(Orientation) },
        readOnly: { control: "boolean" },
        step: { control: "number" },
        value: { control: "number" },
    },
} as Meta<SliderElement>;

export const Slider: Story<SliderElement> = renderComponent(storyTemplate).bind({});

export const SliderWithLabels: Story<SliderElement> = Slider.bind({});
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
        const renderedStory = Story() as SliderElement;

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

export const SliderVertical: Story<SliderElement> = renderComponent(
    html<StoryArgs<SliderElement>>`
        <div style="height: 300px;">
            ${storyTemplate}
        </div>
    `
).bind({});
SliderVertical.args = {
    orientation: Orientation.vertical,
};

export const SliderVerticalWithLabels: Story<SliderElement> = renderComponent(
    html<StoryArgs<SliderElement>>`
        <div style="height: 300px;">
            ${storyTemplate}
        </div>
    `
).bind({});
SliderVerticalWithLabels.args =
    Object.assign({}, SliderWithLabels.args, { orientation: Orientation.vertical });
