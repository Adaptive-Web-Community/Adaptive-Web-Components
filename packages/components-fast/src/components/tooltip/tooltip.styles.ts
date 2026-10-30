import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template: the placement next to the anchor, by CSS anchor positioning, which the
 * anchor being the popover's source makes its implicit anchor. It flips to the other side when there is no room.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        /* A popover is centered in the viewport by default. */
        inset: auto;
        margin: 0;
        width: max-content;
        max-width: 40ch;
        position-area: block-start;
        position-try-fallbacks: flip-block;
    }

    :host([placement="above-start"]) {
        position-area: block-start span-inline-end;
    }

    :host([placement="above-end"]) {
        position-area: block-start span-inline-start;
    }

    :host([placement="below"]) {
        position-area: block-end;
    }

    :host([placement="below-start"]) {
        position-area: block-end span-inline-end;
    }

    :host([placement="below-end"]) {
        position-area: block-end span-inline-start;
    }

    :host([placement^="before"]),
    :host([placement^="after"]) {
        position-try-fallbacks: flip-inline;
    }

    :host([placement="before"]) {
        position-area: inline-start;
    }

    :host([placement="before-top"]) {
        position-area: inline-start span-block-start;
    }

    :host([placement="before-bottom"]) {
        position-area: inline-start span-block-end;
    }

    :host([placement="after"]) {
        position-area: inline-end;
    }

    :host([placement="after-top"]) {
        position-area: inline-end span-block-start;
    }

    :host([placement="after-bottom"]) {
        position-area: inline-end span-block-end;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host(:popover-open) {
        transition: opacity 50ms linear;
        opacity: 1;
    }

    @starting-style {
        :host(:popover-open) {
            opacity: 0;
        }
    }
`;
