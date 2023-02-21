import { FASTTab } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tab.styles.js";
import { template } from "./tab.template.js";

/**
 * The Tab custom element definition. Implements {@link @microsoft/fast-foundation#FASTTab}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTab.compose({
        name: `${ds.prefix}-tab`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
