import { type ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { SkeletonParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Skeleton } from "./skeleton.js";

/**
 * @public
 */
export const SkeletonConditions = {
    shape: {
        rectangle: "[shape='rect']",
        circle: "[shape='circle']",
    }
};

export { SkeletonParts };

/**
 * @public
 */
export const SkeletonAnatomy: ComponentAnatomy<typeof SkeletonConditions, typeof SkeletonParts> = {
    interactivity: Interactivity.never,
    conditions: SkeletonConditions,
    parts: SkeletonParts,
};

/**
 * Default Skeleton template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Skeleton> =
    (ds: DesignSystem) => html<Skeleton>`
        ${when(x => x.shimmer,
            html`
                <span class="shimmer" part="shimmer"></span>
            `
        )}
        ${when(x => x.pattern,
            html<Skeleton>`
                <img class="pattern" part="pattern" src="${x => x.pattern}" alt="" />
            `
        )}
        <slot></slot>
    `;
