// A stand-in for the `ElementInternals` that a controller uses, which JSDOM doesn't have, recording what it is given.
export class TestInternals {
    public role: string | null = null;
    public ariaChecked: string | null = null;
    public ariaRequired: string | null = null;
    public ariaReadOnly: string | null = null;
    public ariaDisabled: string | null = null;
    public ariaOrientation: string | null = null;
    public ariaLabelledByElements: ReadonlyArray<Element> | null = null;
    public ariaActiveDescendantElement: Element | null = null;
    public ariaMultiSelectable: string | null = null;
    public ariaHasPopup: string | null = null;
    public ariaExpanded: string | null = null;
    public ariaValueNow: string | null = null;
    public ariaValueMin: string | null = null;
    public ariaValueMax: string | null = null;
    public ariaValueText: string | null = null;
    public form: HTMLFormElement | null = null;
    public labels: NodeList = document.createDocumentFragment().childNodes;
    public readonly states = new Set<string>();
    public formValue: File | string | FormData | null = null;
    public validity: Partial<ValidityState> = {};
    public validationMessage = "";
    public validationAnchor: HTMLElement | undefined;

    public setFormValue(value: File | string | FormData | null): void {
        this.formValue = value;
    }

    public setValidity(flags: ValidityStateFlags = {}, message: string = "", anchor?: HTMLElement): void {
        this.validity = flags;
        this.validationMessage = message;
        this.validationAnchor = anchor;
    }
}
