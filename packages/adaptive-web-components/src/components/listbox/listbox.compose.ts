import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./listbox.styles.js";
import { ListboxAnatomy, template } from "./listbox.template.js";
import { Listbox } from "./listbox.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListbox(
    ds: DesignSystem,
    options?: ComposeOptions<Listbox>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, ListboxAnatomy, options);

    return Listbox.compose({
        name: `${ds.prefix}-listbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
