import type { DesignSystem } from "../../design-system.js";
import { styles } from "./horizontal-scroll.styles.js";
import { template } from "./horizontal-scroll.template.js";
import { AdaptiveHorizontalScroll } from "./horizontal-scroll.js";

/**
 * The Horizontal Scroll custom element definition. Implements {@link @microsoft/fast-foundation#FASTHorizontalScroll}.
 *
 * @remarks
 * HTML Element: \<adaptive-horizontal-scroll\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveHorizontalScroll.compose({
        name: `${ds.prefix}-horizontal-scroll`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
