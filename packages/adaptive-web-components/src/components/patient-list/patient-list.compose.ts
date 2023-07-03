import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { PatientList } from "./patient-list.js";
import { aestheticStyles, templateStyles } from "./patient-list.styles.js";
import { PatientListAnatomy, template } from "./patient-list.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePatientList(
    ds: DesignSystem,
    options?: ComposeOptions<PatientList>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, PatientListAnatomy.interactivity, options);

    return PatientList.compose({
        name: `${ds.prefix}-patient-list`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
