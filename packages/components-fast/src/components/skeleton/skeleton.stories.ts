import { css, type FASTElement, html, repeat, Updates } from "@microsoft/fast-element";
import { SkeletonShape } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as cardStoryTemplate } from "../card/card.stories.js";
import type { Skeleton as SkeletonElement } from "./skeleton.js";

const storyTemplate = html<StoryArgs<SkeletonElement>>`
    <adaptive-skeleton
        pattern="${(x) => x.pattern}"
        shape="${(x) => x.shape}"
        ?shimmer="${(x) => x.shimmer}"
    >
        ${(x) => x.storyContent}
    </adaptive-skeleton>
`;

export default {
    title: "Components/Skeleton",
    args: {
        shimmer: true,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        pattern: { control: "text" },
        shape: { control: "radio", options: Object.values(SkeletonShape) },
        shimmer: { control: "boolean" },
    },
} as Meta<SkeletonElement>;

export const Skeleton: Story<SkeletonElement> = renderComponent(storyTemplate).bind({});
Skeleton.decorators = [
    (Story) => {
        const renderedStory = Story() as SkeletonElement;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host(adaptive-skeleton) {
                    height: 100px;
                    width: 100px;
                }
            `);
        });

        return renderedStory;
    },
];

export const SkeletonCardExample: Story<SkeletonElement> = renderComponent(cardStoryTemplate).bind({});
SkeletonCardExample.args = {
    storyContent: html`
        ${repeat((x) => x.storyItems, storyTemplate)}
    `,
    storyItems: [
        { shape: SkeletonShape.circle, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
        { shape: SkeletonShape.rect, shimmer: true },
    ],
};
SkeletonCardExample.parameters = { controls: { include: [] } };
SkeletonCardExample.decorators = [
    (Story) => {
        const renderedStory = Story() as FASTElement;

        Updates.enqueue(() => {
            renderedStory.$fastController.addStyles(css`
                :host(adaptive-card) {
                    height: auto;
                    width: 300px;
                    padding: 20px;
                }

                ::slotted(adaptive-skeleton[shape="circle"]) {
                    height: 50px;
                    width: 50px;
                }

                ::slotted(adaptive-skeleton[shape="rect"]:not(:first-of-type)) {
                    margin: 10px 0;
                    height: 10px;
                    border-radius: 12px;
                }

                ::slotted(adaptive-skeleton[shape="rect"]:last-of-type) {
                    margin: 20px 0 0;
                    height: 30px;
                    width: 75px;
                }
            `);
        });

        return renderedStory;
    },
];
