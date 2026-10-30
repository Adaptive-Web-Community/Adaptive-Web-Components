/**
 * An element labelled by a label of its own: a form control whose native element is labelled from outside, by a `<label>` (an `<input>`, a
 * `<select>`, a `<textarea>`), and a group of them. See `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.
 *
 * @remarks
 * Slots: `label`, for a label that is more than text, which replaces the text of {@link LabelledElement.label}. The default slot is never the
 * label: it is the element's items (options, radios), when it has any.
 *
 * An outside `<label for>` of the element names it too.
 *
 * @public
 */
export interface LabelledElement {
    /**
     * The text of its label, which names it.
     *
     * @remarks
     * HTML attribute: `label`. The `label` slot replaces it.
     */
    label: string | null;

    /**
     * Whether its label is hidden. The label still names it.
     *
     * @remarks
     * HTML attribute: `hide-label`.
     */
    hideLabel: boolean;
}

/**
 * An element labelled by its content: one whose native element is named by its content (a `<button>`, an `<a>`). See
 * `docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md`.
 *
 * @remarks
 * Slots: the default slot, the label. It has no `label` attribute.
 *
 * @public
 */
export interface ContentLabelledElement {
    /**
     * Whether its label, the content of its default slot, is hidden, as for a control that shows only an icon. The label still names it.
     *
     * @remarks
     * HTML attribute: `hide-label`.
     */
    hideLabel: boolean;
}

/**
 * What {@link labelHost} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type LabelInternals = Pick<ElementInternals, "ariaLabel" | "ariaLabelledByElements">;

/**
 * Names an element that has its role through `ElementInternals` by its label: the elements in its `label` slot, or the text of its `label`
 * attribute.
 *
 * @remarks
 * For a {@link LabelledElement} whose host is the control (a slider, a listbox, a radio group). Its label is in its shadow root, which a
 * reference from the host can't reach, so the elements of the slot, which are the host's children, are its `ariaLabelledByElements`, and the
 * text of the attribute is its `ariaLabel`. The author's `aria-label` and `aria-labelledby` override both.
 *
 * @param internals - The element's `ElementInternals`
 * @param label - The text of its `label` attribute
 * @param labelElements - The elements in its `label` slot
 *
 * @public
 */
export function labelHost(internals: LabelInternals, label: string | null, labelElements: readonly Element[]): void {
    internals.ariaLabelledByElements = labelElements.length > 0 ? labelElements : null;
    internals.ariaLabel = label || null;
}
