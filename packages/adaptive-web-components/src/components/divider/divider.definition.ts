import { FASTDivider } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./divider.styles.js";
import { template } from "./divider.template.js";

/**
 * The Divider custom element definition. Implements {@link @microsoft/fast-foundation#FASTDivider}.
 *
 * @remarks
 * HTML Element: \<adaptive-divider\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDivider.compose({
        name: `${ds.prefix}-divider`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
