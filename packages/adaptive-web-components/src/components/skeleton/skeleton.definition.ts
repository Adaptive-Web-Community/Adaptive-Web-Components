import { DefaultDesignSystem } from "../../design-system.js";
import { composeSkeleton } from "./skeleton.compose.js";

/**
 * The Skeleton custom element definition. Implements {@link @microsoft/fast-foundation#FASTSkeleton}.
 *
 * @remarks
 * HTML Element: \<adaptive-skeleton\>
 *
 * @public
 */
export const skeletonDefinition = composeSkeleton(DefaultDesignSystem);