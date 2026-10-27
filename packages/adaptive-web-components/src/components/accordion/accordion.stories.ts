import { html } from "@microsoft/fast-element";
import { AccordionExpandMode } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Accordion as AccordionElement } from "./accordion.js";

const storyTemplate = html<StoryArgs<AccordionElement>>`
    <adaptive-accordion
        expand-mode="${(x) => x.expandMode}"
    >
        ${(x) => x.storyContent}
    </adaptive-accordion>
`;

export default {
    title: "Components/Accordion",
    args: {
        expandMode: AccordionExpandMode.multi,
    },
    argTypes: {
        expandMode: { control: "radio", options: Object.values(AccordionExpandMode) },
        storyContent: { table: { disable: true } },
    },
} as Meta<AccordionElement>;

export const Accordion: Story<AccordionElement> = renderComponent(storyTemplate).bind({});
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

export const AccordionWithExpandedChild: Story<AccordionElement> = renderComponent(storyTemplate).bind({});
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

export const AccordionWithSingleExpandMode: Story<AccordionElement> = renderComponent(storyTemplate).bind({});
AccordionWithSingleExpandMode.args = {
    expandMode: AccordionExpandMode.single,
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
