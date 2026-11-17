/* eslint-disable */
// This file is generated from src/dialog/dialog.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Dialog for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const DialogParts = {
    /** The native `<dialog>`, with role, top layer, backdrop, and focus. */
    control: "control",
} as const;

/**
 * Slot names of Dialog.
 *
 * @public
 */
export const DialogSlots = {
    /** Dialog content. An element with `autofocus` takes focus when it opens. */
    default: "",
} as const;

/**
 * What closes it besides its own controls, as the native `closedby` attribute has it.
 *
 * @public
 */
export const DialogClosedBy = {
    /** A click outside (backdrop) and Escape. */
    any: "any",

    /** Escape only. */
    closeRequest: "closeRequest",

    /** Only its own controls or code. */
    none: "none",
} as const;

/** @public */
export type DialogClosedBy = (typeof DialogClosedBy)[keyof typeof DialogClosedBy];

/**
 * A **Dialog** wraps a native `<dialog>` (`control` part) for modal and non-modal presentation, backdrop, focus, and Escape.
 *
 * @public
 */
export interface DialogContract {
    /**
     * Whether it is open.
     */
    open: boolean;

    /**
     * Whether it is open as modal, with backdrop and inert page content.
     */
    modal: boolean;

    /**
     * What closes it besides its own controls, as the native `closedby` attribute has it.
     */
    closedBy: DialogClosedBy;

    /**
     * The value it closed with, as `close(returnValue)` gave it.
     */
    returnValue: string;
}
