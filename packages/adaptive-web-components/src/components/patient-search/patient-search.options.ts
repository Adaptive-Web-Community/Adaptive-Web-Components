import { Patient } from "../patient-list/patient-list.options.js";

/**
 * Enumerates the patient search query types
 *
 * @public
 */
export const PatientSearchQueryType = {
    firstName: "firstName",
    middleName: "middleName",
    lastName: "lastName",
    dob: "dob",
    patientID: "patientID"
} as const;

/**
 * The types for the patient search query types
 *
 * @public
 */
export type PatientSearchQueryType = typeof PatientSearchQueryType[keyof typeof PatientSearchQueryType];

/**
 * Enumerates the patient search component query states
 *
 * @public
 */
export const PatientSearchQueryState = {
    none: "none", // no query active
    invalid: "invalid", // current query results not a superset of current component query
    valid: "valid", // have valid results for current query
    noMatches: "noMatches", // results are valid, but no matches
    tooMany: "tooMany", // too many results
} as const;

/**
 * The types for the patient search query types
 *
 * @public
 */
export type PatientSearchQueryState = typeof PatientSearchQueryState[keyof typeof PatientSearchQueryState];

export interface PatientSearchQuery {
    patientID: string,
    dob: string,
    first: string,
    middle: string,
    last: string
}

export interface PatientSearchQueryResults {
    query: PatientSearchQuery,
    results: Patient[]
}

export interface PatientSearchQueryChangeDetail {
    changedParams: PatientSearchQueryType[],
    invalidatesPrevious: boolean,
    query: PatientSearchQuery
}

export interface PatientSearchStrings {
    title: string;
    dobLabel: string;
    dobPlaceholder: string;
    patientIDLabel: string;
    patientIDPlaceholder: string;
    firstNameLabel: string;
    firstNamePlaceholder: string;
    middleNameLabel: string;
    middleNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    expandSearchBtn: string;
    collapseSearchBtn: string;
    pickerLoading: string;
    pickerNoSuggestions: string;
    pickerTypeForSuggestions: string;
    typeToSearchMessage: string;
    noMatchesMessage: string;
    loadingMessage: string;
    tooManyMessage: string;
}