import { RovingFocusController } from "../utilities/roving-focus.controller.js";
import type { ToolbarElement } from "./toolbar.js";

/**
 * What a {@link ToolbarController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type ToolbarInternals = Pick<ElementInternals, "role" | "ariaOrientation" | "ariaLabelledByElements">;

/**
 * The behavior of a {@link ToolbarElement}: the `toolbar` role, in its orientation, named by its label; and the arrow keys in the orientation,
 * Home, and End, which move the focus between its items (with a {@link RovingFocusController}).
 *
 * @remarks
 * The element's binding creates it, calls {@link ToolbarController.connect} and {@link ToolbarController.disconnect} with the element's
 * lifecycle, and calls {@link ToolbarController.setElements}, {@link ToolbarController.orientationChanged}, and
 * {@link ToolbarController.labelsChanged} when its framework observes those changes.
 *
 * @public
 */
export class ToolbarController {
    private readonly rovingFocus: RovingFocusController;

    constructor(private readonly host: ToolbarElement, private readonly internals: ToolbarInternals) {
        internals.role = "toolbar";
        this.rovingFocus = new RovingFocusController(host, { keys: host.orientation, homeEnd: true });
    }

    /**
     * Starts handling the keyboard. For when the element is connected.
     */
    public connect(): void {
        this.rovingFocus.connect();
        this.orientationChanged();
    }

    /**
     * Stops handling the keyboard. For when the element is disconnected.
     */
    public disconnect(): void {
        this.rovingFocus.disconnect();
    }

    /**
     * The elements in the slots for the items changed, in their order. Those that take focus themselves are the items, and those in a plain
     * element around them, such as a `<label>`.
     */
    public setElements(elements: readonly Element[]): void {
        this.rovingFocus.setItems(findItems(elements));
    }

    /**
     * The orientation changed.
     */
    public orientationChanged(): void {
        const { orientation } = this.host;
        this.internals.ariaOrientation = orientation;
        this.rovingFocus.setKeys(orientation);
    }

    /**
     * The elements in the `label` slot changed. They name the toolbar.
     */
    public labelsChanged(labels: readonly Element[]): void {
        this.internals.ariaLabelledByElements = labels.length > 0 ? labels : null;
    }
}

// An element takes focus when it is focusable (a native control, `tabIndex` 0), has a `tabindex`, which a component that is focusable sets
// on its host, or delegates its focus to its shadow root (a link, a text field), where the host's `tabindex` is its native element's. The
// items in a plain element that isn't one are found in it; a custom element that isn't one is left as it is, since what is in it is its own:
// a radio group moves the focus between its radios.
function findItems(elements: readonly Element[]): HTMLElement[] {
    return elements.flatMap(element => {
        if (!(element instanceof HTMLElement) || element.hidden) {
            return [];
        }
        if (element.tabIndex >= 0 || element.hasAttribute("tabindex") || element.shadowRoot?.delegatesFocus) {
            return [element];
        }
        return element.localName.includes("-") ? [] : findItems(Array.from(element.children));
    });
}
