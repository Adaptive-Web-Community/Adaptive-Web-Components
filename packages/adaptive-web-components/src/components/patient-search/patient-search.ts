import { 
    FASTElement,
    observable,
    Updates,
} from "@microsoft/fast-element";
import { FASTPicker, FASTTextField } from "@microsoft/fast-foundation";
import {Patient} from "../patient-list/patient-list.options.js";
import {

    PatientSearchQueryChangeDetail,
    PatientSearchQueryTypes,
    PatientSearchStrings
} from "./patient-search.options.js";
import {
    patientSearchStringsEn
} from "./strings.en.js";

/**
 * @public
 */
export class PatientSearch extends FASTElement {
    public static stringsProvider: PatientSearchStrings = patientSearchStringsEn; 

    /**
     * @public
     */
    @observable
    public allPatients: Patient[] = [];
    protected allPatientsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.updateFilteredPatients();
    }

    /**
     * @public
     */
    @observable
    public filteredPatients: Patient[] = [];

    /**
     * @public
     */
    @observable
    public firstNameQuery: string = "";
    protected firstNameQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.emitQueryChange(
            {
                changedQuery: PatientSearchQueryTypes.firstName,
                oldValue: prev,
                newValue: next
            }
        );
    }

    /**
     * @internal
     */
    @observable
    public firstNameSuggestions: string[] = [];

    /**
     * @public
     */
    @observable
    public middleNameQuery: string = "";
    protected middleNameQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.emitQueryChange(
            {
                changedQuery: PatientSearchQueryTypes.middleName,
                oldValue: prev,
                newValue: next
            }
        );
    }

    /**
     * @internal
     */
    @observable
    public middleNameSuggestions: string[] = [];

    /**
     * @public
     */
    @observable
    public lastNameQuery: string = "";
    protected lastNameQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.emitQueryChange(
            {
                changedQuery: PatientSearchQueryTypes.lastName,
                oldValue: prev,
                newValue: next
            }
        );
    }

    /**
     * @internal
     */
    @observable
    public lastNameSuggestions: string[] = [];

    /**
     * @public
     */
    @observable
    public dobQuery: string = "";
    protected dobQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.emitQueryChange(
            {
                changedQuery: PatientSearchQueryTypes.dob,
                oldValue: prev,
                newValue: next
            }
        );
    }

    /**
     * @public
     */
    @observable
    public patientIDQuery: string = "";
    protected patientIDQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.emitQueryChange(
            {
                changedQuery: PatientSearchQueryTypes.patientID,
                oldValue: prev,
                newValue: next
            }
        );
    }

    /**
     * @internal
     */
    @observable
    public patientIDSuggestions: string[] = [];

    /**
     * @internal
     */
    @observable
    public expanded: boolean = false;

    /**
     * @internal
     */
    @observable
    public showPatientsList: boolean = false;

    public patientIDPicker: FASTPicker;
    public firstNamePicker: FASTPicker;
    public lastNamePicker: FASTPicker;
    public middleNamePicker: FASTPicker;

    private currentEditQuery: PatientSearchQueryTypes | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.updateFilteredPatients();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public toggleExpandedClick = () => {
        this.expanded = !this.expanded;
    }

    public updateQuery = (e: Event, queryType: PatientSearchQueryTypes ): void => {
        switch(queryType) {
            case PatientSearchQueryTypes.patientID:
                this.patientIDQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryTypes.dob:
                this.dobQuery = (e.target as FASTTextField).value;
                break;
            case PatientSearchQueryTypes.firstName:
                this.firstNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryTypes.middleName:
                this.middleNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryTypes.lastName:
                this.lastNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
        }
    }

    public pickerMenuOpen = (e: Event, queryType: PatientSearchQueryTypes ): void => {
        this.currentEditQuery = queryType;
        const picker: FASTPicker = (e.target as FASTPicker);
        picker.showLoading = true;
        if (this.filteredPatients.length) {
            Updates.enqueue(() => {
                picker.optionsList = this.updatePickerSuggestions();
                picker.showLoading = false;
            });
        }
    }

    private updatePickerSuggestions(): string[] {
        if (!this.currentEditQuery) {
            return [];
        }
        const newOptions: string[] = []
        switch(this.currentEditQuery) {
            case PatientSearchQueryTypes.patientID:
                this.filteredPatients.forEach(
                    (patient) => {
                        if (!newOptions.includes(patient.patientID)){
                            newOptions.push(patient.patientID)
                        }
                    }
                )
                break;

            case PatientSearchQueryTypes.firstName:
                this.filteredPatients.forEach(
                    (patient) => {
                        if (!newOptions.includes(patient.first)){
                            newOptions.push(patient.first)
                        }
                    }
                )
                break;

            case PatientSearchQueryTypes.middleName:
                this.filteredPatients.forEach(
                    (patient) => {
                        if (patient.middle !== "" && !newOptions.includes(patient.middle)){
                            newOptions.push(patient.middle)
                        }
                    }
                )
                break;

            case PatientSearchQueryTypes.lastName:
                this.filteredPatients.forEach(
                    (patient) => {
                        if (!newOptions.includes(patient.last)){
                            newOptions.push(patient.last)
                        }
                    }
                )
                break;
        }
        return newOptions;
    }

    public pickerMenuClosed = (e: Event, queryType: PatientSearchQueryTypes ): void => {
        this.currentEditQuery = null;
        (e.target as FASTPicker).optionsList.splice(0);
    }

    private getPickerValue(picker: FASTPicker) : string {
        return picker.selection !== "" 
            ? picker.selection 
            : picker.query;
    }

    private emitQueryChange(detail: PatientSearchQueryChangeDetail): void {
        this.updateFilteredPatients();
        this.$emit(
            "querychange", 
            detail, 
            { bubbles: false }
        );
    }

    private updateFilteredPatients(): void {
        let newFilteredPatients: Patient[] = this.allPatients.slice(0);
        let query: string = "";
        if (this.firstNameQuery !== "") {
            query = this.firstNameQuery.toLowerCase();
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.first.toLowerCase().includes(query)
            );
        }
        if (this.middleNameQuery !== "") {
            query = this.middleNameQuery.toLowerCase()
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.middle.toLowerCase().includes(query)
            );
        }
        if (this.lastNameQuery !== "") {
            query = this.lastNameQuery.toLowerCase()
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.last.toLowerCase().includes(query)
            );
        }
        if (this.dobQuery !== "") {
            query = this.dobQuery.toLowerCase();
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.dob.toLowerCase().includes(query)
            );
        }
        if (this.patientIDQuery !== "") {
            query = this.patientIDQuery.toLowerCase()
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.patientID.toLowerCase().includes(query)
            );
        }
        this.filteredPatients.splice(0, this.filteredPatients.length, ...newFilteredPatients);
        this.showPatientsList = this.filteredPatients.length ? true : false;
    }

    private clearAllSuggestions(): void {
        this.patientIDPicker.optionsList.splice(0);
        this.firstNamePicker.optionsList.splice(0);
        this.lastNamePicker.optionsList.splice(0);
        this.middleNamePicker.optionsList.splice(0);
    }
}
