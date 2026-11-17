import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import {
    accordionItemDocumentation,
    AccordionItemParts,
    AccordionItemSlots,
    accordionItemWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { AccordionItem } from "./accordion-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 *
 * @public
 */
export const AccordionItemStatics = {
    collapsed: "accordion-item-collapsed-icon",
    expanded: "accordion-item-expanded-icon",
} as const;

/**
 * @public
 */
export type AccordionItemStatics = ValuesOf<typeof AccordionItemStatics>;

/**
 * @public
 */
export const AccordionItemAnatomy = documentationToComponentAnatomy(accordionItemDocumentation, accordionItemWebBinding);

/**
 * The template of an {@link AccordionItem}, with the parts of {@link @adaptive-web/components-foundation#AccordionItemParts}, and the icons of the design
 * system.
 *
 * @remarks
 * The ids are of the shadow root, so the item's own `id` is the author's.
 *
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<AccordionItem> =
    (ds: DesignSystem) => html<AccordionItem>`
        <div class=${(_) => AccordionItemParts.heading} part=${(_) => AccordionItemParts.heading} role="heading" aria-level="${x => x.headingLevel}">
            <button
                class=${(_) => AccordionItemParts.button}
                part=${(_) => AccordionItemParts.button}
                id="button"
                aria-controls="panel"
                aria-expanded="${x => x.expanded}"
                aria-disabled="${x => (x.expanded && !x.collapsible ? "true" : null)}"
                ?disabled="${x => x.disabled}"
                @click="${x => x.handleClick()}"
                ${ref("expandButton")}
            >
                <span class=${(_) => AccordionItemParts.headingContent} part=${(_) => AccordionItemParts.headingContent}>
                    <slot name=${(_) => AccordionItemSlots.heading}></slot>
                </span>
            </button>
            ${/* The start slot is after the button for an improved screen reader experience */ ""}
            <slot name=${(_) => AccordionItemSlots.start}></slot>
            <slot name=${(_) => AccordionItemSlots.end}></slot>
            <span class=${(_) => AccordionItemParts.icon} part=${(_) => AccordionItemParts.icon} aria-hidden="true">
                <slot name=${(_) => AccordionItemSlots.collapsedIcon} ?hidden="${x => x.expanded}">
                    ${staticallyCompose(ds.statics.get(AccordionItemStatics.collapsed))}
                </slot>
                <slot name=${(_) => AccordionItemSlots.expandedIcon} ?hidden="${x => !x.expanded}">
                    ${staticallyCompose(ds.statics.get(AccordionItemStatics.expanded))}
                </slot>
            </span>
        </div>
        <div class=${(_) => AccordionItemParts.panel} part=${(_) => AccordionItemParts.panel} id="panel" role="region" aria-labelledby="button" ?hidden="${x => !x.expanded}">
            <slot></slot>
        </div>
    `;
