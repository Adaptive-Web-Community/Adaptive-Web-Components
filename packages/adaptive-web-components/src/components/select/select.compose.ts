import type { DesignSystem } from "../../design-system.js";
import { AdaptiveSelect } from "./select.js";
import { styles } from "./select.styles.js";
import { template } from "./select.template.js";

/**
 * The select custom element definition. Implements {@link @microsoft/fast-foundation#FASTSelect}.
 *
 * @remarks
 * HTML Element: \<adaptive-select\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    AdaptiveSelect.compose({
        name: `${ds.prefix}-select`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
