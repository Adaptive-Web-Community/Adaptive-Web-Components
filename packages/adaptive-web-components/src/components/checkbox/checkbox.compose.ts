import { FASTCheckbox } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./checkbox.styles.js";
import { CheckboxInteractivity, CheckboxStatics, template } from "./checkbox.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

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

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, CheckboxInteractivity, options);

    return FASTCheckbox.compose({
        name: `${ds.prefix}-checkbox`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
