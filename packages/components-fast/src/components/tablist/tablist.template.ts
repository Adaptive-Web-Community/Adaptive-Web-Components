import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { tablistDocumentation, tablistWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tablist } from "./tablist.js";

/**
 * @public
 */
export const TablistAnatomy = documentationToComponentAnatomy(tablistDocumentation, tablistWebBinding);

/**
 * Default Tablist template: the tabs. The panels are another element's.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tablist> =
    (ds: DesignSystem) => html<Tablist>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
