/* eslint-disable */
// This file is generated from src/radio-group/radio-group.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Radio Group for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const RadioGroupParts = {
    /** The `label` slot or `label` attribute text that names the group, hidden from assistive technology so it isn't read twice. */
    label: "label",

    /** The container of the radios, laid out in the orientation. */
    positioningRegion: "positioning-region",
} as const;

/**
 * Slot names of Radio Group.
 *
 * @public
 */
export const RadioGroupSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * The direction in which the radios are laid out.
 *
 * @public
 */
export const RadioGroupOrientation = {
    /** Radios in a row. */
    horizontal: "horizontal",

    /** Radios in a column. */
    vertical: "vertical",
} as const;

/** @public */
export type RadioGroupOrientation = (typeof RadioGroupOrientation)[keyof typeof RadioGroupOrientation];

/**
 * A **Radio Group** is a set of radios of which one is checked (`role="radiogroup"`). The host is the form control for group validity and disabled state; each radio gives its value.
 *
 * @public
 */
export interface RadioGroupContract extends LabelledContract {
    /**
     * The name of the radios in the form data, given to each of them when it is set.
     */
    name: string | null;

    /**
     * The direction in which the radios are laid out.
     */
    orientation: RadioGroupOrientation;

    /**
     * Whether it is read only: the arrow keys move focus without checking.
     */
    readOnly: boolean;

    /**
     * Whether it is disabled, which disables its radios. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether one of its radios must be checked for its form to be valid.
     */
    required: boolean;

    /**
     * The value of the checked radio, or null when none is. Setting it checks the radio with that value.
     */
    value: string | null;
}
