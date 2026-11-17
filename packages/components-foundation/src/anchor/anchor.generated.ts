/* eslint-disable */
// This file is generated from src/anchor/anchor.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { ContentLabelledContract } from "../utilities/content-labelled.generated.js";

/**
 * Part names of Anchor for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const AnchorParts = {
    /** The native `<a>`; receives focus and link styling. */
    control: "control",

    /** The default slot label between optional `start` and `end` slots. */
    content: "content",
} as const;

/**
 * Slot names of Anchor.
 *
 * @public
 */
export const AnchorSlots = {
    /** The content of the element, which is its label and names it. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",
} as const;

/**
 * An **Anchor** is a link. Unlike most controls, it wraps a native `<a>` (`control` part), since browser link behavior can't be replicated on the host alone.
 *
 * @public
 */
export interface AnchorContract extends ContentLabelledContract {
    /**
     * Whether, and with what name, to download the URL instead of navigating.
     */
    download: string | null;

    /**
     * The URL. Without it, the element is a placeholder, not a link.
     */
    href: string | null;

    /**
     * The language of the linked resource.
     */
    hreflang: string | null;

    /**
     * The URLs to notify when the link is followed.
     */
    ping: string | null;

    /**
     * The referrer sent with the request.
     */
    referrerPolicy: string | null;

    /**
     * The relationship of the linked resource.
     */
    rel: string | null;

    /**
     * Where to show the linked resource.
     */
    target: string | null;

    /**
     * The media type of the linked resource.
     */
    type: string | null;
}
