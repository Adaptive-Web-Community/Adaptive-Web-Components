import { html } from "@microsoft/fast-element";
import type { FASTCard } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTCard>>`
    <adaptive-card>
        ${(x) => x.storyContent}
    </adaptive-card>
`;

export default {
    title: "Components/Card",
    args: {
        storyContent: "Pick a card",
    },
} as Meta<FASTCard>;

export const Card: Story<FASTCard> = renderComponent(storyTemplate).bind({});

export const CardWithCustomDimensions = renderComponent(storyTemplate).bind({});
CardWithCustomDimensions.decorators = [
    (Story: () => FASTCard) => {
        const renderedStory = Story() as FASTCard;
        renderedStory.style.setProperty("height", "400px");
        renderedStory.style.setProperty("width", "500px");
        renderedStory.style.setProperty("padding", "20px");
        return renderedStory;
    },
];

export const CardWithControls: Story<FASTCard> = renderComponent(storyTemplate).bind({});
CardWithControls.args = {
    storyContent: html`
        <adaptive-button>Test Button</adaptive-button>
    `,
};
CardWithControls.decorators = [
    (Story: () => FASTCard) => {
        const renderedStory = Story() as FASTCard;
        renderedStory.style.setProperty("height", "400px");
        renderedStory.style.setProperty("width", "500px");
        renderedStory.style.setProperty("display", "flex");
        renderedStory.style.setProperty("flex-direction", "column");
        renderedStory.style.setProperty("padding", "20px");
        return renderedStory;
    },
];