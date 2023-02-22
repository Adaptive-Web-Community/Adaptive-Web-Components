import { FASTListboxElement } from "@microsoft/fast-foundation";
import { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./listbox.styles.js";
import { template } from "./listbox.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeListbox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTListboxElement>
): FASTElementDefinition {
    return FASTListboxElement.compose({
        name: `${ds.prefix}-listbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}