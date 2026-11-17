import { type ElementViewTemplate, html, when } from "@microsoft/fast-element";
import {
    skeletonDocumentation,
    SkeletonParts,
    skeletonWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Skeleton } from "./skeleton.js";

/**
 * @public
 */
export const SkeletonAnatomy = documentationToComponentAnatomy(skeletonDocumentation, skeletonWebBinding);

/**
 * Default Skeleton template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Skeleton> =
    (ds: DesignSystem) => html<Skeleton>`
        ${when(x => x.shimmer,
            html`
                <span class=${(_) => SkeletonParts.shimmer} part=${(_) => SkeletonParts.shimmer}></span>
            `,
        )}
        ${when(x => x.pattern,
            html<Skeleton>`
                <img class=${(_) => SkeletonParts.pattern} part=${(_) => SkeletonParts.pattern} src="${x => x.pattern}" alt="" />
            `,
        )}
        <slot></slot>
    `;
