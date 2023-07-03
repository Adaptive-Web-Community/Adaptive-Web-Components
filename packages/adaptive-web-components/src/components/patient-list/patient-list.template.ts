import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { DataGridSelectionMode } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { PatientList } from "./patient-list.js"
import { PatientListSelectionChangeDetail } from "./patient-list.options.js";

/**
 * @public
 */
export const PatientListConditions = {
};

/**
 * @public
 */
export const PatientListParts = {
};

/**
 * @public
 */
export const PatientListAnatomy: ComponentAnatomy<typeof PatientListConditions, typeof PatientListParts> = {
    interactivity: Interactivity.never,
    conditions: PatientListConditions,
    parts: PatientListParts,
};

const columnDefinitions = [
    {
        columnDataKey: "patientID",
        title: PatientList.stringsProvider.patientIDColumnTitle,
    },
    {
        columnDataKey: "last",
        title: PatientList.stringsProvider.lastNameColumnTitle,
    },
    {
        columnDataKey: "first",
        title: PatientList.stringsProvider.firstNameColumnTitle,
    },
    {
        columnDataKey: "middle",
        title: PatientList.stringsProvider.middleNameColumnTitle,
    },
    {
        columnDataKey: "dob",
        title: PatientList.stringsProvider.dobColumnTitle,
    },
]

/**
 * Template for patient-list component.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<PatientList> =
    (ds: DesignSystem) =>
    patientListTemplate();

function patientListTemplate<T extends PatientList>(): ElementViewTemplate<T> {
    return html`
        <template>
            <adaptive-data-grid
                ${ref("patientGrid")}
                class="patient-grid"
                selection-mode="${DataGridSelectionMode.singleRow}"
                :columnDefinitions="${columnDefinitions}"
                :gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                :rowsData="${ x => x.patients}"
                @selectionchange="${(x, c) => x.selectionChange()}"
            >
            </adaptive-data-grid>
        </template>
    `;
}
