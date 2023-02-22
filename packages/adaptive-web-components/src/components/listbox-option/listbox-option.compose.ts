import { FASTListboxOption } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./listbox-option.styles.js";
import { template } from "./listbox-option.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeListboxOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTListboxOption>
): FASTElementDefinition {
    return FASTListboxOption.compose({
        name: `${ds.prefix}-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}