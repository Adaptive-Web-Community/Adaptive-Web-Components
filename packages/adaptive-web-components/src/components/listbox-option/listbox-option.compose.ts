import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { ListboxOption } from "./listbox-option.js";
import { aestheticStyles, templateStyles } from "./listbox-option.styles.js";
import { ListboxOptionAnatomy, template } from "./listbox-option.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListboxOption(
    ds: DesignSystem,
    options?: ComposeOptions<ListboxOption>
): Promise<FASTElementDefinition<typeof ListboxOption>> {
    const styles = ds.assembleStyles(defaultStyles, ListboxOptionAnatomy, options);

    return FASTElementDefinition.compose(ListboxOption, {
        name: `${ds.prefix}-option`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
