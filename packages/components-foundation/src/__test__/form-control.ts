import type { FormControlElement } from "../utilities/form-control.js";

// What a test element that is a form control exposes, without ElementInternals, which JSDOM doesn't have.
export class TestFormControl extends HTMLElement implements FormControlElement {
    public readonly form: HTMLFormElement | null = null;
    public readonly labels: NodeList = document.createDocumentFragment().childNodes;
    public readonly validity: ValidityState = document.createElement("input").validity;
    public readonly validationMessage: string = "";
    public readonly willValidate: boolean = true;

    public checkValidity(): boolean {
        return true;
    }

    public reportValidity(): boolean {
        return true;
    }
}
