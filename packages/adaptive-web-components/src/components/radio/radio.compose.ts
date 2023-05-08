import { FASTRadio } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./radio.styles.js";
import { RadioAnatomy, RadioStatics, template } from "./radio.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeRadio(
    ds: DesignSystem,
    options?: ComposeOptions<FASTRadio, RadioStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(RadioStatics.checked)) {
            ds.statics.set(
                RadioStatics.checked,
                options.statics[RadioStatics.checked]
            );
        }
    }

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, RadioAnatomy.interactivity, options);

    return FASTRadio.compose({
        name: `${ds.prefix}-radio`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}