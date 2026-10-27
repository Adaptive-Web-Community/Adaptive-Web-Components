import type { ValuesOf } from "../utilities/typings.js";

/**
 * What a {@link ButtonElement} does in its form.
 *
 * @public
 */
export const ButtonType = {
    /** Submits the form. */
    submit: "submit",

    /** Resets the form. */
    reset: "reset",

    /** Nothing in the form. */
    button: "button",
} as const;

/**
 * What a {@link ButtonElement} does in its form.
 *
 * @public
 */
export type ButtonType = ValuesOf<typeof ButtonType>;

/**
 * The parts of a {@link ButtonElement}.
 *
 * @public
 */
export const ButtonParts = {
    /** The content of the default slot. */
    content: "content",
} as const;

/**
 * A button. The element itself is the button, as a native `<button>` is: it has the `button` role, takes focus, and is a form control. See
 * `docs/decisions/0010-a-control-is-its-host-element.md`.
 *
 * @remarks
 * The element's class is form-associated (`static formAssociated = true`), and gives its `ElementInternals` to the {@link ButtonController}.
 *
 * Slots: the default slot for the content, and `start` and `end` around it.
 *
 * Custom states: `active` while the Space key is held, as `:active` is for a native button.
 *
 * @public
 */
export interface ButtonElement extends HTMLElement {
    /**
     * Whether the button is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * What the button does in its form.
     *
     * @remarks
     * HTML attribute: `type`. The default is `button`, unlike a native button's `submit`.
     */
    type: ButtonType;

    /**
     * The name of the button's value in the form data, when it submits the form.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * The button's value in the form data, when it submits the form.
     *
     * @remarks
     * HTML attribute: `value`.
     */
    value: string | null;

    /**
     * The URL to submit the form to, instead of the form's `action`.
     *
     * @remarks
     * HTML attribute: `formaction`.
     */
    formAction: string | null;

    /**
     * The encoding of the form data, instead of the form's `enctype`.
     *
     * @remarks
     * HTML attribute: `formenctype`.
     */
    formEnctype: string | null;

    /**
     * The HTTP method of the submission, instead of the form's `method`.
     *
     * @remarks
     * HTML attribute: `formmethod`.
     */
    formMethod: string | null;

    /**
     * Whether the form is submitted without being validated.
     *
     * @remarks
     * HTML attribute: `formnovalidate`.
     */
    formNoValidate: boolean;

    /**
     * Where to show the response of the submission, instead of the form's `target`.
     *
     * @remarks
     * HTML attribute: `formtarget`.
     */
    formTarget: string | null;

    /**
     * The form of the button: its ancestor, or the form whose id is its `form` attribute.
     */
    readonly form: HTMLFormElement | null;

    /**
     * The labels of the button.
     */
    readonly labels: NodeList;
}
