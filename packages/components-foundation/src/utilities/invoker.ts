/**
 * An element that invokes a command on another, as a native `<button>` with `commandfor` and `command` does: it opens or closes a popover
 * or a dialog, or sends its target a command of the author's (starting with `--`).
 *
 * @public
 */
export interface InvokerElement extends HTMLElement {
    /**
     * The element it invokes the command on.
     *
     * @remarks
     * HTML attribute: `commandfor`, the element's id. Setting the property to an element sets it directly.
     */
    commandForElement: Element | null;

    /**
     * The command: `toggle-popover`, `show-popover`, `hide-popover`, `show-modal`, `close`, `request-close`, or one of the author's, starting
     * with `--`.
     *
     * @remarks
     * HTML attribute: `command`.
     */
    command: string | null;
}
