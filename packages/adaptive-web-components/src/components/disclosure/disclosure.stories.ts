import { html } from "@microsoft/fast-element";
import { FASTDisclosure } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTDisclosure>>`
    <adaptive-disclosure
        ?expanded="${(x) => x.expanded}"
        summary="${(x) => x.summary}"
    >
        ${(x) => x.storyContent}
    </adaptive-disclosure>
`;

export default {
    title: "Components/Disclosure",
    args: {
        expanded: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        expanded: { control: "boolean" },
        summary: { control: "text" },
    },
} as Meta<FASTDisclosure>;

export const Disclosure: Story<FASTDisclosure> = renderComponent(storyTemplate).bind({});
Disclosure.args = {
    storyContent: html`
        Created by writer Gardner Fox and artist Harry Lampert, the original Flash first appeared in Flash Comics #1
        (cover date January 1940/release month November 1939). Nicknamed the "Scarlet Speedster", all incarnations
        of the Flash possess "super speed", which includes the ability to run, move, and think extremely fast, use
        superhuman reflexes, and seemingly violate certain laws of physics.
    `,
    summary: "More about Flash",
};
