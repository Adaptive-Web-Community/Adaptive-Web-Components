/* eslint-disable */
// This file is generated from src/accordion/accordion.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Accordion.
 *
 * @public
 */
export const AccordionSlots = {
    /** Accordion items. */
    default: "",
} as const;

/**
 * Whether one item or several can be expanded at a time.
 *
 * @public
 */
export const AccordionExpandMode = {
    /** One item expanded; it can't be collapsed except by expanding another. */
    single: "single",

    /** Any number of items can be expanded. */
    multi: "multi",
} as const;

/** @public */
export type AccordionExpandMode = (typeof AccordionExpandMode)[keyof typeof AccordionExpandMode];

/**
 * An **Accordion** is a set of expandable sections. Each item has a heading button and a collapsible panel.
 *
 * @public
 */
export interface AccordionContract {
    /**
     * Whether one item or several can be expanded at a time.
     */
    expandMode: AccordionExpandMode;
}
