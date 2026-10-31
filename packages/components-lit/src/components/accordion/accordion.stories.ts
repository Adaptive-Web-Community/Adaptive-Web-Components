import { html, type TemplateResult } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { AccordionExpandMode } from "@adaptive-web/components-foundation";
import { disabledControlParameters } from "../../utilities/storybook-helpers.js";
import type { Accordion as AccordionElement } from "./accordion.js";

type AccordionArgs = Partial<Pick<AccordionElement, "expandMode">> & {
    storyContent: TemplateResult;
};

export default {
    title: "Components/Accordion",
    component: "adaptive-accordion",
    render: ({ expandMode, storyContent }) => html`
        <adaptive-accordion expand-mode="${expandMode ?? AccordionExpandMode.multi}">
            ${storyContent}
        </adaptive-accordion>
    `,
    args: {
        expandMode: AccordionExpandMode.multi,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        expandMode: { control: "radio", options: Object.values(AccordionExpandMode) },
    },
} satisfies Meta<AccordionArgs>;

type Story = StoryObj<AccordionArgs>;

export const Accordion: Story = {
    args: {
        storyContent: html`
            <adaptive-accordion-item>
                <span slot="heading">Accordion Item 1 Heading</span>
                Accordion Item 1 Content
            </adaptive-accordion-item>
            <adaptive-accordion-item>
                <span slot="heading">Accordion Item 2 Heading</span>
                <adaptive-button>A button as content</adaptive-button>
            </adaptive-accordion-item>
            <adaptive-accordion-item disabled>
                <span slot="heading">Accordion Item 3 Heading</span>
                Accordion Item 3 Content
            </adaptive-accordion-item>
        `,
    },
};

export const AccordionWithExpandedChild: Story = {
    args: {
        storyContent: html`
            <adaptive-accordion-item>
                <span slot="heading">Accordion Item 1 Heading</span>
                Accordion Item 1 Content
            </adaptive-accordion-item>
            <adaptive-accordion-item>
                <span slot="heading">Accordion Item 2 Heading</span>
                <adaptive-button>A button as content</adaptive-button>
            </adaptive-accordion-item>
            <adaptive-accordion-item expanded>
                <span slot="heading">Accordion Item 3 Heading</span>
                Accordion Item 3 Content
            </adaptive-accordion-item>
        `,
    },
};

export const AccordionWithSingleExpandMode: Story = {
    parameters: disabledControlParameters,
    args: {
        expandMode: AccordionExpandMode.single,
        storyContent: html`
            <adaptive-accordion-item expanded disabled>
                <span slot="heading">Accordion Item 1 Heading</span>
                Accordion Item 1 Content
            </adaptive-accordion-item>
            <adaptive-accordion-item expanded>
                <span slot="heading">Accordion Item 2 Heading</span>
                <adaptive-button>A button as content</adaptive-button>
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
    },
};
