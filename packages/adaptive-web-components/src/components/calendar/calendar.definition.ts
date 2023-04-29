import { DefaultDesignSystem } from "../../design-system.js";
import { composeCalendar } from "./calendar.compose.js";
import { styleModules } from "./calendar.styles.modules.js";

/**
 * The Calendar custom element definition. Implements {@link @microsoft/fast-foundation#FASTCalendar}.
 *
 * @remarks
 * HTML Element: \<adaptive-calendar\>
 *
 * @public
 */
export const calendarDefinition = composeCalendar(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
