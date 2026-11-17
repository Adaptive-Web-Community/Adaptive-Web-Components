/* eslint-disable */
// This file is generated from src/radio/radio.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { CheckableContract } from "../checkable/checkable.generated.js";

/**
 * Part names of Radio for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const RadioParts = {
    /** The circle, with the checked indicator. */
    control: "control",

    /** The `label` slot or `label` attribute text that names the radio. */
    label: "label",
} as const;

/**
 * Slot names of Radio.
 *
 * @public
 */
export const RadioSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Replaces the default checked glyph in the control part. */
    checkedIndicator: "checked-indicator",
} as const;

/**
 * A **Radio** is one option in a radio group (`role="radio"`). The host is the radio and the form control through `ElementInternals`.
 *
 * @public
 */
export interface RadioContract extends CheckableContract {
    /**
     * Whether its radio group is read only, which makes it read only.
     */
    groupReadOnly: boolean;

    /**
     * Whether its radio group is disabled, which disables it. The radio's own `disabled` attribute is the author's.
     */
    groupDisabled: boolean;
}
