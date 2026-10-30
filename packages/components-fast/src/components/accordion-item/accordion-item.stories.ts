import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { AccordionItem as AccordionItemElement } from "./accordion-item.js";

const storyTemplate = html<StoryArgs<AccordionItemElement>>`
    <adaptive-accordion-item
        ?expanded="${(x) => x.expanded}"
        heading-level="${(x) => x.headingLevel}"
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
        headingLevel: { control: { type: "number", min: 1, max: 6 } },
        id: { control: "text" },
    },
} as Meta<AccordionItemElement>;

export const AccordionItem: Story<AccordionItemElement> = renderComponent(storyTemplate).bind({});
AccordionItem.args = {
    storyContent: html`
        <span slot="heading">Accordion Item Heading</span>
        Accordion Item Content
    `,
};
