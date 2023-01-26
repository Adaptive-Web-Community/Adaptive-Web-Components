import { FASTTextArea } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./text-area.styles.js";
import { template } from "./text-area.template.js";

/**
 * The Text Area custom element definition. Implements {@link @microsoft/fast-foundation#FASTTextArea}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-area\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTTextArea.compose({
        name: `${ds.prefix}-text-area`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
