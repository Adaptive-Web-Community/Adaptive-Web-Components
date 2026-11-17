import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import {
    toolbarDocumentation,
    ToolbarParts,
    ToolbarSlots,
    toolbarWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Toolbar } from "./toolbar.js";

/**
 * @public
 */
export const ToolbarAnatomy = documentationToComponentAnatomy(toolbarDocumentation, toolbarWebBinding);

/**
 * Default Toolbar template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Toolbar> =
    (ds: DesignSystem) => html<Toolbar>`
        <slot name=${(_) => ToolbarSlots.label} ${slotted({ property: "labelElements", filter: elements() })}></slot>
        <div class=${(_) => ToolbarParts.positioningRegion} part=${(_) => ToolbarParts.positioningRegion}>
            <slot name=${(_) => ToolbarSlots.start} ${slotted({ property: "startElements", filter: elements() })}></slot>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            <slot name=${(_) => ToolbarSlots.end} ${slotted({ property: "endElements", filter: elements() })}></slot>
        </div>
    `;
