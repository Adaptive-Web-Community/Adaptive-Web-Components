import { FASTToolbar } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./toolbar.styles.js";
import { template } from "./toolbar.template.js";

/**
 * The Toolbar Custom Element. Implements {@link @microsoft/fast-foundation#FASTToolbar}, {@link @microsoft/fast-foundation#toolbarTemplate}
 *
 * @remarks
 * HTML Element: \<adaptive-toolbar\>
 * 
 * @public
 */
export const definition = (ds: DesignSystem) => FASTToolbar.compose({
    name: `${ds.prefix}-toolbar`,
    registry: ds.registry,
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
});
