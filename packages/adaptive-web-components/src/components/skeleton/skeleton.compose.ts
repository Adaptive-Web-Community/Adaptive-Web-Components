import { FASTSkeleton } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./skeleton.styles.js";
import { template } from "./skeleton.template.js";

/**
 * The Skeleton custom element definition. Implements {@link @microsoft/fast-foundation#FASTSkeleton}.
 *
 * @remarks
 * HTML Element: \<adaptive-skeleton\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTSkeleton.compose({
        name: `${ds.prefix}-skeleton`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
