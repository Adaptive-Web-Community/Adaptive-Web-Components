import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from '../../styles/styles.js';
import { AdaptiveSelect } from "./select.js";
import { aestheticStyles, templateStyles } from "./select.styles.js";
import { SelectAnatomy, SelectStatics, template } from "./select.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeSelect(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveSelect, SelectStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(SelectStatics.indicator)) {
            ds.statics.set(
                SelectStatics.indicator,
                options.statics[SelectStatics.indicator]
            );
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, SelectAnatomy, options);

    return AdaptiveSelect.compose({
        name: `${ds.prefix}-select`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
