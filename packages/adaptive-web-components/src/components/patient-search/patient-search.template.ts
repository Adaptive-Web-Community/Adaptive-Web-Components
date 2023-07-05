import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { PatientSearch } from "./patient-search.js"
import {
    PatientSearchQueryTypes,
} from "./patient-search.options.js";

/**
 * @public
 */
export const PatientSearchConditions = {
};

/**
 * @public
 */
export const PatientSearchParts = {
};

/**
 * @public
 */
export const PatientSearchAnatomy: ComponentAnatomy<typeof PatientSearchConditions, typeof PatientSearchParts> = {
    interactivity: Interactivity.never,
    conditions: PatientSearchConditions,
    parts: PatientSearchParts,
};


/**
 * Template for patient-search component.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<PatientSearch> =
    (ds: DesignSystem) =>
    patientSearchTemplate();

function patientSearchTemplate<T extends PatientSearch>(): ElementViewTemplate<T> {
    return html`
        <template>
            <h2 class="header">
                ${PatientSearch.stringsProvider.title}
            </h2>
            <h4
                class="dob-label"
            >
                ${PatientSearch.stringsProvider.dobLabel}
            </h4>
            <adaptive-text-field
                class="dob-input"
                maxlength="20"
                placeholder="${PatientSearch.stringsProvider.dobPlaceholder}"
            >
            </adaptive-text-field>
            <h4
                class="patient-id-label"
            >
                ${PatientSearch.stringsProvider.patientIDLabel}
            </h4>
            <adaptive-picker
                class="patient-id-picker"
                filter-selected="false"
                ${ref("patientIDPicker")}
                options="x"
                @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.patientID)}"
                @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.patientID)}"
                @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryTypes.patientID)}"
                @menuclosing="${(x, c) => x.pickerMenuClosed(c.event, PatientSearchQueryTypes.lastName)}"
                max-selected="1"
                placeholder="${PatientSearch.stringsProvider.patientIDPlaceholder}"
            ></adaptive-picker>
            ${when(x => x.expanded,
                html<T>`
                <div class="expanded-region">
                    <h4
                        class="patient-id"
                    >
                        ${PatientSearch.stringsProvider.lastNameLabel}
                    </h4>
                    <adaptive-picker
                        class="last-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.lastNameSuggestions}"
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.lastName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.lastName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryTypes.lastName)}"
                        @menuclosing="${(x, c) => x.pickerMenuClosed(c.event, PatientSearchQueryTypes.lastName)}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.lastNamePlaceholder}"
                    ></adaptive-picker>
                    <h4
                        class="first-name-label"
                    >
                        ${PatientSearch.stringsProvider.firstNameLabel}
                    </h4>
                    <adaptive-picker
                        class="first-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.firstNameSuggestions}"
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.firstName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.firstName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryTypes.firstName)}"
                        @menuclosing="${(x, c) => x.pickerMenuClosed(c.event, PatientSearchQueryTypes.firstName)}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.firstNamePlaceholder}"
                    ></adaptive-picker>
                    <h4
                        class="middle-name-label"
                    >
                        ${PatientSearch.stringsProvider.middleNameLabel}
                    </h4>
                    <adaptive-picker
                        class="middle-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.middleNameSuggestions}"
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.middleName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.middleName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryTypes.middleName)}"
                        @menuclosing="${(x, c) => x.pickerMenuClosed(c.event, PatientSearchQueryTypes.middleName)}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.middleNamePlaceholder}"
                    ></adaptive-picker>
                </div>
                `
            )}
            <adaptive-button
                class="expand-toggle"
                @click="${(x, c) => x.toggleExpandedClick()}"
            >
                ${(x) => x.expanded 
                    ? PatientSearch.stringsProvider.collapseSearchBtn 
                    : PatientSearch.stringsProvider.expandSearchBtn}
            </adaptive-button>
            <adaptive-patient-list
                class="patient-list"
                :patients="${(x) => x.filteredPatients}"
            >
            </adaptive-patient-list>
            <slot></slot>
        </template>
    `;
}
