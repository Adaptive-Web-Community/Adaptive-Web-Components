import { 
    attr,
    FASTElement,
    Notifier,
    Observable,
    observable,
    Updates
} from "@microsoft/fast-element";
import { ColumnDefinition, FASTDataGrid } from "@microsoft/fast-foundation";
import {
    Patient,
    PatientListStrings as PatientListStrings
} from "./patient-list.options.js";
import {
    patientListStringsEn
} from "./strings.en.js";

/**
 * A component that displays a list of patients and emits patient selection events
 * 
 * @public
 */
export class PatientList extends FASTElement {
    public static stringsProvider: PatientListStrings = patientListStringsEn;

    /**
     * The patients to be displayed
     * 
     * @public
     */
    @observable
    public patients: Patient[] = [];
    protected patientsChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.observePatients();
        this.updateSort();
    }

    /**
     * The current sort column
     * 
     * @public
     */
    @attr({ attribute: "sort-by" })
    public sortBy: string = "last";
    protected sortByChanged(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.updateSort();
    } 

    /**
     * The currently selected patient index,
     * -1 when none selected
     * 
     * @public
     */
    @attr({ attribute: "selected-index" })
    public selectedIndex: number = -1;
    protected selectedItemIndexChanged():void {
        this.$emit(
            "selectionChange", 
            {}, 
            { bubbles: false }
        );
    } 

    /**
     * ref to the patient list data-grid component
     * 
     * @internal
     */
    public patientGrid: FASTDataGrid;

    private arrayChangeNotifier: Notifier | null = null;
    private isUpdatingSort: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("updatesort", this.handleSetSort);
        this.observePatients();
        this.updateSort();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("updatesort", this.handleSetSort);
        this.unobservePatients();
    }

    /**
     * @internal
     */
    public selectionChange = (): void => {
        this.selectedIndex = this.patientGrid.selectedRowIndexes.length 
            ? this.patientGrid.selectedRowIndexes[0] 
            : -1;
    }

    /**
     * @internal
     */
    public handleSetSort = (e: CustomEvent): void => {
        if (e.defaultPrevented) {
            return;
        }

        this.sortBy = (e.detail as ColumnDefinition).columnDataKey;
    }

    private updateSort(): void {
        if (this.isUpdatingSort) {
            return;
        }
        this.isUpdatingSort = true;
        const sortedPatients = this.patients.slice(0);

        switch(this.sortBy) {
            case "first":
                sortedPatients.sort((a, b) => a.first.localeCompare(b.first));
                break;

            case "last":
                sortedPatients.sort((a, b) => a.last.localeCompare(b.last));
                break;
            
            case "middle":
                sortedPatients.sort((a, b) => a.middle.localeCompare(b.middle));
                break;

            case "patientID":
                sortedPatients.sort((a, b) => a.patientID.localeCompare(b.patientID));
                break;
                
            case "dob":
                sortedPatients.sort((a, b) => a.dob.localeCompare(b.dob));
                break;
        }

        this.patients.splice(0, this.patients.length, ...sortedPatients);

        Updates.enqueue(() => {
            this.isUpdatingSort = false;
        })
    }

    public handleChange = ():void => {
        this.updateSort();
    }

    private observePatients(): void {
        this.unobservePatients();
        this.arrayChangeNotifier = Observable.getNotifier(this.patients);
        this.arrayChangeNotifier.subscribe(this);
    }

    private unobservePatients(): void {
        if (this.arrayChangeNotifier) {
            this.arrayChangeNotifier.unsubscribe(this);
            this.arrayChangeNotifier = null;
        } 
    }
}
