import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";

/**
 * The element of an {@link OptionListController} whose selection it keeps: a Listbox, a Select, or a Picker.
 *
 * @public
 */
export interface OptionListOwner {
    /** Whether any number of options can be selected, or one. */
    readonly multiple: boolean;

    /** Whether the user can't change the selection, though the keys move the active option. */
    readonly readOnly: boolean;
}

/**
 * The options of an {@link OptionListController}.
 *
 * @public
 */
export type OptionListOptions = {
    /**
     * Whether the active option is selected when the keys move to it, in single selection, as in a listbox; not in the popup of a select,
     * where Enter selects it.
     */
    selectionFollowsFocus: boolean;

    /**
     * What to do when the user changed the selection: emit the owner's `input` and `change`.
     */
    onUserChange: () => void;

    /**
     * What to do when the active option changed: point the element that has the focus at it (its `ariaActiveDescendantElement`).
     */
    onActiveChange: (option: ListboxOptionElement | null) => void;
};

// How long the letters typed to find an option are kept, as a native select does.
const typeaheadTimeout = 500;

/**
 * The options of a listbox, which a Listbox, the popup of a Select, and the popup of a Picker share: which one is active (the visual focus,
 * with `aria-activedescendant`), the selection (one option, or any number), and the keys of the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ | ARIA listbox pattern} that move between them and select them.
 *
 * @remarks
 * The owner's controller creates it, and calls {@link OptionListController.setOptions} and
 * {@link OptionListController.optionSelectedChanged} when its binding observes those changes, and {@link OptionListController.handleKeydown}
 * for the keys it gives to the list. Hidden options are skipped; disabled ones are reached, as the ARIA practices ask of listbox options, and
 * aren't selected.
 *
 * @public
 */
export class OptionListController {
    private items: readonly ListboxOptionElement[] = [];
    private current: ListboxOptionElement | null = null;
    private typed = "";
    private typedAt = 0;

    constructor(private readonly owner: OptionListOwner, private readonly options: OptionListOptions) {}

    /**
     * The options, in their order.
     */
    public get all(): readonly ListboxOptionElement[] {
        return this.items;
    }

    /**
     * The selected options, in their order.
     */
    public get selected(): readonly ListboxOptionElement[] {
        return this.items.filter(option => option.selected);
    }

    /**
     * The value of the first selected option, or `""` when none is, as a native select's.
     */
    public get value(): string {
        return this.items.find(option => option.selected)?.value ?? "";
    }

    /**
     * The active option, or `null`.
     */
    public get active(): ListboxOptionElement | null {
        return this.current;
    }

    /**
     * Whether the user is typing to find an option, so that a space is part of what is typed.
     */
    public get typing(): boolean {
        return this.typed !== "" && Date.now() - this.typedAt < typeaheadTimeout;
    }

    /**
     * The options changed. In single selection, of several selected, the last stays selected, as in a native select.
     */
    public setOptions(options: readonly ListboxOptionElement[]): void {
        this.items = options;
        if (!this.owner.multiple) {
            const selected = this.selected;
            for (const option of selected.slice(0, -1)) {
                option.selected = false;
            }
        }
        if (this.current && !options.includes(this.current)) {
            this.setActive(null);
        }
    }

    /**
     * An option was selected or unselected, by the user or by code. In single selection, an option that is selected unselects the others.
     */
    public optionSelectedChanged(option: ListboxOptionElement): void {
        if (option.selected && !this.owner.multiple) {
            for (const other of this.items) {
                if (other !== option && other.selected) {
                    other.selected = false;
                }
            }
        }
    }

    /**
     * Selects the options with the value, and unselects the others; in single selection, the first with it. Not the user's change.
     */
    public setValue(value: string): void {
        let found = false;
        for (const option of this.items) {
            const select: boolean = option.value === value && (this.owner.multiple || !found);
            found ||= select;
            option.selected = select;
        }
    }

    /**
     * Makes an option the active one, which the element with the focus points at, and scrolls it into view. `null` makes none active.
     */
    public setActive(option: ListboxOptionElement | null): void {
        if (this.current && this.current !== option) {
            this.current.active = false;
        }
        this.current = option;
        this.options.onActiveChange(option);
        if (option) {
            option.active = true;
            option.scrollIntoView?.({ block: "nearest" });
        }
    }

