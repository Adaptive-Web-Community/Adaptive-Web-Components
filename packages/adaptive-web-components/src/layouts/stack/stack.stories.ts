import { html, repeat } from "@microsoft/fast-element";
import type { Stack as AdaptiveStack } from "./stack.js";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const StackAlignmentOptions = ["start","center","end","stretch"];

const storyTemplate = html<StoryArgs<AdaptiveStack>>`
    <adaptive-card style="resize: both; overflow: hidden; width: fit-content; padding: calc(var(--design-unit) * 4px);">
        <adaptive-stack
            style="width: 100%; height: 100%;"
            ?wrap=${x => x.wrap}
            spacing=${x => x.spacing}
            vertical-align=${x => x.verticalAlign}
            horizontal-align=${x => x.horizontalAlign}
            orientation=${x => x.orientation}
        >
            ${x => x.storyContent}
        </adaptive-stack>
    </adaptive-card>
`;

export default {
    title: "Layouts/Stack",
    args: {
        storyContent: html`
            ${repeat([1,2,3,4,5,6], html`
                <adaptive-card style="width: auto; height: auto; padding: calc(var(--design-unit) * 2px);">card ${x => x}</adaptive-card>
            `)}
        `,
        wrap: false,
        spacing: undefined,
        verticalAlign: 'start',
        horizontalAlign: 'start',
        orientation: 'horizontal'
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        wrap: { control: "boolean" },
        spacing: { control: "number" },
        verticalAlign: { control: "select", options: StackAlignmentOptions },
        horizontalAlign: { control: "select", options: StackAlignmentOptions },
        orientation: { control: "radio", options: ["horizontal","vertical"] }
    }
} as Meta<AdaptiveStack>;

export const Stack: Story<AdaptiveStack> = renderComponent(storyTemplate).bind({});

export const VerticalStack: Story<AdaptiveStack> = renderComponent(storyTemplate).bind({});
VerticalStack.args = {
    orientation: "vertical"
};

export const StackItemWrapping: Story<AdaptiveStack> = renderComponent(storyTemplate).bind({});
StackItemWrapping.args = {
    wrap: true
};