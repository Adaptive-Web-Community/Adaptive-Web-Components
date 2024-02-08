import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./flipper.styles.js";
import { FlipperAnatomy, FlipperStatics, template } from "./flipper.template.js";
import { Flipper } from "./flipper.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeFlipper(
    ds: DesignSystem,
    options?: ComposeOptions<Flipper, FlipperStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(FlipperStatics.previous)) {
            ds.statics.set(
                FlipperStatics.previous,
                options.statics[FlipperStatics.previous]
            );
        }

        if (!ds.statics.has(FlipperStatics.next)) {
            ds.statics.set(
                FlipperStatics.next,
                options.statics[FlipperStatics.next]
            );
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, FlipperAnatomy, options);

    return Flipper.compose({
        name: `${ds.prefix}-flipper`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
