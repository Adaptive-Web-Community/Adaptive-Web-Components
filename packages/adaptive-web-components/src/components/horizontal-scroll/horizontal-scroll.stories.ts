import { css, html, repeat, Updates } from "@microsoft/fast-element";
import { FASTHorizontalScroll, HorizontalScrollView, ScrollEasing } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as cardStoryTemplate } from "../card/card.stories.js";

const storyTemplate = html<StoryArgs<FASTHorizontalScroll>>`
    <adaptive-horizontal-scroll
        speed="${(x) => x.speed}"
        duration="${(x) => x.duration}"
        easing="${(x) => x.easing}"
        flippers-hidden-from-at="${(x) => x.flippersHiddenFromAT}"
        view="${(x) => x.view}"
    >
        ${(x) => x.storyContent}
    </adaptive-horizontal-scroll>
`;

export default {
    title: "Components/Horizontal Scroll",
    args: {
        flippersHiddenFromAT: false,
        storyContent: html` ${repeat((x) => x.storyItems, cardStoryTemplate)} `,
        storyItems: new Array(16).fill(null).map((_, i) => ({
            storyContent: html`
                <div>Card ${i + 1}</div>
                <adaptive-button>button</adaptive-button>
            `,
        })),
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        duration: { control: "text" },
        easing: { control: "text", options: Object.values(ScrollEasing) },
        flippersHiddenFromAT: { control: "boolean" },
        speed: { control: { type: "number", min: 0 } },
        view: { control: "radio", options: Object.values(HorizontalScrollView) },
    },
    decorators: [
        (Story) => {
            const renderedStory = Story() as FASTHorizontalScroll;

            Updates.enqueue(() => {
                renderedStory.$fastController.addStyles(css`
                    ::slotted(adaptive-card) {
                        color: var(--neutral-foreground-rest);
                        height: 200px;
                        width: 120px;
                    }

                    :host {
                        max-width: 620px;
                        margin: 20px;
                    }
                `);
            });

            return renderedStory;
        },
    ],
} as Meta<FASTHorizontalScroll>;

export const HorizontalScroll: Story<FASTHorizontalScroll> = renderComponent(storyTemplate).bind({});
