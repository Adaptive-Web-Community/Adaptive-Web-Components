import type { ContentLabelledElement } from "../utilities/label.js";

/**
 * The parts of an {@link AnchorElement}.
 *
 * @public
 */
export const AnchorParts = {
    /** The native link. */
    control: "control",

    /** The content of the default slot, its label. */
    content: "content",
} as const;

/**
 * A link. Unlike a control, it wraps a native `<a>` (the `control` part), since what the browser does for a link (its context menu, opening it
 * in a new tab, showing its URL, `:visited`) can't be done for a custom element. The author's ARIA attributes on the element are forwarded to
 * the `<a>` by the {@link AriaForwardingController}.
 *
 * @remarks
 * The properties are the native link's, given to the `<a>`. Focusing the element focuses the `<a>`.
 *
 * Slots: the default slot for the content, its label (see {@link ContentLabelledElement}), and `start` and `end` around it.
 *
 * @public
 */
export interface AnchorElement extends HTMLElement, ContentLabelledElement {
    /**
     * Whether, and with what name, to download the URL instead of going to it.
     *
     * @remarks
     * HTML attribute: `download`.
     */
    download: string | null;

    /**
     * The URL. Without it, the element is a placeholder for a link, not a link.
     *
     * @remarks
     * HTML attribute: `href`.
     */
    href: string | null;

    /**
     * The language of the linked resource.
     *
     * @remarks
     * HTML attribute: `hreflang`.
     */
    hreflang: string | null;

    /**
     * The URLs to notify when the link is followed.
     *
     * @remarks
     * HTML attribute: `ping`.
     */
    ping: string | null;

    /**
     * The referrer sent with the request.
     *
     * @remarks
     * HTML attribute: `referrerpolicy`.
     */
    referrerPolicy: string | null;

    /**
     * The relationship of the linked resource.
     *
     * @remarks
     * HTML attribute: `rel`.
     */
    rel: string | null;

    /**
     * Where to show the linked resource.
     *
     * @remarks
     * HTML attribute: `target`.
     */
    target: string | null;

    /**
     * The media type of the linked resource.
     *
     * @remarks
     * HTML attribute: `type`.
     */
    type: string | null;
}
