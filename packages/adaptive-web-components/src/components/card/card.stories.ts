import { html, repeat } from "@microsoft/fast-element";
import type { FASTCard } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTCard>>`
    <adaptive-card
        ?disabled="${(x) => x.disabled}"
        ?interactive="${(x) => x.interactive}"
        role="${(x) => x.role}"
    >
        <div style='padding: 12px;'>
            ${(x) => x.storyContent}
        </div>
    </adaptive-card>
`;

const storyContentTemplate = html`
    <ul style="display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0;">
        ${repeat(
            (x) => x.storyItems,
            html<StoryArgs<FASTCard>>`
                ${(x) => x.template ?? storyTemplate}
            `
        )}
    </ul>
`;

export default {
    title: "Components/Card",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Pick a card",
        disabled: false,
        interactive: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        disabled: { control: "boolean" },
        interactive: { control: "boolean" },
    },
} as Meta<FASTCard>;

export const Card: Story<FASTCard> = renderComponent(storyTemplate).bind({});

export const CardInteractive = renderComponent(storyTemplate).bind({});
CardInteractive.args = {
    interactive: true,
};

export const CardInteractiveList = renderComponent(storyContentTemplate).bind({});
CardInteractiveList.args = {
    storyItems: [
        { storyContent: "Card list item 1", interactive: true, role: "listitem" },
        { storyContent: "Card list item 2", interactive: true, role: "listitem" },
        { storyContent: "Card list item 3", interactive: true, role: "listitem" },
    ],
};

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
