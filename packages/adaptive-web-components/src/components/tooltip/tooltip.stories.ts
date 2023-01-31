import { html, repeat } from "@microsoft/fast-element";
import { FASTTooltip, TooltipPlacement } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTTooltip>>`
    <adaptive-tooltip
        anchor="${(x) => x.anchor}"
        placement="${(x) => x.placement}"
        show="${(x) => x.show}"
    >
        ${(x) => x.storyContent}
    </adaptive-tooltip>
`;

export default {
    title: "Components/Tooltip",
    args: {
        storyContent: "Tooltip",
        anchor: "anchor-default",
    },
    argTypes: {
        anchor: { control: "text" },
        placement: {
            control: "select",
            options: Object.values(TooltipPlacement),
        },
        show: { control: "select", options: [undefined, true, false] },
    },
} as Meta<FASTTooltip>;

export const Tooltip: Story<FASTTooltip> = renderComponent(html<StoryArgs<FASTTooltip>>`
    <div>
        <adaptive-button id="${(x) => x.anchor}">Hover or focus me</adaptive-button>
        ${storyTemplate}
    </div>
`).bind({});

export const TooltipPlacements: Story<FASTTooltip> = renderComponent(
    html<StoryArgs<FASTTooltip>>`
        <adaptive-card
            id="${(x) => x.anchor}"
            style="height: 50%; left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 50%;"
        >
            ${repeat((x) => x.storyItems, storyTemplate)}
        </adaptive-card>
    `
).bind({});
TooltipPlacements.args = {
    anchor: "placement-container",
    storyItems: Object.values(TooltipPlacement).map((placement) => ({
        anchor: "placement-container",
        placement,
        show: true,
        storyContent: placement,
    })),
};
TooltipPlacements.parameters = { controls: { include: [] } };
