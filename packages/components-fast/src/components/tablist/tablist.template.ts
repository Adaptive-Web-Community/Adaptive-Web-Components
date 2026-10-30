import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tablist } from "./tablist.js";

/**
 * @public
 */
export const TablistConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

/**
 * @public
 */
export const TablistParts = {
};

/**
 * @public
 */
export const TablistAnatomy: ComponentAnatomy<typeof TablistConditions, typeof TablistParts> = {
    interactivity: Interactivity.never,
    conditions: TablistConditions,
    parts: TablistParts,
};

/**
 * Default Tablist template: the tabs. The panels are another element's.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tablist> =
    (ds: DesignSystem) => html<Tablist>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
