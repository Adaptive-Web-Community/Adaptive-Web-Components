import { html, repeat } from "@microsoft/fast-element";
import { TooltipPlacement } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Tooltip as TooltipElement } from "./tooltip.js";

const storyTemplate = html<StoryArgs<TooltipElement>>`
    <adaptive-tooltip
        anchor="${(x) => x.anchor}"
        placement="${(x) => x.placement}"
        delay="${(x) => x.delay}"
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
        delay: { control: "number" },
    },
} as Meta<TooltipElement>;

export const Tooltip: Story<TooltipElement> = renderComponent(html<StoryArgs<TooltipElement>>`
    <div>
        <adaptive-button id="${(x) => x.anchor}">Hover or focus me</adaptive-button>
        ${storyTemplate}
    </div>
`).bind({});

export const TooltipPlacements: Story<TooltipElement> = renderComponent(
    html<StoryArgs<TooltipElement>>`
        <div style="left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%);">
            <adaptive-button id="${(x) => x.anchor}">Hover or focus me to show every placement</adaptive-button>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
TooltipPlacements.args = {
    anchor: "placement-container",
    storyItems: Object.values(TooltipPlacement).map((placement) => ({
        anchor: "placement-container",
        placement,
        storyContent: placement,
    })),
};
TooltipPlacements.parameters = { controls: { include: [] } };
