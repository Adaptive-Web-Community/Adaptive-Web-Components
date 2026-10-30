import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { BreadcrumbItemParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { BreadcrumbItem } from "./breadcrumb-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the breadcrumb item.
 *
 * @beta
 */
export const BreadcrumbItemStatics = {
    separator: "breadcrumb-item-separator"
} as const;

/**
 * @beta
 */
export type BreadcrumbItemStatics = ValuesOf<typeof BreadcrumbItemStatics>;

/**
 * @public
 */
export const BreadcrumbItemConditions = {
    noHref: ":not([href])",
    current: "[aria-current]",
};

export { BreadcrumbItemParts };

/**
 * @public
 */
export const BreadcrumbItemAnatomy: ComponentAnatomy<typeof BreadcrumbItemConditions, typeof BreadcrumbItemParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: BreadcrumbItemConditions,
    parts: BreadcrumbItemParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Breadcrumb Item template: a native link, as the {@link Anchor}'s, `aria-current="page"` for the current item, and a separator,
 * hidden for the current item.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<BreadcrumbItem> =
    (ds: DesignSystem) => html<BreadcrumbItem>`
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
            aria-current="${x => x.current ? "page" : null}"
            ${ref("control")}
        >
            <slot name="start"></slot>
            <span class="content" part="content">
                <slot></slot>
            </span>
            <slot name="end"></slot>
        </a>
        <span class="separator" part="separator" aria-hidden="true" ?hidden="${x => x.current}">
            <slot name="separator">${staticallyCompose(ds.statics.get(BreadcrumbItemStatics.separator))}</slot>
        </span>
    `;
