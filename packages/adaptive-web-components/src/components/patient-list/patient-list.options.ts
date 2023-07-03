export interface PatientListStrings {
    firstNameColumnTitle: string;
    middleNameColumnTitle: string;
    lastNameColumnTitle: string;
    patientIDColumnTitle: string;
    dobColumnTitle: string;
}

export interface PatientListSelectionChangeDetail {
    oldValue: Patient | null,
    newValue: Patient | null
}

export interface Patient {
    first: string;
    middle: string;
    last: string;
    patientID: string;
    dob: string;
    zip?: string;
    phone1?: string;
    phone2?: string;
    phone3?: string;
    legacyID?: string;
    generatedID?: string;
}