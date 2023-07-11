import { 
    attr,
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
     * Max results to display.  Default is 20.
     * 
     * @public
     */
    @attr({ attribute: "max-results" })
    public maxResults: number = 20;

    /**
     * @public
     */
    @observable
    public queryResults: PatientSearchQueryResults | null = null;
    protected queryResultsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.updateFilteredPatients();
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

    private componentQueriesEmpty(): boolean {
        let isEmpty = false;
        if (
            this.dobQuery === "" &&
            this.patientIDQuery === "" &&
            this.firstNameQuery === "" &&
            this.middleNameQuery === "" &&
            this.lastNameQuery === ""

        ) {
            isEmpty = true;
        }
        return isEmpty;
    }

    private isQueryEmpty(query: PatientSearchQuery): boolean {
        let isEmpty = false;
        // if a query would include all the possible results of the components current state
        // we can keep the current patient list with broader results and filter further in the component
        if (
            query.dob === "" &&
            query.first === "" &&
            query.middle === "" &&
            query.last === "" &&
            query.patientID === ""
        ){
            isEmpty = true;
        }

        return isEmpty;
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

    /**
     * @internal
     */
    public toggleExpandedClick = () => {
        this.expanded = !this.expanded;
        if (this.expanded) {
            Updates.enqueue(() => {
                this.updateSuggestions();
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
        if (this.queryResults !== null && !this.componentQueriesEmpty()) {
            let newFilteredPatients: Patient[] = this.queryResults.results.slice(0);
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
                newFilteredPatients = newFilteredPatients.filter(
                    patient => patient.dob === this.dobQuery
                );
            }
            if (this.patientIDQuery !== "") {
                query = this.patientIDQuery.toLowerCase()
                newFilteredPatients = newFilteredPatients.filter(
                    patient => patient.patientID.toLowerCase().includes(query)
                );
            }
            this.filteredPatients.splice(0, this.filteredPatients.length, ...newFilteredPatients);
        } else {
            this.filteredPatients.splice(0, this.filteredPatients.length);
        }
        this.showPatientsList = this.filteredPatients.length ? true : false;

        this.updateSuggestions();
        this.updateQueryState();
    }

    private updateSuggestions() {
        const patientIDSuggestions: string[] = [];
        const firstNameSuggestions: string[] = [];
        const middleNameSuggestions: string[] = [];
        const lastNameSuggestions: string[] = [];

        this.filteredPatients.forEach(
            (patient) => {
                if (patient.patientID !== "" && !patientIDSuggestions.includes(patient.patientID)){
                    patientIDSuggestions.push(patient.patientID)
                }
                if (patient.first !== "" && !firstNameSuggestions.includes(patient.first)){
                    firstNameSuggestions.push(patient.first)
                }
                if (patient.middle !== "" && !middleNameSuggestions.includes(patient.middle)){
                    middleNameSuggestions.push(patient.middle)
                }
                if (patient.last !== "" && !lastNameSuggestions.includes(patient.last)){
                    lastNameSuggestions.push(patient.last)
                }
            }
        )

        this.patientIDSuggestions = patientIDSuggestions.sort((a, b) => a.localeCompare(b));
        this.firstNameSuggestions = firstNameSuggestions.sort((a, b) => a.localeCompare(b));
        this.middleNameSuggestions = middleNameSuggestions.sort((a, b) => a.localeCompare(b));
        this.lastNameSuggestions = lastNameSuggestions.sort((a, b) => a.localeCompare(b));
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

    private updateQueryState(): void {
        if (this.componentQueriesEmpty()) {
            // user has not entered anything
            this.queryState = PatientSearchQueryState.none;
        } else if (this.queryResults === null) {
            // waiting for results
            this.queryState = PatientSearchQueryState.invalid
        } else if (this.isQueryEmpty(this.queryResults.query) || this.isQueryValid(this.queryResults.query)) {
            if (this.filteredPatients.length === 0) {
                this.queryState = PatientSearchQueryState.noMatches
            } else if (this.filteredPatients.length > this.maxResults) {
                this.queryState = PatientSearchQueryState.tooMany
            } else {
                this.queryState = PatientSearchQueryState.valid
            }
        } else {
            this.queryState = PatientSearchQueryState.invalid;
        }
    }

    private clearAllSuggestions(): void {
        this.patientIDSuggestions.splice(0);
        this.firstNameSuggestions.splice(0);
        this.lastNameSuggestions.splice(0);
        this.middleNameSuggestions.splice(0);
    }

}
