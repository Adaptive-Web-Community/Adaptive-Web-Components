import { FASTBadge } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./badge.styles.js";
import { template } from "./badge.template.js";

/**
 * The Badge custom element definition. Implements {@link @microsoft/fast-foundation#FASTBadge}.
 *
 * @remarks
 * HTML Element: \<adaptive-badge\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTBadge.compose({
        name: `${ds.prefix}-badge`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
