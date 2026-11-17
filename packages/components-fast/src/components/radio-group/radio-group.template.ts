import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import {
    radioGroupDocumentation,
    RadioGroupParts,
    RadioGroupSlots,
    radioGroupWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { RadioGroup } from "./radio-group.js";

/**
 * @public
 */
export const RadioGroupAnatomy = documentationToComponentAnatomy(radioGroupDocumentation, radioGroupWebBinding);

/**
 * Default Radio Group template: the label, which names the group through its `ElementInternals` (so it is hidden from assistive technology
 * here, not to be read twice), and the radios.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<RadioGroup> =
    (ds: DesignSystem) => html<RadioGroup>`
        <span class=${(_) => RadioGroupParts.label} part=${(_) => RadioGroupParts.label} aria-hidden="true" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => RadioGroupSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class=${(_) => RadioGroupParts.positioningRegion} part=${(_) => RadioGroupParts.positioningRegion}>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
