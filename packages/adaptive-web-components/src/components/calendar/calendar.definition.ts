import { FASTCalendar } from "@microsoft/fast-foundation";
import type { DesignSystem } from "../../design-system.js";
import { styles } from "./calendar.styles.js";
import { template } from "./calendar.template.js";

/**
 * The Calendar custom element definition. Implements {@link @microsoft/fast-foundation#FASTCalendar}.
 *
 * @remarks
 * HTML Element: \<adaptive-calendar\>
 *
 * @public
 */
export const definition = (ds: DesignSystem) =>
    FASTCalendar.compose({
        name: `${ds.prefix}-calendar`,
        registry: ds.registry,
        template: template(ds),
        styles,
    });