    /**
     * Makes the first selected option the active one, or the first that can be, as when the list gets the focus or opens.
     */
    public activateSelected(): void {
        const available = this.available();
        this.setActive(available.find(option => option.selected) ?? available[0] ?? null);
    }

    /**
     * Selects an option as the user asked: only it in single selection, and toggles it in multiple selection. Does nothing for a disabled
     * option or a read only owner; emits through `onUserChange` when the selection changed.
     */
    public selectByUser(option: ListboxOptionElement): void {
        if (option.disabled || this.owner.readOnly) {
            return;
        }
        if (this.owner.multiple) {
            option.selected = !option.selected;
        } else if (option.selected) {
            return;
        } else {
            option.selected = true;
            this.optionSelectedChanged(option);
        }
        this.options.onUserChange();
    }

    /**
     * Handles a key of the listbox pattern: Up and Down (without wrapping), Home, End, typing to find an option, and Space; in multiple
     * selection, Shift with Up and Down, which select as they move, and Control with A, which selects all. Returns whether it handled it,
     * and prevents its default.
     */
    public handleKeydown(event: KeyboardEvent): boolean {
        const handled = this.handleKey(event);
        if (handled) {
            event.preventDefault();
        }
        return handled;
    }

    private handleKey(event: KeyboardEvent): boolean {
        const { key } = event;
        const available = this.available();
        const index = this.current ? available.indexOf(this.current) : -1;
        const multiple = this.owner.multiple;

        if (multiple && (event.ctrlKey || event.metaKey) && key.toLowerCase() === "a") {
            this.selectAll(available);
            return true;
        }

        switch (key) {
            case "ArrowDown":
                this.move(available[Math.min(index + 1, available.length - 1)], event.shiftKey);
                return true;
            case "ArrowUp":
                this.move(available[index < 0 ? 0 : Math.max(index - 1, 0)], event.shiftKey);
                return true;
            case "Home":
                this.move(available[0], false);
                return true;
            case "End":
                this.move(available[available.length - 1], false);
                return true;
            case " ":
                // A space while typing to find an option is part of what is typed.
                if (this.typing) {
                    return this.typeahead(key, available);
                }
                if (this.current) {
                    this.selectByUser(this.current);
                }
                return true;
        }

        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            return this.typeahead(key, available);
        }
        return false;
    }

    // The options the keys move between: not hidden (by a Picker's filter). Disabled ones too, so the user finds them.
    private available(): ListboxOptionElement[] {
        return this.items.filter(option => !option.hidden);
    }

    private move(option: ListboxOptionElement | undefined, select: boolean): void {
        if (!option) {
            return;
        }
        this.setActive(option);
        if (this.owner.multiple ? select : this.options.selectionFollowsFocus) {
            this.selectByUser(option);
        }
    }

    private selectAll(available: readonly ListboxOptionElement[]): void {
        if (this.owner.readOnly) {
            return;
        }
        const select = available.some(option => !option.selected);
        for (const option of available) {
            option.selected = select;
        }
        this.options.onUserChange();
    }

    // Typing moves to the next option whose text starts with what was typed in the last half second. The same letter typed again cycles
    // through the options that start with it, as in a native select.
    private typeahead(key: string, available: readonly ListboxOptionElement[]): boolean {
        const now = Date.now();
        this.typed = now - this.typedAt < typeaheadTimeout ? this.typed + key : key;
        this.typedAt = now;

        const typed = this.typed.toLocaleLowerCase();
        const repeated = [...typed].every(letter => letter === typed[0]);
        const search = repeated ? typed[0] : typed;
        const index = this.current ? available.indexOf(this.current) : -1;
        // A new search starts from the active option, and a repeated letter from the one after it.
        const start = repeated || typed.length === 1 ? index + 1 : Math.max(index, 0);
        const ordered = [...available.slice(start), ...available.slice(0, start)];
        const found = ordered.find(option => option.text.toLocaleLowerCase().startsWith(search));
        if (found) {
            this.move(found, false);
        }
        return true;
    }
}
