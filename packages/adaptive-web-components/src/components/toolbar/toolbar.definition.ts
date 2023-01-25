import { FASTToolbar } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./toolbar.styles.js";
import { template } from "./toolbar.template.js";

/**
 * The Toolbar custom element definition. Implements {@link @microsoft/fast-foundation#FASTToolbar}.
 *
 * @remarks
 * HTML Element: \<adaptive-toolbar\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTToolbar.compose({
        name: `${ds.prefix}-toolbar`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
