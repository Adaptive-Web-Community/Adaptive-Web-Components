import { customElement, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { State } from "../state.js";
import { typographyStyles as styles } from "./typography.styles.js";
import { typographyTemplate as template } from "./typography.template.js";
import { typeRampScale } from "./type-scale.js";

interface TypePosition {
    fontSize: string;
    lineHeight: string;
}

@customElement({
    name: "app-typography",
    template: template(),
    styles,
})
export class Typography extends FASTElement {
    @State state!: State;

    @observable
    minus2: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    minus1: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    base: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus1: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus2: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus3: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus4: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus5: TypePosition = { fontSize: "", lineHeight: "" };

    @observable
    plus6: TypePosition = { fontSize: "", lineHeight: "" };

    private updateScheduled = false;

    connectedCallback(): void {
        super.connectedCallback();
        
        // Wait for next frame to ensure styles are applied
        requestAnimationFrame(() => {
            this.updateComputedValues();
        });

        // Subscribe to token changes
        this.subscribeToTokenChanges();

        // Subscribe to state.multiline changes
        Observable.getNotifier(this.state).subscribe(this, "multiline");
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        
        // Unsubscribe from state changes
        Observable.getNotifier(this.state).unsubscribe(this, "multiline");
    }

    private subscribeToTokenChanges(): void {
        // Subscribe to all fontSize and lineHeight tokens
        const positions = [
            typeRampScale.minus2, typeRampScale.minus1, typeRampScale.base,
            typeRampScale.plus1, typeRampScale.plus2, typeRampScale.plus3,
            typeRampScale.plus4, typeRampScale.plus5, typeRampScale.plus6
        ];

        positions.forEach(position => {
            position.fontSize.subscribe(this);
            position.lineHeight.subscribe(this);
            position.lineHeightMultiline.subscribe(this);
        });

        // Also subscribe to multiplier and ratio changes
        typeRampScale.multiplier.subscribe(this);
        typeRampScale.lineHeightRatio.subscribe(this);
        typeRampScale.lineHeightMultilineRatio.subscribe(this);
        typeRampScale.lineHeightSnap.subscribe(this);
    }

    handleChange(source: any, propertyName?: any): void {
        // Handle both DesignToken changes and Observable property changes
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(() => {
                this.updateComputedValues();
                this.updateScheduled = false;
            });
        }
    }

    private updateComputedValues(): void {
        const positions = ["minus2", "minus1", "base", "plus1", "plus2", "plus3", "plus4", "plus5", "plus6"];
        
        positions.forEach(position => {
            const element = this.shadowRoot?.querySelector(`p.${position}`) as HTMLElement;
            if (element) {
                const computedStyle = getComputedStyle(element);
                (this as any)[position] = {
                    fontSize: computedStyle.fontSize,
                    lineHeight: computedStyle.lineHeight
                };
            }
        });
    }
}
