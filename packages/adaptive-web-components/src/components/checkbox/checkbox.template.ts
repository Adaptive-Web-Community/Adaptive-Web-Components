import { ElementViewTemplate } from "@microsoft/fast-element";
import { checkboxTemplate, FASTCheckbox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { InteractivityDefinition } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the checkbox.
 */
export const CheckboxStatics = {
    checked: "checkbox-checked-indicator",
    indeterminate: "checkbox-indeterminate-indicator"
} as const;

export type CheckboxStatics = ValuesOf<typeof CheckboxStatics>;

// Looking for a way to make this type-=safe and extensible:

type Condition = string;

export type Conditions = Record<string, Condition>;
export type Parts = Record<string, string>;

interface Anatomy<TConditions extends Conditions, TParts extends Parts> {
    interactivity?: InteractivityDefinition;
    conditions: TConditions;
    parts: TParts;
}

// type CheckboxConditions = {
//     checked: Condition,
//     indeterminate: Condition
// };

export const CheckboxConditions: Conditions = {
    checked: "[aria-checked='true']",
    indeterminate: "[aria-checked='mixed']"
};

type CheckboxConditions = typeof CheckboxConditions;

// type CheckboxParts = {
//     control: string,
//     label: string
// };

export const CheckboxParts: Parts = {
    control: "control",
    label: "label"
};

type CheckboxParts = typeof CheckboxParts;

export const CheckboxInteractivity: InteractivityDefinition = { 
    interactivitySelector: ":not([disabled])",
    nonInteractivitySelector: "[disabled]",
}

export const CheckboxAnatomy: Anatomy<CheckboxConditions, CheckboxParts> = {
    interactivity: CheckboxInteractivity,
    conditions: CheckboxConditions,
    parts: CheckboxParts,
};

// Such that TypeScript knows what conditions and parts are available:
// CheckboxAnatomy.conditions.[auto-complete here]

/**
 * Default Checkbox template, {@link @microsoft/fast-foundation#checkboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCheckbox> =
    (ds: DesignSystem) => {
        return checkboxTemplate({
            checkedIndicator: ds.statics.get(CheckboxStatics.checked),
            indeterminateIndicator: ds.statics.get(CheckboxStatics.indeterminate),
        });
    }
