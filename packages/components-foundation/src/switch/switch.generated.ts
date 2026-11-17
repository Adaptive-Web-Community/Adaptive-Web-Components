/* eslint-disable */
// This file is generated from src/switch/switch.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { CheckableContract } from "../checkable/checkable.generated.js";

/**
 * Part names of Switch for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SwitchParts = {
    /** The `label` slot or `label` attribute text that names the switch. */
    label: "label",

    /** The track, with the thumb. */
    switch: "switch",

    /** What moves along the track. */
    thumb: "thumb",
} as const;

/**
 * Slot names of Switch.
 *
 * @public
 */
export const SwitchSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Replaces the default track and thumb in the switch part. */
    switch: "switch",
} as const;

/**
 * A **Switch** turns something on and off. The host is the switch (`role="switch"`) and the form control through `ElementInternals`.
 *
 * @public
 */
export interface SwitchContract extends CheckableContract {
    /**
     * Whether it must be on for its form to be valid.
     */
    required: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't check or uncheck it. It isn't validated, as a read only native input isn't.
     */
    readOnly: boolean;
}
