import { FASTFlipper } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { styles } from "./flipper.styles.js";
import { FlipperIconKeys, template } from "./flipper.template.js";

export function composeFlipper(
    ds: DesignSystem,
    options?: ComposeOptions<FASTFlipper, FlipperIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(FlipperIconKeys.previous)) {
            ds.statics.set(
                FlipperIconKeys.previous,
                options.statics[FlipperIconKeys.previous]
            );
        }

        if (!ds.statics.has(FlipperIconKeys.next)) {
            ds.statics.set(
                FlipperIconKeys.next,
                options.statics[FlipperIconKeys.next]
            );
        }
    }

    return FASTFlipper.compose({
        name: `${ds.prefix}-flipper`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}