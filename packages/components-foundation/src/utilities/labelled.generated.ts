/* eslint-disable */
// This file is generated from src/utilities/labelled.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Labelled.
 *
 * @public
 */
export const LabelledSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * An element labelled by a label of its own: a form control whose native element is labelled from outside, by a `<label>` (an `<input>`, a `<select>`, a `<textarea>`), and a group of them.
 *
 * @remarks
 * The `label` slot is for a label that is more than text, and replaces the text of `label`. The default slot is never the label: it is the element's items (options, radios), when it has any.
 *
 * An outside `<label for>` of the element names it too.
 *
 * See `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.
 *
 * @public
 */
export interface LabelledContract {
    /**
     * The text of its label, which names it. The `label` slot replaces it.
     */
    label: string | null;

    /**
     * Whether its label is hidden. The label still names it.
     */
    hideLabel: boolean;
}
