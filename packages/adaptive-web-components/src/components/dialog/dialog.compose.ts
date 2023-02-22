import { FASTDialog } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./dialog.styles.js";
import { template } from "./dialog.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeDialog(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDialog>
): FASTElementDefinition {
    return FASTDialog.compose({
        name: `${ds.prefix}-dialog`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}