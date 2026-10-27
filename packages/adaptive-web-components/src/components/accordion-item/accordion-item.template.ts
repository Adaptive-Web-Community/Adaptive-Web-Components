import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { AccordionItemParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { AccordionItem } from "./accordion-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 *
 * @beta
 */
export const AccordionItemStatics = {
    collapsed: "accordion-item-collapsed-icon",
    expanded: "accordion-item-expanded-icon"
} as const;

/**
 * @beta
 */
export type AccordionItemStatics = ValuesOf<typeof AccordionItemStatics>;

/**
 * @public
 */
export const AccordionItemConditions = {
    expanded: "[expanded]",
};

export { AccordionItemParts };

/**
 * @public
 */
export const AccordionItemAnatomy: ComponentAnatomy<typeof AccordionItemConditions, typeof AccordionItemParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: AccordionItemConditions,
    parts: AccordionItemParts,
};

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
        <div class="heading" part="heading" role="heading" aria-level="${x => x.headingLevel}">
            <button
                class="button"
                part="button"
                id="button"
                aria-controls="panel"
                aria-expanded="${x => x.expanded}"
                aria-disabled="${x => (x.expanded && !x.collapsible ? "true" : null)}"
                ?disabled="${x => x.disabled}"
                @click="${x => x.handleClick()}"
                ${ref("expandButton")}
            >
                <span class="heading-content" part="heading-content">
                    <slot name="heading"></slot>
                </span>
            </button>
            ${/* The start slot is after the button for an improved screen reader experience */ ""}
            <slot name="start"></slot>
            <slot name="end"></slot>
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="collapsed-icon" ?hidden="${x => x.expanded}">
                    ${staticallyCompose(ds.statics.get(AccordionItemStatics.collapsed))}
                </slot>
                <slot name="expanded-icon" ?hidden="${x => !x.expanded}">
                    ${staticallyCompose(ds.statics.get(AccordionItemStatics.expanded))}
                </slot>
            </span>
        </div>
        <div class="panel" part="panel" id="panel" role="region" aria-labelledby="button" ?hidden="${x => !x.expanded}">
            <slot></slot>
        </div>
    `;
