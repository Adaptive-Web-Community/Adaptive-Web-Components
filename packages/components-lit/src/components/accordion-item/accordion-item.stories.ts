import { html, type TemplateResult } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import type { AccordionItem as AccordionItemElement } from "./accordion-item.js";

type AccordionItemArgs = Partial<Pick<AccordionItemElement, "expanded" | "disabled" | "headingLevel">> & {
    storyContent: TemplateResult;
};

export default {
    title: "Components/Accordion Item",
    component: "adaptive-accordion-item",
    render: ({ expanded, disabled, headingLevel, storyContent }) => html`
        <adaptive-accordion-item ?expanded="${expanded}" ?disabled="${disabled}" heading-level="${headingLevel ?? 2}">
            ${storyContent}
        </adaptive-accordion-item>
    `,
    args: {
        expanded: false,
        disabled: false,
        headingLevel: 2,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        headingLevel: { control: { type: "number", min: 1, max: 6 } },
    },
} satisfies Meta<AccordionItemArgs>;

export const AccordionItem: StoryObj<AccordionItemArgs> = {
    args: {
        storyContent: html`
            <span slot="heading">Accordion Item Heading</span>
            Accordion Item Content
        `,
    },
};
