import type { SliderLabelElement } from "../slider-label/slider-label.js";
import { Orientation } from "../utilities/orientation.js";
import { type SliderElement, sliderPercent } from "./slider.js";

/**
 * What a {@link SliderController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type SliderInternals = Pick<
    ElementInternals,
    "role" | "ariaValueNow" | "ariaValueMin" | "ariaValueMax" | "ariaValueText" | "ariaOrientation" | "ariaReadOnly" | "ariaDisabled" | "states" | "setFormValue"
>;

/**
 * The options of a {@link SliderController}.
 *
 * @public
 */
export type SliderOptions = {
    /**
     * What to do when the value changed, by the user or by code: tell the binding's framework, which observes it.
     */
    onValueChange: () => void;
};

/**
 * The behavior of a {@link SliderElement}: the `slider` role and its values; the value, kept in the range and on a step, with the `value`
 * attribute as the default; the keys of the ARIA slider pattern; dragging on the track; `input` and `change`; the form value and reset; and
 * where its labels are.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link SliderController.connect} with the track once the template
 * rendered and {@link SliderController.disconnect} with the element's lifecycle, and calls {@link SliderController.defaultValueChanged},
 * {@link SliderController.stateChanged} when `min`, `max`, `step`, `orientation`, `readOnly`, or `valueTextFormatter` change,
 * {@link SliderController.setLabels}, {@link SliderController.disabledChanged} from `formDisabledCallback`, and
 * {@link SliderController.formReset} from `formResetCallback`. The binding's `value` is the controller's.
 *
 * @public
 */
export class SliderController {
    private current = "";
    // Whether the user or code changed the value, after which the `value` attribute no longer sets it, as for a native range.
    private dirty = false;
    private track: HTMLElement | null = null;
    private labels: readonly SliderLabelElement[] = [];
    private disabled = false;
    private dragStart: string | null = null;

    constructor(private readonly host: SliderElement, private readonly internals: SliderInternals, private readonly options: SliderOptions) {
        internals.role = "slider";
    }

    /**
     * The value, in the range and on a step.
     */
    public get value(): string {
        return this.current;
    }
    public set value(value: string) {
        this.dirty = true;
        this.setValue(value);
    }

    /**
     * Makes the element focusable, unless the author set its `tabindex`, and starts handling the keys and the pointer. For when the element
     * is connected and has rendered its track.
     */
    public connect(track: HTMLElement): void {
        this.track = track;
        const { host } = this;
        if (!host.hasAttribute("tabindex")) {
            host.tabIndex = 0;
        }
        host.addEventListener("keydown", this.handleKeydown);
        host.addEventListener("pointerdown", this.handlePointerdown);
        host.addEventListener("pointermove", this.handlePointermove);
        host.addEventListener("pointerup", this.handlePointerup);
        host.addEventListener("pointercancel", this.handlePointerup);
        this.stateChanged();
    }

    /**
     * Stops handling the keys and the pointer. For when the element is disconnected.
     */
    public disconnect(): void {
        const { host } = this;
        host.removeEventListener("keydown", this.handleKeydown);
        host.removeEventListener("pointerdown", this.handlePointerdown);
        host.removeEventListener("pointermove", this.handlePointermove);
        host.removeEventListener("pointerup", this.handlePointerup);
        host.removeEventListener("pointercancel", this.handlePointerup);
    }

    /**
     * The `value` attribute changed. It sets the value until the user or code changes it.
     */
    public defaultValueChanged(): void {
        if (!this.dirty) {
            this.setValue(this.host.defaultValue ?? this.middle());
        }
    }

    /**
     * The range, the step, the orientation, read only, or the value text changed. The value is kept in the range and on a step.
     */
    public stateChanged(): void {
        const { host, internals } = this;
        internals.ariaValueMin = `${host.min}`;
        internals.ariaValueMax = `${host.max}`;
        internals.ariaOrientation = host.orientation;
        internals.ariaReadOnly = host.readOnly ? "true" : null;
        this.setValue(this.dirty ? this.current : host.defaultValue ?? this.middle());
        this.updateValueText();
        this.updateLabels();
    }

