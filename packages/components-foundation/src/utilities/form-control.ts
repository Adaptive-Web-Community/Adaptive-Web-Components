/**
 * What a form control exposes, as a native one does: its form, its labels, and its validity.
 *
 * @remarks
 * The binding has them from the element's `ElementInternals`.
 *
 * @public
 */
export interface FormControlElement extends HTMLElement {
    /**
     * Its form: its ancestor, or the form whose id is its `form` attribute.
     */
    readonly form: HTMLFormElement | null;

    /**
     * Its labels.
     */
    readonly labels: NodeList;

    /**
     * Its validity.
     */
    readonly validity: ValidityState;

    /**
     * The message of its validity, in the browser's language when the browser made it.
     */
    readonly validationMessage: string;

    /**
     * Whether it is validated: not when it is disabled or read only.
     */
    readonly willValidate: boolean;

    /**
     * Whether it is valid. When it isn't, it fires `invalid`.
     */
    checkValidity(): boolean;

    /**
     * Whether it is valid. When it isn't, it fires `invalid` and shows the message to the user.
     */
    reportValidity(): boolean;
}
