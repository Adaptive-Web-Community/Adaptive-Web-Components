import { FASTTabPanel } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tab-panel.styles.js";
import { template } from "./tab-panel.template.js";

/**
 * The Tab Panel custom element definition. Implements {@link @microsoft/fast-foundation#FASTTabPanel}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab-panel\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTabPanel.compose({
        name: `${ds.prefix}-tab-panel`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
