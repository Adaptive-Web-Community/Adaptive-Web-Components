import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
    accordionItemDocumentation,
    AccordionItemParts,
    AccordionItemSlots,
    accordionItemWebBinding,
    AccordionItemStatics,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import type { DesignSystem } from "../../design-system.js";
import type { AccordionItem } from "./accordion-item.js";

/**
 * @public
 */
export const AccordionItemAnatomy = documentationToComponentAnatomy(accordionItemDocumentation, accordionItemWebBinding);

export { AccordionItemStatics };

/**
 * The template of an {@link AccordionItem}, with the parts of {@link @adaptive-web/components-foundation#AccordionItemParts}, and the icons of the design
 * system.
 *
 * @remarks
 * The ids are of the shadow root, so the item's own `id` is the author's.
 *
 * @public
 */
export const template: (ds: DesignSystem) => (x: AccordionItem) => TemplateResult =
    (ds: DesignSystem) => {
        const collapsedIcon = unsafeHTML(ds.statics.get(AccordionItemStatics.collapsed));
        const expandedIcon = unsafeHTML(ds.statics.get(AccordionItemStatics.expanded));

        return (x: AccordionItem) => html`
            <div class=${AccordionItemParts.heading} part=${AccordionItemParts.heading} role="heading" aria-level="${x.headingLevel}">
                <button
                    class=${AccordionItemParts.button}
                    part=${AccordionItemParts.button}
                    id="button"
                    aria-controls="panel"
                    aria-expanded="${x.expanded}"
                    aria-disabled="${x.expanded && !x.collapsible ? "true" : nothing}"
                    ?disabled="${x.disabled}"
                >
                    <span class=${AccordionItemParts.headingContent} part=${AccordionItemParts.headingContent}>
                        <slot name=${AccordionItemSlots.heading}></slot>
                    </span>
                </button>
                ${/* The start slot is after the button for an improved screen reader experience */ ""}
                <slot name=${AccordionItemSlots.start}></slot>
                <slot name=${AccordionItemSlots.end}></slot>
                <span class=${AccordionItemParts.icon} part=${AccordionItemParts.icon} aria-hidden="true">
                    <slot name=${AccordionItemSlots.collapsedIcon} ?hidden="${x.expanded}">${collapsedIcon}</slot>
                    <slot name=${AccordionItemSlots.expandedIcon} ?hidden="${!x.expanded}">${expandedIcon}</slot>
                </span>
            </div>
            <div class=${AccordionItemParts.panel} part=${AccordionItemParts.panel} id="panel" role="region" aria-labelledby="button" ?hidden="${!x.expanded}">
                <slot></slot>
            </div>
        `;
    };