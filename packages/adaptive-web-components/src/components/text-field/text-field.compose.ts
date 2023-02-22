import { FASTTextField } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./text-field.styles.js";
import { template } from "./text-field.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeTextField(
    ds: DesignSystem,
    options?: ComposeOptions<FASTTextField>
): FASTElementDefinition {
    return FASTTextField.compose({
        name: `${ds.prefix}-text-field`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}