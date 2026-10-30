import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Listbox } from "./listbox.js";
import { aestheticStyles, templateStyles } from "./listbox.styles.js";
import { ListboxAnatomy, template } from "./listbox.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListbox(
    ds: DesignSystem,
    options?: ComposeOptions<Listbox>
): Promise<FASTElementDefinition<typeof Listbox>> {
    const styles = ds.assembleStyles(defaultStyles, ListboxAnatomy, options);

    return FASTElementDefinition.compose(Listbox, {
        name: `${ds.prefix}-listbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
