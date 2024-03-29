import { FASTRadio } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from '../../styles/styles.js';
import { aestheticStyles, templateStyles } from "./radio.styles.js";
import { RadioAnatomy, RadioStatics, template } from "./radio.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

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

    const styles = DesignSystem.assembleStyles(defaultStyles, RadioAnatomy, options);

    return FASTRadio.compose({
        name: `${ds.prefix}-radio`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}