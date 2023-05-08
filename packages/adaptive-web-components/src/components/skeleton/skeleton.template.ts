import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import type { FASTSkeleton } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const SkeletonConditions = {
    rectangle: "[shape='rect']",
    circle: "[shape='circle']",
};

/**
 * @public
 */
export const SkeletonParts = {
};

/**
 * @public
 */
export const SkeletonAnatomy: ComponentAnatomy<typeof SkeletonConditions, typeof SkeletonParts> = {
    interactivity: Interactivity.never,
    conditions: SkeletonConditions,
    parts: SkeletonParts,
};

/**
 * Default Skeleton template, {@link @microsoft/fast-foundation#skeletonTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSkeleton> =
    (ds: DesignSystem) =>
        html<FASTSkeleton>`
            ${when(x => x.shimmer === true,
                html`
                    <span class="shimmer"></span>
                `
            )}
            ${when(x => x.pattern,
                html`
                    <object type="image/svg+xml" data="${x => x.pattern}" role="presentation">
                        <img class="pattern" src="${x => x.pattern}" />
                    </object>
                `
            )}
            <slot></slot>
        `;
