import { FASTElementDefinition } from "@microsoft/fast-element";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Dialog } from "./dialog.js";
import { aestheticStyles, templateStyles } from "./dialog.styles.js";
import { DialogAnatomy, template } from "./dialog.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDialog(
    ds: DesignSystem,
    options?: ComposeOptions<Dialog>
): Promise<FASTElementDefinition<typeof Dialog>> {
    const styles = DesignSystem.assembleStyles(defaultStyles, DialogAnatomy, options);

    return FASTElementDefinition.compose(Dialog, {
        name: `${ds.prefix}-dialog`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
