import { FASTDialog } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./dialog.styles.js";
import { template } from "./dialog.template.js";

/**
 * The Dialog custom element definition. Implements {@link @microsoft/fast-foundation#FASTDialog}.
 *
 * @remarks
 * HTML Element: \<adaptive-dialog\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTDialog.compose({
        name: `${ds.prefix}-dialog`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
