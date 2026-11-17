/* eslint-disable */
// This file is generated from src/utilities/content-labelled.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Content Labelled.
 *
 * @public
 */
export const ContentLabelledSlots = {
    /** The content of the element, which is its label and names it. */
    default: "",
} as const;

/**
 * An element labelled by its content: one whose native element is named by its content (a `<button>`, an `<a>`).
 *
 * @remarks
 * Its label is the content of its default slot, so it has no `label` attribute and no `label` slot.
 *
 * See `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.
 *
 * @public
 */
export interface ContentLabelledContract {
    /**
     * Whether its label, the content of its default slot, is hidden, as for a control that shows only an icon. The label still names it.
     */
    hideLabel: boolean;
}
