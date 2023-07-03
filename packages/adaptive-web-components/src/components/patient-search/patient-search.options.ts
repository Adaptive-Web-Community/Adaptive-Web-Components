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
    patientID: "patientID"
} as const;

/**
 * The types for the patient search query types
 *
 * @public
 */
export type PatientSearchQueryTypes = typeof PatientSearchQueryTypes[keyof typeof PatientSearchQueryTypes];

export interface PatientSearchQueryChangeDetail {
    changedQuery: PatientSearchQueryTypes,
    oldValue: string,
    newValue: string
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
}