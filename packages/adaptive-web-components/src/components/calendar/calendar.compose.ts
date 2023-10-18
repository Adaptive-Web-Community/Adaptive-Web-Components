import { FASTCalendar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./calendar.styles.js";
import { CalendarAnatomy, template } from "./calendar.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeCalendar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCalendar>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, CalendarAnatomy, options);

    return FASTCalendar.compose({
        name: `${ds.prefix}-calendar`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
