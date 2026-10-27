import { chevronLeftIcon, chevronRightIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCalendar } from "./calendar.compose.js";
import { styleModules } from "./calendar.styles.modules.js";
import { CalendarStatics } from "./calendar.template.js";

/**
 * The Calendar custom element definition. Implements {@link Calendar}.
 *
 * @remarks
 * HTML Element: \<adaptive-calendar\>
 *
 * @public
 */
export const calendarDefinition = composeCalendar(
    DefaultDesignSystem,
    {
        statics: {
            [CalendarStatics.previous]: chevronLeftIcon,
            [CalendarStatics.next]: chevronRightIcon,
        },
        styleModules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses its first button.
            delegatesFocus: true,
        },
    }
);
