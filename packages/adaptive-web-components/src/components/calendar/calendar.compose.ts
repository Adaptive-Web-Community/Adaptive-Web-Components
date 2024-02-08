import type { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./calendar.styles.js";
import { CalendarAnatomy, template } from "./calendar.template.js";
import { Calendar } from "./calendar.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeCalendar(
    ds: DesignSystem,
    options?: ComposeOptions<Calendar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, CalendarAnatomy, options);

    return Calendar.compose({
        name: `${ds.prefix}-calendar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
