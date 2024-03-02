import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./listbox-option.styles.js";
import { ListboxOptionAnatomy, template } from "./listbox-option.template.js";
import { ListboxOption } from "./listbox-option.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListboxOption(
    ds: DesignSystem,
    options?: ComposeOptions<ListboxOption>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ListboxOptionAnatomy, options);

    return ListboxOption.compose({
        name: `${ds.prefix}-listbox-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
