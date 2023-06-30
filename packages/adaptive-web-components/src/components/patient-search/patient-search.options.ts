/**
 * Enumerates the patient search query types
 *
 * @public
 */
export const PatientSearchQueryTypes = {
    firstName: "firstName",
    middleName: "middleName",
    lastName: "lastName",
    dob: "dob",
    patientId: "patientId"
} as const;

/**
 * The types for the patient search query types
 *
 * @public
 */
export type PatientSearchQueryTypes = typeof PatientSearchQueryTypes[keyof typeof PatientSearchQueryTypes];

export interface patientSearchQueryChangeDetail {
    changedQuery: PatientSearchQueryTypes,
    oldValue: string,
    newValue: string
}

export interface patientSearchStrings {
    title: string;
    dobLabel: string;
    dobPlaceholder: string;
    patientIdLabel: string;
    patientIdPlaceholder: string;
    firstNameLabel: string;
    firstNamePlaceholder: string;
    middleNameLabel: string;
    middleNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    expandSearchBtn: string;
    collapseSearchBtn: string;
}