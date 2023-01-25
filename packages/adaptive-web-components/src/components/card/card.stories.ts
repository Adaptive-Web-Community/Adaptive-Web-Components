import { html } from "@microsoft/fast-element";
import type { FASTCard } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTCard>>`
    <adaptive-card>
        ${(x) => x?.content}
    </adaptive-card>
`;

export default {
    title: "Components/Card",
    args: {
        content: "Pick a card",
    },
} as Meta<FASTCard>;

export const Card: Story<FASTCard> = renderComponent(storyTemplate).bind({});

export const CardWithCustomDimensions = renderComponent(storyTemplate).bind({});
CardWithCustomDimensions.decorators = [
    (Story: () => FASTCard) => {
        const renderedStory = Story() as FASTCard;
        renderedStory.style.setProperty("--card-height", "400px");
        renderedStory.style.setProperty("--card-width", "500px");
        renderedStory.style.setProperty("padding", "20px");
        return renderedStory;
    },
];
