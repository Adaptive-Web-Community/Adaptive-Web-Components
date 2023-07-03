import { 
    FASTElement,
    observable
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
     * @public
     */
    @observable
    public firstNameSuggestions: string[] = [];
    protected firstNameSuggestionsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
    }

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
     * @public
     */
    @observable
    public middleNameSuggestions: string[] = [];
    protected middleNameSuggestionsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
    }

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
     * @public
     */
    @observable
    public lastNameSuggestions: string[] = [];
    protected lastNameSuggestionsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
    }

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
     * @public
     */
    @observable
    public patientIDSuggestions: string[] = [];
    protected patientIDSuggestionsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
    }

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
        if (this.firstNameQuery !== "") {
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.first.toLowerCase().includes(this.firstNameQuery.toLowerCase())
            );
        }
        if (this.middleNameQuery !== "") {
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.middle.toLowerCase().includes(this.middleNameQuery.toLowerCase())
            );
        }
        if (this.lastNameQuery !== "") {
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.last.toLowerCase().includes(this.lastNameQuery.toLowerCase())
            );
        }
        if (this.dobQuery !== "") {
            // TODO: rethink filering dates
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.dob.toLowerCase().includes(this.dobQuery.toLowerCase())
            );
        }
        if (this.patientIDQuery !== "") {
            newFilteredPatients = newFilteredPatients.filter(
              patient => patient.patientID.toLowerCase().includes(this.patientIDQuery.toLowerCase())
            );
        }
        this.filteredPatients.splice(0, this.filteredPatients.length, ...newFilteredPatients);
        this.showPatientsList = this.filteredPatients.length ? true : false;
    }
}
