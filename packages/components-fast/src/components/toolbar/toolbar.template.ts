import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ToolbarParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Toolbar } from "./toolbar.js";

/**
 * @public
 */
export const ToolbarConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

export { ToolbarParts };

/**
 * @public
 */
export const ToolbarAnatomy: ComponentAnatomy<typeof ToolbarConditions, typeof ToolbarParts> = {
    interactivity: Interactivity.never,
    conditions: ToolbarConditions,
    parts: ToolbarParts,
};

/**
 * Default Toolbar template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Toolbar> =
    (ds: DesignSystem) => html<Toolbar>`
        <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}></slot>
        <div class="positioning-region" part="positioning-region">
            <slot name="start" ${slotted({ property: "startElements", filter: elements() })}></slot>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            <slot name="end" ${slotted({ property: "endElements", filter: elements() })}></slot>
        </div>
    `;
