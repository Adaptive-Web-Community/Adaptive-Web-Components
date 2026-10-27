import type { RadioElement } from "../radio/radio.js";
import { RovingFocusController } from "../utilities/roving-focus.controller.js";
import type { RadioGroupElement } from "./radio-group.js";

/**
 * What a {@link RadioGroupController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type RadioGroupInternals = Pick<ElementInternals, "role" | "ariaOrientation" | "ariaLabelledByElements">;

/**
 * The behavior of a {@link RadioGroupElement}: the `radiogroup` role, named by its label; one radio checked; the arrow keys, which move the
 * focus and check the radio they move to (with a {@link RovingFocusController}); and the group's name given to its radios.
 *
 * @remarks
 * The element's binding creates it, calls {@link RadioGroupController.connect} and {@link RadioGroupController.disconnect} with the
 * element's lifecycle, and calls {@link RadioGroupController.setRadios}, {@link RadioGroupController.radioCheckedChanged},
 * {@link RadioGroupController.nameChanged}, {@link RadioGroupController.orientationChanged}, and {@link RadioGroupController.labelsChanged}
 * when its framework observes those changes.
 *
 * @public
 */
export class RadioGroupController {
    private radios: readonly RadioElement[] = [];
    private readonly rovingFocus: RovingFocusController;

    constructor(private readonly host: RadioGroupElement, private readonly internals: RadioGroupInternals) {
        internals.role = "radiogroup";
        // Checking the radio the focus moves to emits its input and change, as a click does.
        this.rovingFocus = new RovingFocusController(host, { keys: "both", onMove: radio => radio.click() });
    }

    /**
     * Starts handling the keyboard. For when the element is connected.
     */
    public connect(): void {
        this.rovingFocus.connect();
        this.orientationChanged();
    }

    /**
     * Stops handling the keyboard. For when the element is disconnected.
     */
    public disconnect(): void {
        this.rovingFocus.disconnect();
    }

    /**
     * The radios of the group changed. When several are checked, the last stays checked, as for native radios.
     */
    public setRadios(radios: readonly RadioElement[]): void {
        this.radios = radios;
        this.nameChanged();

        const checked = radios.filter(radio => radio.checked);
        for (const radio of checked.slice(0, -1)) {
            radio.checked = false;
        }

        this.rovingFocus.setItems(radios);
        this.rovingFocus.setActive(this.checkedRadio());
    }

    /**
     * A radio was checked or unchecked, by the user or by code. A radio that is checked unchecks the others.
     */
    public radioCheckedChanged(radio: RadioElement): void {
        if (radio.checked) {
            for (const other of this.radios) {
                if (other !== radio && other.checked) {
                    other.checked = false;
                }
            }
        }

        this.rovingFocus.setActive(this.checkedRadio());
    }

    /**
     * The group's name changed: it is given to the radios, unless it is `null`.
     */
    public nameChanged(): void {
        const { name } = this.host;
        if (name !== null) {
            for (const radio of this.radios) {
                radio.name = name;
            }
        }
    }

    /**
     * The orientation changed.
     */
    public orientationChanged(): void {
        this.internals.ariaOrientation = this.host.orientation;
    }

    /**
     * The elements in the `label` slot changed. They name the group.
     */
    public labelsChanged(labels: readonly Element[]): void {
        this.internals.ariaLabelledByElements = labels.length > 0 ? labels : null;
    }

    /**
     * The value of the checked radio, or `null`. Setting it checks the radio with the value and unchecks the others; `null` unchecks them all.
     */
    public get value(): string | null {
        return this.checkedRadio()?.value ?? null;
    }
    public set value(value: string | null) {
        for (const radio of this.radios) {
            radio.checked = value !== null && radio.value === value;
        }
        this.rovingFocus.setActive(this.checkedRadio());
    }

    private checkedRadio(): RadioElement | null {
        return this.radios.find(radio => radio.checked) ?? null;
    }
}
