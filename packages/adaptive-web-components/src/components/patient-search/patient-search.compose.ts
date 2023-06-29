import type { ComposableStyles, FASTElementDefinition } from "@microsoft/fast-element";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { PatientSearch } from "./patient-search.js";
import { aestheticStyles, templateStyles } from "./patient-search.styles.js";
import { PatientSearchAnatomy, template } from "./patient-search.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composePatientSearch(
    ds: DesignSystem,
    options?: ComposeOptions<PatientSearch>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, PatientSearchAnatomy.interactivity, options);

    return PatientSearch.compose({
        name: `${ds.prefix}-patient-search`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
