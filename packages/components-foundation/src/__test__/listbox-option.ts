import { collapsedText, type ListboxOptionElement } from "../listbox-option/listbox-option.js";

// An option as a binding has it, which tells its list when it is selected; `onSelected` stands in for the binding's observation.
export class TestOption extends HTMLElement implements ListboxOptionElement {
    public static onSelected: ((option: TestOption) => void) | null = null;
    private _selected = false;
    public defaultSelected = false;
    public disabled = false;
    public active = false;

    public get value(): string {
        return this.getAttribute("value") ?? this.text;
    }
    public set value(value: string) {
        this.setAttribute("value", value);
    }

    public get text(): string {
        return collapsedText(this);
    }

    public get selected(): boolean {
        return this._selected;
    }
    public set selected(selected: boolean) {
        if (selected !== this._selected) {
            this._selected = selected;
            TestOption.onSelected?.(this);
        }
    }
}
customElements.define("test-option", TestOption);

export function createOptions(parent: Element, texts: readonly string[]): TestOption[] {
    return texts.map(text => {
        const option = parent.appendChild(new TestOption());
        option.textContent = text;
        return option;
    });
}
