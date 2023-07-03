import { 
    attr,
    FASTElement,
    observable
} from "@microsoft/fast-element";
import { FASTDataGrid } from "@microsoft/fast-foundation";
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

    /**
     * @internal
     */
    public selectionChange = (): void => {
        this.selectedIndex = this.patientGrid.selectedRowIndexes.length 
            ? this.patientGrid.selectedRowIndexes[0] 
            : -1;
    }
}
