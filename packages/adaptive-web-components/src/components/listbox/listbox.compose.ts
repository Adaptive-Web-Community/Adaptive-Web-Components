import { FASTListboxElement } from "@microsoft/fast-foundation";
import { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./listbox.styles.js";
import { ListboxAnatomy, template } from "./listbox.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeListbox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTListboxElement>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, ListboxAnatomy.interactivity, options);

    return FASTListboxElement.compose({
        name: `${ds.prefix}-listbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
