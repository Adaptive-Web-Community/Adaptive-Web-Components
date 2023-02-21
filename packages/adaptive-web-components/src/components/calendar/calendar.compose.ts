import { FASTCalendar } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./calendar.styles.js";
import { template } from "./calendar.template.js";

export function composeCalendar(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCalendar>
): FASTElementDefinition {
    return FASTCalendar.compose({
        name: `${ds.prefix}-calendar`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}