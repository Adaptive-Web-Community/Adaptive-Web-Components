import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { RadioGroupParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { RadioGroup } from "./radio-group.js";

/**
 * @public
 */
export const RadioGroupConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

export { RadioGroupParts };

/**
 * @public
 */
export const RadioGroupAnatomy: ComponentAnatomy<typeof RadioGroupConditions, typeof RadioGroupParts> = {
    // Its `disabled` attribute or a fieldset around it make it `:disabled`, for the styles of its label.
    interactivity: {
        disabled: ":disabled",
    },
    conditions: RadioGroupConditions,
    parts: RadioGroupParts,
};

/**
 * Default Radio Group template: the `label` slot, which names the group, and the radios.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<RadioGroup> =
    (ds: DesignSystem) => html<RadioGroup>`
        <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}></slot>
        <div class="positioning-region" part="positioning-region">
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
        </div>
    `;
