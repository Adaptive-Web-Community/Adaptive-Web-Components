import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { PatientSearch } from "./patient-search.js"
import {
    PatientSearchQueryState,
    PatientSearchQueryType,
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
            <input
                class="dob-input"
                type="date"  
                name="trip-start"
                placeholder="${PatientSearch.stringsProvider.dobPlaceholder}"
            >
            </input>
            <h4
                class="patient-id-label"
            >
                ${PatientSearch.stringsProvider.patientIDLabel}
            </h4>
            <adaptive-picker
                class="patient-id-picker"
                filter-selected="false"
                ${ref("patientIDPicker")}
                @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.patientID)}"
                @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.patientID)}"
                @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.patientID)}"
                :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                :optionsList="${(x) => x.patientIDSuggestions}"
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
                        ${ref("lastNamePicker")}
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.lastName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.lastName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.lastName)}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                        :optionsList="${(x) => x.lastNameSuggestions}"
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
                        ${ref("firstNamePicker")}
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.firstName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.firstName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.firstName)}"
                        :optionsList="${(x) => x.firstNameSuggestions}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
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
                        ${ref("middleNamePicker")}
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.middleName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.middleName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.middleName)}"
                        :optionsList="${(x) => x.middleNameSuggestions}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
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
