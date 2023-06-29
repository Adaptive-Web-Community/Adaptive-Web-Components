import { DefaultDesignSystem } from "../../design-system.js";
import { composePatientSearch } from "./patient-search.compose.js";
import { styleModules } from "./patient-search.styles.modules.js";

/**
 * The Patient Search custom element definition.
 *
 * @remarks
 * HTML Element: \<patient-search\>
 *
 * @public
 */
export const patientSearchDefinition = composePatientSearch(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
