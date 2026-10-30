import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Card as CardElement } from "./card.js";

export const storyTemplate = html<StoryArgs<CardElement>>`
    <adaptive-card>
        ${(x) => x.storyContent}
    </adaptive-card>
`;

export default {
    title: "Components/Card",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Pick a card",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<CardElement>;

export const Card: Story<CardElement> = renderComponent(storyTemplate).bind({});

export const CardWithCustomDimensions = renderComponent(storyTemplate).bind({});
CardWithCustomDimensions.decorators = [
    (Story: () => CardElement) => {
        const renderedStory = Story() as CardElement;
        renderedStory.style.setProperty("height", "400px");
        renderedStory.style.setProperty("width", "500px");
        renderedStory.style.setProperty("padding", "20px");
        return renderedStory;
    },
];

export const CardWithControls: Story<CardElement> = renderComponent(storyTemplate).bind({});
CardWithControls.args = {
    storyContent: html`
        <adaptive-button>Test Button</adaptive-button>
    `,
};
CardWithControls.decorators = [
    (Story: () => CardElement) => {
        const renderedStory = Story() as CardElement;
        renderedStory.style.setProperty("height", "400px");
        renderedStory.style.setProperty("width", "500px");
        renderedStory.style.setProperty("display", "flex");
        renderedStory.style.setProperty("flex-direction", "column");
        renderedStory.style.setProperty("padding", "20px");
        return renderedStory;
    },
];
