import { DefaultDesignSystem } from "../../design-system.js";
import { composePatientList } from "./patient-list.compose.js";
import { styleModules } from "./patient-list.styles.modules.js";

/**
 * The Patient Search custom element definition.
 *
 * @remarks
 * HTML Element: \<patient-list\>
 *
 * @public
 */
export const patientListDefinition = composePatientList(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
