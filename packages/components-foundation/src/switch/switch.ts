import type { CheckableElement } from "../checkable/checkable.js";

/**
 * The parts of a {@link SwitchElement}.
 *
 * @public
 */
export const SwitchParts = {
    /** The track, with the thumb. */
    switch: "switch",

    /** The label, the content of the default slot. */
    label: "label",

    /** What moves along the track. */
    thumb: "thumb",
} as const;

/**
 * A switch (`role="switch"`): a {@link CheckableElement} that turns something on and off.
 *
 * @remarks
 * Slots: the default slot for the label, and `switch` for a track of the author's.
 *
 * Custom states: `checked`, `readonly`, and `active` while Space is held.
 *
 * @public
 */
export interface SwitchElement extends CheckableElement {
    /**
     * Whether it must be on for its form to be valid.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't check or uncheck it. A read only switch isn't validated, as a read only
     * native input isn't.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;
}
