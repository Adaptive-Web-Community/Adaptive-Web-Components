import { FASTRadioGroup } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./radio-group.styles.js";
import { template } from "./radio-group.template.js";

/**
 * The Radio Group custom element definition. Implements {@link @microsoft/fast-foundation#FASTRadioGroup}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio-group\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTRadioGroup.compose({
        name: `${ds.prefix}-radio-group`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
