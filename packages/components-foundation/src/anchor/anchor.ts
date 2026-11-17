import type { AnchorContract } from "./anchor.generated.js";

/**
 * A link. Unlike a control, it wraps a native `<a>` (the `control` part), since what the browser does for a link (its context menu, opening it
 * in a new tab, showing its URL, `:visited`) can't be done for a custom element. The author's ARIA attributes on the element are forwarded to
 * the `<a>` by the {@link AriaForwardingController}.
 *
 * @remarks
 * Focusing the element focuses the `<a>`.
 *
 * Slots: the default slot for the content, its label (see the `contentLabelled` contract), and `start` and `end` around it.
 *
 * @public
 */
export interface AnchorElement extends HTMLElement, AnchorContract {}
