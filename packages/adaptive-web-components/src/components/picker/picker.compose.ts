import { FASTPicker } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./picker.styles.js";
import { template } from "./picker.template.js";

/**
 * The Picker custom element definition. Implements {@link @microsoft/fast-foundation#FASTPicker}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTPicker.compose({
        name: `${ds.prefix}-picker`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
