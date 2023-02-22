import { FASTCheckbox } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./checkbox.styles.js";
import { CheckboxStatics, template } from "./checkbox.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeCheckbox(
    ds: DesignSystem,
    options?: ComposeOptions<FASTCheckbox, CheckboxStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(CheckboxStatics.checked)) {
            ds.statics.set(
                CheckboxStatics.checked,
                options.statics[CheckboxStatics.checked]
            );
        }

        if (!ds.statics.has(CheckboxStatics.indeterminate)) {
            ds.statics.set(
                CheckboxStatics.indeterminate,
                options.statics[CheckboxStatics.indeterminate]
            );
        }
    }

    return FASTCheckbox.compose({
        name: `${ds.prefix}-checkbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}