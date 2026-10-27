import type { ValuesOf } from "../utilities/typings.js";

/**
 * What closes a {@link DialogElement} besides its own controls, as the native `closedby` attribute has it.
 *
 * @public
 */
export const DialogClosedBy = {
    /** A click outside it (on the backdrop), and a close request (Escape). */
    any: "any",

    /** A close request (Escape). */
    closeRequest: "closerequest",

    /** Nothing: only its own controls, or code. */
    none: "none",
} as const;

/**
 * What closes a {@link DialogElement} besides its own controls.
 *
 * @public
 */
export type DialogClosedBy = ValuesOf<typeof DialogClosedBy>;

/**
 * The parts of a {@link DialogElement}.
 *
 * @public
 */
export const DialogParts = {
    /** The native `<dialog>`. */
    control: "control",
} as const;

/**
 * A dialog. It wraps a native `<dialog>` (the `control` part), which has the role, the top layer and its backdrop, the inertness of the page
 * while it is modal, focus moved into it and back to what opened it, and Escape.
 *
 * @remarks
 * The author's ARIA attributes on the element (`aria-labelledby`, `aria-label`, `aria-describedby`) are forwarded to the `<dialog>`, which
 * needs a name.
 *
 * It opens by its methods, or by a `command` from an invoker that has it as its `commandfor`: `show-modal`, `close`, and `request-close`, or
 * the same with `--` from a native button, whose built-in commands work only on a native `<dialog>`.
 *
 * Slots: the default slot for the content. An element of it with `autofocus` takes the focus when the dialog opens.
 *
 * Custom states: `open`, and `modal` when it is open as modal.
 *
 * Events: `cancel` (cancelable) when Escape or a click outside asks to close it, and `close` when it closed, as the native `<dialog>`.
 *
 * @public
 */
export interface DialogElement extends HTMLElement {
    /**
     * Whether it is open.
     */
    readonly open: boolean;

    /**
     * The value it closed with, as `close(returnValue)` gave it.
     */
    returnValue: string;

    /**
     * What closes it besides its own controls.
     *
     * @remarks
     * HTML attribute: `closedby`. The default is `closerequest`.
     */
    closedBy: DialogClosedBy;

    /**
     * Opens it, not modal: the rest of the page stays usable.
     */
    show(): void;

    /**
     * Opens it as modal: the rest of the page is inert, behind its backdrop.
     */
    showModal(): void;

    /**
     * Closes it, with the value it closed with.
     */
    close(returnValue?: string): void;
}
