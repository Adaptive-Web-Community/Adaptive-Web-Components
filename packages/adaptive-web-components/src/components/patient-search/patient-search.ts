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
        Updates.enqueue(() => {
            this.updateFilteredPatients();
        });
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public toggleExpandedClick = () => {
        this.expanded = !this.expanded;
        if (this.expanded) {
            Updates.enqueue(() => {
                this.updatePickers();
            });
        }
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
                picker.optionsList = picker.optionsList.slice(0);
                picker.showLoading = false;
            });
        }
    }

    public pickerMenuClosed = (e: Event, queryType: PatientSearchQueryTypes ): void => {
        this.currentEditQuery = null;
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

        this.updatePickers();
    }

    private updatePickers() {
        const patientIDSuggestions: string[] = [];
        const firstNameSuggestions: string[] = [];
        const middleNameSuggestions: string[] = [];
        const lastNameSuggestions: string[] = [];

        this.filteredPatients.forEach(
            (patient) => {
                if (!patientIDSuggestions.includes(patient.patientID)){
                    patientIDSuggestions.push(patient.patientID)
                }
                if (!firstNameSuggestions.includes(patient.first)){
                    firstNameSuggestions.push(patient.first)
                }
                if (!middleNameSuggestions.includes(patient.middle)){
                    middleNameSuggestions.push(patient.middle)
                }
                if (!lastNameSuggestions.includes(patient.last)){
                    lastNameSuggestions.push(patient.last)
                }
            }
        )

        this.patientIDPicker.optionsList = patientIDSuggestions;
        this.firstNamePicker.optionsList = firstNameSuggestions;
        this.middleNamePicker.optionsList= middleNameSuggestions;
        this.lastNamePicker.optionsList = lastNameSuggestions;
    }

    private clearAllSuggestions(): void {
        this.patientIDPicker.optionsList = [];
        this.firstNamePicker.optionsList = [];
        this.lastNamePicker.optionsList = [];
        this.middleNamePicker.optionsList = [];
    }
}
