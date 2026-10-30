import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { BreadcrumbParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Breadcrumb } from "./breadcrumb.js";

/**
 * @public
 */
export const BreadcrumbConditions = {
};

export { BreadcrumbParts };

/**
 * @public
 */
export const BreadcrumbAnatomy: ComponentAnatomy<typeof BreadcrumbConditions, typeof BreadcrumbParts> = {
    interactivity: Interactivity.never,
    conditions: BreadcrumbConditions,
    parts: BreadcrumbParts,
};

/**
 * Default Breadcrumb template: the list of the items.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Breadcrumb> =
    (ds: DesignSystem) => html<Breadcrumb>`
        <slot name="start"></slot>
        <div class="list" part="list" role="list">
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
        <slot name="end"></slot>
    `;
