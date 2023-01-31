import { html } from "@microsoft/fast-element";
import type { FASTAccordion } from "@microsoft/fast-foundation";
import { AccordionExpandMode } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTAccordion>>`
    <adaptive-accordion
        expand-mode="${(x) => x.expandmode}"
    >
        ${(x) => x.storyContent}
    </adaptive-accordion>
`;

export default {
    title: "Components/Accordion",
    args: {
        expandmode: AccordionExpandMode.multi,
        startSlot: false,
        endSlot: false,
    },
    argTypes: {
        expandmode: { control: "radio", options: Object.values(AccordionExpandMode) },
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTAccordion>;

export const Accordion: Story<FASTAccordion> = renderComponent(storyTemplate).bind({});
Accordion.args = {
    storyContent: html`
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 1 Heading</span>
            Accordion Item 1 Content
        </adaptive-accordion-item>
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 2 Heading</span>
            <adaptive-checkbox>A checkbox as content</adaptive-checkbox>
        </adaptive-accordion-item>
        <adaptive-accordion-item disabled>
            <span slot="heading">Accordion Item 3 Heading</span>
            Accordion Item 3 Content
        </adaptive-accordion-item>
    `,
};

export const AccordionWithExpandedChild: Story<FASTAccordion> = renderComponent(storyTemplate).bind({});
AccordionWithExpandedChild.args = {
    storyContent: html`
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 1 Heading</span>
            Accordion Item 1 Content
        </adaptive-accordion-item>
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 2 Heading</span>
            <adaptive-checkbox>A checkbox as content</adaptive-checkbox>
        </adaptive-accordion-item>
        <adaptive-accordion-item expanded>
            <span slot="heading">Accordion Item 3 Heading</span>
            Accordion Item 3 Content
        </adaptive-accordion-item>
    `,
};

export const AccordionWithSingleExpandMode: Story<FASTAccordion> = renderComponent(storyTemplate).bind({});
AccordionWithSingleExpandMode.args = {
    expandmode: "single",
    storyContent: html`
        <adaptive-accordion-item expanded disabled>
            <span slot="heading">Accordion Item 1 Heading</span>
            Accordion Item 1 Content
        </adaptive-accordion-item>
        <adaptive-accordion-item expanded>
            <span slot="heading">Accordion Item 2 Heading</span>
            <adaptive-checkbox>A checkbox as content</adaptive-checkbox>
        </adaptive-accordion-item>
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 3 Heading</span>
            Accordion Item 3 Content
        </adaptive-accordion-item>
        <adaptive-accordion-item>
            <span slot="heading">Accordion Item 4 Heading</span>
            Accordion Item 4 Content
        </adaptive-accordion-item>
    `,
};