    /**
     * The slider labels changed.
     */
    public setLabels(labels: readonly SliderLabelElement[]): void {
        this.labels = labels;
        this.updateLabels();
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it.
     */
    public disabledChanged(disabled: boolean): void {
        this.disabled = disabled;
        this.internals.ariaDisabled = disabled ? "true" : null;
    }

    /**
     * The form was reset: the value goes back to the default.
     */
    public formReset(): void {
        this.dirty = false;
        this.setValue(this.host.defaultValue ?? this.middle());
    }

    /**
     * Changes the value by a number of steps.
     */
    public stepBy(count: number): void {
        this.value = `${Number(this.current) + count * this.stepSize()}`;
    }

    private stepSize(): number {
        const { step } = this.host;
        return step > 0 ? step : 1;
    }

    // The middle of the range, as a native range's value without the attribute.
    private middle(): string {
        const { min, max } = this.host;
        return `${max < min ? min : min + (max - min) / 2}`;
    }

    // A value in the range, on the step from `min`, as a native range sanitizes it.
    private sanitize(value: string): string {
        const { min, max } = this.host;
        const high = Math.max(min, max);
        const step = this.stepSize();
        let number = Number.parseFloat(value);
        if (Number.isNaN(number)) {
            number = Number(this.middle());
        }
        number = Math.min(high, Math.max(min, number));
        const steps = Math.round((number - min) / step);
        let snapped = min + steps * step;
        if (snapped > high) {
            snapped -= step;
        }
        // Rounds away the error of floating point, to the decimals of the step.
        const decimals = (`${step}`.split(".")[1] ?? "").length;
        return `${Number(snapped.toFixed(decimals))}`;
    }

    private setValue(value: string): void {
        const sanitized = this.sanitize(value);
        if (sanitized === this.current) {
            return;
        }
        this.current = sanitized;
        this.internals.ariaValueNow = sanitized;
        this.internals.setFormValue(sanitized);
        this.updateValueText();
        this.options.onValueChange();
    }

    private updateValueText(): void {
        this.internals.ariaValueText = this.host.valueTextFormatter?.(this.current) ?? null;
    }

    private updateLabels(): void {
        const { min, max, orientation } = this.host;
        for (const label of this.labels) {
            label.percent = sliderPercent(label.position, min, max);
            label.orientation = orientation;
        }
    }

    private changeByUser(value: string, change: boolean): void {
        if (this.disabled || this.host.readOnly) {
            return;
        }
        const before = this.current;
        this.value = value;
        if (this.current !== before) {
            this.host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
            if (change) {
                this.host.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }

    // The keys of the ARIA slider pattern: the arrows by a step (Left and Right swapped right to left), Page Up and Page Down by a tenth of
    // the range, Home and End to the ends.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented || event.target !== this.host) {
            return;
        }
        const { min, max } = this.host;
        const value = Number(this.current);
        const step = this.stepSize();
        const page = Math.max(step, Math.round((max - min) / 10 / step) * step);
        const rtl = getComputedStyle(this.host).direction === "rtl";
        let next: number;
        switch (event.key) {
            case "ArrowUp":
                next = value + step;
                break;
            case "ArrowDown":
                next = value - step;
                break;
            case "ArrowRight":
                next = rtl ? value - step : value + step;
                break;
            case "ArrowLeft":
                next = rtl ? value + step : value - step;
                break;
            case "PageUp":
                next = value + page;
                break;
            case "PageDown":
                next = value - page;
                break;
            case "Home":
                next = min;
                break;
            case "End":
                next = max;
                break;
            default:
                return;
        }
        event.preventDefault();
        this.changeByUser(`${next}`, true);
    };

    // The value at a point of the track: from its start to its end, bottom to top when vertical.
    private valueAt(event: PointerEvent): string {
        const { min, max, orientation } = this.host;
        const rect = (this.track ?? this.host).getBoundingClientRect();
        let ratio: number;
        if (orientation === Orientation.vertical) {
            ratio = rect.height > 0 ? (rect.bottom - event.clientY) / rect.height : 0;
        } else {
            ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
            if (getComputedStyle(this.host).direction === "rtl") {
                ratio = 1 - ratio;
            }
        }
        return `${min + Math.min(1, Math.max(0, ratio)) * (max - min)}`;
    }

    private readonly handlePointerdown = (event: PointerEvent): void => {
        if (this.disabled || this.host.readOnly || event.button !== 0) {
            return;
        }
        this.host.setPointerCapture?.(event.pointerId);
        this.dragStart = this.current;
        this.internals.states.add("dragging");
        this.host.focus();
        this.changeByUser(this.valueAt(event), false);
    };

    private readonly handlePointermove = (event: PointerEvent): void => {
        if (this.dragStart !== null) {
            this.changeByUser(this.valueAt(event), false);
        }
    };

    // The end of a drag emits `change`, when the value changed, as a native range does.
    private readonly handlePointerup = (): void => {
        if (this.dragStart === null) {
            return;
        }
        const changed = this.dragStart !== this.current;
        this.dragStart = null;
        this.internals.states.delete("dragging");
        if (changed) {
            this.host.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };
}
