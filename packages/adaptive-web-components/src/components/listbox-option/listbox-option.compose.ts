import { FASTListboxOption } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./listbox-option.styles.js";
import { ListboxOptionAnatomy, template } from "./listbox-option.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeListboxOption(
    ds: DesignSystem,
    options?: ComposeOptions<FASTListboxOption>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, ListboxOptionAnatomy.interactivity, options);

    return FASTListboxOption.compose({
        name: `${ds.prefix}-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
