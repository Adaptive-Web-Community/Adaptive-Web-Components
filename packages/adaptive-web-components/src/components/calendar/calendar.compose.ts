import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { Calendar } from "./calendar.js";
import { aestheticStyles, templateStyles } from "./calendar.styles.js";
import { CalendarAnatomy, CalendarStatics, template } from "./calendar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeCalendar(
    ds: DesignSystem,
    options?: ComposeOptions<Calendar, CalendarStatics>
): Promise<FASTElementDefinition<typeof Calendar>> {
    if (options?.statics) {
        for (const key of Object.values(CalendarStatics)) {
            if (!ds.statics.has(key)) {
                ds.statics.set(key, options.statics[key]);
            }
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, CalendarAnatomy, options);

    return FASTElementDefinition.compose(Calendar, {
        name: `${ds.prefix}-calendar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
