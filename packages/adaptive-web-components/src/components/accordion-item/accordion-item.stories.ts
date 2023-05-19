import { html } from "@microsoft/fast-element";
import { FASTAccordionItem } from "@microsoft/fast-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTAccordionItem>>`
    <adaptive-accordion-item
        ?expanded="${(x) => x.expanded}"
        heading-level="${(x) => x.headinglevel}"
        id="${(x) => x.id}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-accordion-item>
`;

export default {
    title: "Components/Accordion Item",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        expanded: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        expanded: { control: "boolean" },
        headinglevel: { control: { type: "number", min: 1, max: 6 } },
        id: { control: "text" },
    },
} as Meta<FASTAccordionItem>;

export const AccordionItem: Story<FASTAccordionItem> = renderComponent(storyTemplate).bind({});
AccordionItem.args = {
    storyContent: html`
        <span slot="heading">Accordion Item Heading</span>
        Accordion Item Content
    `,
};
