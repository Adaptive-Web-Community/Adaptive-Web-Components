import { 
    FASTElement,
    observable,
    Updates,
} from "@microsoft/fast-element";
import { FASTPicker, FASTTextField } from "@microsoft/fast-foundation";
import {Patient} from "../patient-list/patient-list.options.js";
import {
    PatientSearchQuery,
    PatientSearchQueryChangeDetail,
    PatientSearchQueryResults,
    PatientSearchQueryState,
    PatientSearchQueryType,
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
    public queryResults: PatientSearchQueryResults = {query: this.getEmptyQuery(), results: []};
    protected queryResultsChanged(): void {
        if (this.isQueryValid(this.queryResults.query)) {
            this.queryState = PatientSearchQueryState.valid;
            this.patients = this.queryResults.results;
            this.updateFilteredPatients();
        } else {
            this.queryState = PatientSearchQueryState.invalid;
            this.patients = [];
        }
    }
    /**
     * @internal
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
        this.handleQueryChange(
            PatientSearchQueryType.firstName,
            prev,
            next,
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
        this.handleQueryChange(
            PatientSearchQueryType.middleName,
            prev,
            next,
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
        this.handleQueryChange(
            PatientSearchQueryType.lastName,
            prev,
            next
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
        this.handleQueryChange(
            PatientSearchQueryType.dob,
            prev,
            next
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
        this.handleQueryChange(
            PatientSearchQueryType.patientID,
            prev,
            next
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

    /**
     * @internal
     */
    @observable
    public queryState: PatientSearchQueryState = PatientSearchQueryState.none;

    public patientIDPicker: FASTPicker;
    public firstNamePicker: FASTPicker;
    public lastNamePicker: FASTPicker;
    public middleNamePicker: FASTPicker;

    private patients: Patient[] = [];

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

    private isQueryValid(query: PatientSearchQuery): boolean {
        let isValid = false;
        // if a query would include all the possible results of the components current state
        // we can keep the current patient list with broader results and filter further in the component
        if (
            this.dobQuery === query.dob &&
            (query.first === "" || this.firstNameQuery.startsWith(query.first)) &&
            (query.middle === "" || this.middleNameQuery.startsWith(query.middle)) &&
            (query.last === "" || this.lastNameQuery.startsWith(query.last)) &&
            (query.patientID === "" || this.patientIDQuery.startsWith(query.patientID))
        ){
            isValid = true;
        }

        return isValid;
    }

    private isQueryEmpty(query: PatientSearchQuery): boolean {
        let isEmpty = false;
        if (
            query.dob === "" &&
            query.patientID === "" &&
            query.first === "" &&
            query.middle === "" &&
            query.last === ""

        ) {
            isEmpty = true;
        }
        return isEmpty;
    }


    /**
     * @internal
     */
    public toggleExpandedClick = () => {
        this.expanded = !this.expanded;
        if (this.expanded) {
            Updates.enqueue(() => {
                this.updatePickers();
            });
        }
    }

    public updateQuery = (e: Event, queryType: PatientSearchQueryType ): void => {
        switch(queryType) {
            case PatientSearchQueryType.patientID:
                this.patientIDQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryType.dob:
                this.dobQuery = (e.target as FASTTextField).value;
                break;
            case PatientSearchQueryType.firstName:
                this.firstNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryType.middleName:
                this.middleNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
            case PatientSearchQueryType.lastName:
                this.lastNameQuery = this.getPickerValue(e.target as FASTPicker);
                break;
        }

        if (!this.isQueryValid(this.queryResults.query)) {
            this.queryState = PatientSearchQueryState.invalid;
            this.patients = [];
        } 
        else if (
            this.dobQuery === "" && 
            this.patientIDQuery === "" && 
            this.firstNameQuery === "" && 
            this.middleNameQuery === "" && 
            this.lastNameQuery === ""
        ) {
            this.queryState = PatientSearchQueryState.none;
        } else {
            this.queryState = PatientSearchQueryState.valid;
        }
    }

    public pickerMenuOpen = (e: Event, queryType: PatientSearchQueryType ): void => {
        const picker: FASTPicker = (e.target as FASTPicker);
        if (this.filteredPatients.length) {
            Updates.enqueue(() => {
                picker.optionsList = picker.optionsList.slice(0);
            });
        }
    }

    private getPickerValue(picker: FASTPicker) : string {
        return picker.selection !== "" 
            ? picker.selection 
            : picker.query;
    }

    private handleQueryChange(changedParam: PatientSearchQueryType, prev: string, next: string): void {
        this.updateFilteredPatients();
        const queryChangeDetail: PatientSearchQueryChangeDetail = {
            changedParams: [changedParam],
            invalidatesPrevious: false,
            query: {
                patientID: this.patientIDQuery,
                dob: this.dobQuery,
                first: this.firstNameQuery,
                middle: this.middleNameQuery,
                last: this.lastNameQuery
            }
        };
        this.$emit(
            "querychange", 
            queryChangeDetail,
            { bubbles: false }
        );
    }

    private updateFilteredPatients(): void {
        let newFilteredPatients: Patient[] = this.patients.slice(0);
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

        this.patientIDSuggestions = patientIDSuggestions;
        this.firstNameSuggestions = firstNameSuggestions;
        this.middleNameSuggestions = middleNameSuggestions;
        this.lastNameSuggestions = lastNameSuggestions;
    }

    private getEmptyQuery(): PatientSearchQuery {
        return {
            patientID: "",
            dob: "",
            first: "",
            middle: "",
            last: ""
        };
    }

        // private clearAllSuggestions(): void {
    //     this.patientIDPicker.optionsList = [];
    //     this.firstNamePicker.optionsList = [];
    //     this.lastNamePicker.optionsList = [];
    //     this.middleNamePicker.optionsList = [];
    // }

    
    // private getCurrentQuery(): PatientSearchQuery {
    //     return {
    //         patientID: this.patientIDQuery,
    //         dob: this.dobQuery,
    //         first: this.firstNameQuery,
    //         middle: this.middleNameQuery,
    //         last: this.lastNameQuery
    //     };
    // }

}
