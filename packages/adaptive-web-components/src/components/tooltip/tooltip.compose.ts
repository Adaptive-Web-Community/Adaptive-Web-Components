import { FASTTooltip } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tooltip.styles.js";
import { template } from "./tooltip.template.js";

/**
 * The Tooltip custom element definition. Implements {@link @microsoft/fast-foundation#FASTTooltip}.
 *
 * @remarks
 * HTML Element: \<adaptive-tooltip\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTooltip.compose({
        name: `${ds.prefix}-tooltip`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
