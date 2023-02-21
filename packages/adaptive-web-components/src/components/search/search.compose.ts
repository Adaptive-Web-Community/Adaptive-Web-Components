import { FASTSearch } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./search.styles.js";
import { template } from "./search.template.js";

/**
 * The Search Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTSearch}.
 *
 * @remarks
 * HTML Element: \<adaptive-search\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTSearch.compose({
        name: `${ds.prefix}-search`,
        registry: ds.registry,
        template: template(ds),
        styles,
        shadowOptions: {
            delegatesFocus: true,
        },
    });
