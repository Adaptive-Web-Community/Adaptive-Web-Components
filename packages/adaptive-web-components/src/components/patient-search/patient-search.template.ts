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
            <adaptive-text-field
                class="dob-input"
                type="date"
                @change="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.dob)}"
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
                @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.patientID)}"
                @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.patientID)}"
                @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.patientID)}"
                :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                :optionsList="${(x) => x.patientIDSuggestions}"
                max-selected="1"
                placeholder="${PatientSearch.stringsProvider.patientIDPlaceholder}"
                loading-text="${PatientSearch.stringsProvider.pickerLoading}"
                no-suggestions-text="${(x) => x.queryState === PatientSearchQueryState.none
                    ? PatientSearch.stringsProvider.pickerTypeForSuggestions
                    : PatientSearch.stringsProvider.pickerNoSuggestions
                }"
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
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.lastName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.lastName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.lastName)}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                        :optionsList="${(x) => x.lastNameSuggestions}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.lastNamePlaceholder}"
                        loading-text="${PatientSearch.stringsProvider.pickerLoading}"
                        no-suggestions-text="${(x) => x.queryState === PatientSearchQueryState.none
                            ? PatientSearch.stringsProvider.pickerTypeForSuggestions
                            : PatientSearch.stringsProvider.pickerNoSuggestions
                        }"
                    ></adaptive-picker>
                    <h4
                        class="first-name-label"
                    >
                        ${PatientSearch.stringsProvider.firstNameLabel}
                    </h4>
                    <adaptive-picker
                        class="first-name-picker"
                        filter-selected="false"
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.firstName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.firstName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.firstName)}"
                        :optionsList="${(x) => x.firstNameSuggestions}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.firstNamePlaceholder}"
                        loading-text="${PatientSearch.stringsProvider.pickerLoading}"
                        no-suggestions-text="${(x) => x.queryState === PatientSearchQueryState.none
                            ? PatientSearch.stringsProvider.pickerTypeForSuggestions
                            : PatientSearch.stringsProvider.pickerNoSuggestions
                        }"
                    ></adaptive-picker>
                    <h4
                        class="middle-name-label"
                    >
                        ${PatientSearch.stringsProvider.middleNameLabel}
                    </h4>
                    <adaptive-picker
                        class="middle-name-picker"
                        filter-selected="false"
                        @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.middleName)}"
                        @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryType.middleName)}"
                        @menuopening="${(x, c) => x.pickerMenuOpen(c.event, PatientSearchQueryType.middleName)}"
                        :optionsList="${(x) => x.middleNameSuggestions}"
                        :showLoading="${(x) => x.queryState === PatientSearchQueryState.invalid}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.middleNamePlaceholder}"
                        loading-text="${PatientSearch.stringsProvider.pickerLoading}"
                        no-suggestions-text="${(x) => x.queryState === PatientSearchQueryState.none
                            ? PatientSearch.stringsProvider.pickerTypeForSuggestions
                            : PatientSearch.stringsProvider.pickerNoSuggestions
                        }"
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
                hidden="${(x) => x.queryState === PatientSearchQueryState.valid ? void 0 : true}"
                class="${(x) => x.queryState === PatientSearchQueryState.valid ? '' : 'hidden'} patient-list"
                :patients="${(x) => x.filteredPatients}"
            >
            </adaptive-patient-list>
            <div class="status-pane">
                ${when(x => x.queryState === PatientSearchQueryState.none,
                    html<T>`
                    <h3
                        class="type-to-search-message"
                    >
                        ${PatientSearch.stringsProvider.typeToSearchMessage}
                    </h3>
                `
                )}
                ${when(x => x.queryState === PatientSearchQueryState.noMatches,
                    html<T>`
                    <h3
                        class="no-matches-message"
                    >
                        ${PatientSearch.stringsProvider.noMatchesMessage}
                    </h3>
                `
                )}
                ${when(x => x.queryState === PatientSearchQueryState.invalid,
                    html<T>`
                    <h3
                        class="loading-message"
                    >
                        ${PatientSearch.stringsProvider.loadingMessage}
                    </h3>
                `
                )}
                ${when(x => x.queryState === PatientSearchQueryState.tooMany,
                    html<T>`
                    <h3
                        class="too-many-message"
                    >
                        ${PatientSearch.stringsProvider.tooManyMessage}
                    </h3>
                `
                )}
                </div>
            <slot></slot>
        </template>
    `;
}
