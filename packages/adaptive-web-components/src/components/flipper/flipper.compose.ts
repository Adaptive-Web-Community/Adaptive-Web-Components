import { FASTFlipper } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./flipper.styles.js";
import { FlipperAnatomy, FlipperStatics, template } from "./flipper.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeFlipper(
    ds: DesignSystem,
    options?: ComposeOptions<FASTFlipper, FlipperStatics>
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

    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, FlipperAnatomy.interactivity, options);

    return FASTFlipper.compose({
        name: `${ds.prefix}-flipper`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
