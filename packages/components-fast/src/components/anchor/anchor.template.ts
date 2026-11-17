import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import {
    anchorDocumentation,
    AnchorParts,
    AnchorSlots,
    anchorWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Anchor } from "./anchor.js";

const anchorAnatomyBase = documentationToComponentAnatomy(anchorDocumentation, anchorWebBinding);

/**
 * @public
 */
export const AnchorAnatomy = {
    ...anchorAnatomyBase,
    conditions: {
        ...anchorAnatomyBase.conditions,
        noHref: ":not([href])",
    },
};

/**
 * Default Anchor template: a native link, which has the element's link attributes and, through the
 * {@link @adaptive-web/components-foundation#AriaForwardingController}, its ARIA attributes.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Anchor> =
    (ds: DesignSystem) => html<Anchor>`
        <a
            class=${(_) => AnchorParts.control}
            part=${(_) => AnchorParts.control}
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
            <slot name=${(_) => AnchorSlots.start}></slot>
            <span class=${(_) => AnchorParts.content} part=${(_) => AnchorParts.content}>
                <slot></slot>
            </span>
            <slot name=${(_) => AnchorSlots.end}></slot>
        </a>
    `;
