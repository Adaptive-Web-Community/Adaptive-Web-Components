import { 
    FASTElement,
    observable
} from "@microsoft/fast-element";
import { FASTPicker, FASTTextField } from "@microsoft/fast-foundation";
import {
    patientSearchQueryChangeDetail,
    PatientSearchQueryTypes,
    patientSearchStrings
} from "./patient-search.options.js";
import {
    patientSearchStringsEn
} from "./strings.en.js";

/**
 * @public
 */
export class PatientSearch extends FASTElement {
    public static stringsProvider: patientSearchStrings = patientSearchStringsEn; 

    /**
     * @public
     */
    @observable
    public firstNameQuery: string = "";
    protected firstNameQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.$emit(
            "querychange", 
            {
                changedQuery: PatientSearchQueryTypes.firstName,
                oldValue: prev,
                newValue: next
            }, 
            { bubbles: false }
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
        this.$emit(
            "querychange", 
            {
                changedQuery: PatientSearchQueryTypes.middleName,
                oldValue: prev,
                newValue: next
            }, 
            { bubbles: false }
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
        this.$emit(
            "querychange", 
            {
                changedQuery: PatientSearchQueryTypes.lastName,
                oldValue: prev,
                newValue: next
            }, 
            { bubbles: false }
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
        this.$emit(
            "querychange", 
            {
                changedQuery: PatientSearchQueryTypes.dob,
                oldValue: prev,
                newValue: next
            }, 
            { bubbles: false }
        );
    }

    /**
     * @public
     */
    @observable
    public patientIdQuery: string = "";
    protected patientIdQueryChanged(prev: string, next: string): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.$emit(
            "querychange", 
            {
                changedQuery: PatientSearchQueryTypes.firstName,
                oldValue: prev,
                newValue: next
            }, 
            { bubbles: false }
        );
    }

    /**
     * @public
     */
    @observable
    public patientIdSuggestions: string[] = [];
    protected patientIdSuggestionsChanged(): void {
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
    public connectedCallback(): void {
        super.connectedCallback();
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

    public updateQuery = (e: Event, queryType: PatientSearchQueryTypes ) => {
        switch(queryType) {
            case PatientSearchQueryTypes.patientId:
                this.patientIdQuery = this.getPickerValue(e.target as FASTPicker);
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
}
