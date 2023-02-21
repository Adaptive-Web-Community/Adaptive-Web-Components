import { FASTTabs } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./tabs.styles.js";
import { template } from "./tabs.template.js";

/**
 * The Tabs custom element definition. Implements {@link @microsoft/fast-foundation#FASTTabs}.
 *
 * @remarks
 * HTML Element: \<adaptive-tabs\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTabs.compose({
        name: `${ds.prefix}-tabs`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
