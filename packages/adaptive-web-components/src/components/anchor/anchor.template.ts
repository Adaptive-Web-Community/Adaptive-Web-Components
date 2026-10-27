import { type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { AnchorParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Anchor } from "./anchor.js";

/**
 * @public
 */
export const AnchorConditions = {
    iconOnly: ":state(icon-only)",
    noHref: ":not([href])",
};

export { AnchorParts };

/**
 * @public
 */
export const AnchorAnatomy: ComponentAnatomy<typeof AnchorConditions, typeof AnchorParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: AnchorConditions,
    parts: AnchorParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Anchor template: a native link, which has the element's link attributes and, through the
 * {@link @adaptive-web/components-foundation#AriaForwardingController}, its ARIA attributes.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Anchor> =
    (ds: DesignSystem) => html<Anchor>`
        <a
            class="control"
            part="control"
            download="${x => x.download}"
            href="${x => x.href}"
            hreflang="${x => x.hreflang}"
            ping="${x => x.ping}"
            referrerpolicy="${x => x.referrerPolicy}"
            rel="${x => x.rel}"
            target="${x => x.target}"
            type="${x => x.type}"
            ${ref("control")}
        >
            <slot name="start"></slot>
            <span class="content" part="content">
                <slot ${slotted("defaultSlottedContent")}></slot>
            </span>
            <slot name="end"></slot>
        </a>
    `;
