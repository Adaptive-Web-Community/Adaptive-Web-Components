import { html } from "@microsoft/fast-element";
import {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    FASTAnchoredRegion,
    HorizontalPosition,
    VerticalPosition,
} from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTAnchoredRegion>>`
    <div style="height: 300%; width: 300%;">
        <adaptive-button id="anchor" style="transform: translate(400px, 400px);">Anchor</adaptive-button>
        <adaptive-anchored-region
            anchor="anchor"
            auto-update-mode="${(x) => x.autoUpdateMode}"
            fixed-placement="${(x) => x.fixedPlacement}"
            horizontal-default-position="${(x) => x.horizontalDefaultPosition}"
            ?horizontal-inset="${(x) => x.horizontalInset}"
            horizontal-positioning-mode="${(x) => x.horizontalPositioningMode}"
            horizontal-scaling="${(x) => x.horizontalScaling}"
            horizontal-threshold="${(x) => x.horizontalThreshold}"
            ?horizontal-viewport-lock="${(x) => x.horizontalViewportLock}"
            vertical-default-position="${(x) => x.verticalDefaultPosition}"
            ?vertical-inset="${(x) => x.verticalInset}"
            vertical-positioning-mode="${(x) => x.verticalPositioningMode}"
            vertical-scaling="${(x) => x.verticalScaling}"
            vertical-threshold="${(x) => x.verticalThreshold}"
            ?vertical-viewport-lock="${(x) => x.verticalViewportLock}"
            viewport="${(x) => x.viewport}"
        >
            ${(x) => x.storyContent}
        </adaptive-anchored-region>
    </div>
`;

export default {
    title: "Components/Anchored Region",
    args: {
        storyContent: html`
            <div style="border: solid 1px grey; background: aliceblue; padding: 20px">Anchored region content</div>
        `,
        fixedPlacement: false,
        horizontalInset: false,
        horizontalPositioningMode: AxisPositioningMode.locktodefault,
        horizontalViewportLock: false,
        verticalInset: false,
        verticalPositioningMode: AxisPositioningMode.locktodefault,
        verticalViewportLock: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        autoUpdateMode: {
            control: "select",
            options: Object.values(AutoUpdateMode),
        },
        fixedPlacement: { control: "boolean" },
        horizontalDefaultPosition: {
            control: "select",
            options: Object.values(HorizontalPosition),
        },
        horizontalInset: { control: "boolean" },
        horizontalPositioningMode: {
            control: "select",
            options: Object.values(AxisPositioningMode),
        },
        horizontalScaling: {
            control: "select",
            options: Object.values(AxisScalingMode),
        },
        horizontalThreshold: { control: "number" },
        horizontalViewportLock: { control: "boolean" },
        verticalDefaultPosition: {
            control: "select",
            options: Object.values(VerticalPosition),
        },
        verticalInset: { control: "boolean" },
        verticalPositioningMode: {
            control: "select",
            options: Object.values(AxisPositioningMode),
        },
        verticalScaling: {
            control: "select",
            options: Object.values(AxisScalingMode),
        },
        verticalThreshold: { control: "number" },
        verticalViewportLock: { control: "boolean" },
        viewport: { control: "text" },
    },
} as Meta<FASTAnchoredRegion>;

export const AnchoredRegion: Story<FASTAnchoredRegion> = renderComponent(storyTemplate).bind({});
