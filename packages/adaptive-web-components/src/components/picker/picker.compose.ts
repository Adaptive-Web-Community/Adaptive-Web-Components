import { FASTPicker } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker.styles.js";
import { template } from "./picker.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePicker(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPicker>
): FASTElementDefinition {
    return FASTPicker.compose({
        name: `${ds.prefix}-picker`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}