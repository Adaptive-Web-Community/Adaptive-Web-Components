import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import {
    breadcrumbDocumentation,
    BreadcrumbParts,
    BreadcrumbSlots,
    breadcrumbWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Breadcrumb } from "./breadcrumb.js";

/**
 * @public
 */
export const BreadcrumbAnatomy = documentationToComponentAnatomy(breadcrumbDocumentation, breadcrumbWebBinding);

/**
 * Default Breadcrumb template: the list of the items.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Breadcrumb> =
    (ds: DesignSystem) => html<Breadcrumb>`
        <slot name=${(_) => BreadcrumbSlots.start}></slot>
        <div class=${(_) => BreadcrumbParts.list} part=${(_) => BreadcrumbParts.list} role="list">
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
        <slot name=${(_) => BreadcrumbSlots.end}></slot>
    `;
