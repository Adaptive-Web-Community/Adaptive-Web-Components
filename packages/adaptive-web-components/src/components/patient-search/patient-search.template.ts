import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
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

export function patientSearchTemplate<T extends PatientSearch>(): ElementViewTemplate<T> {
    return html`
        <template>
            <h2 class="header">
                ${PatientSearch.stringsProvider.title}
            </h2>
            <adaptive-text-field
                class="dob-input"
                maxlength="20"
                placeholder="${PatientSearch.stringsProvider.dobPlaceholder}"
            >
            ${PatientSearch.stringsProvider.dobLabel}
            </adaptive-text-field>
            <adaptive-picker
                class="patient-id-picker"
                filter-selected="false"
                :optionsList="${(x) => x.patientIdSuggestions}"
                @selectionchange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.patientId)}"
                @querychange="${(x, c) => x.updateQuery(c.event, PatientSearchQueryTypes.patientId)}"
                max-selected="1"
                placeholder="${PatientSearch.stringsProvider.patientIdPlaceholder}"
            ></adaptive-picker>
            ${when(x => x.expanded,
                html<T>`
                <div class="expanded-region">
                    <adaptive-picker
                        class="last-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.lastNameSuggestions}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.lastNamePlaceholder}"
                    ></adaptive-picker>
                    <adaptive-picker
                        class="first-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.firstNameSuggestions}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.firstNamePlaceholder}"
                    ></adaptive-picker>
                    <adaptive-picker
                        class="middle-name-picker"
                        filter-selected="false"
                        :optionsList="${(x) => x.middleNameSuggestions}"
                        max-selected="1"
                        placeholder="${PatientSearch.stringsProvider.middleNamePlaceholder}"
                    ></adaptive-picker>
                </div>
                `
            )}
            <adaptive-button
                @click="${(x, c) => x.toggleExpandedClick()}"
            >
                ${(x) => x.expanded 
                    ? PatientSearch.stringsProvider.collapseSearchBtn 
                    : PatientSearch.stringsProvider.expandSearchBtn}
            </adaptive-button>
            <slot></slot>
        </template>
    `;
}
