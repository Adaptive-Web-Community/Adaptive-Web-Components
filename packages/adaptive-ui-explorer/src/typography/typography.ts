import { evaluate, type Evaluated, type TypeRampPosition, typeRampPositions } from "@adaptive-web/adaptive-ui";
import { customElement, FASTElement, Observable, observable } from "@microsoft/fast-element";
import type { Library } from "design-token-library";
import type { ExplorerLibrary } from "../library.js";
import { ScopeLibrary } from "../scope.js";
import { State } from "../state.js";
import { typographyStyles as styles } from "./typography.styles.js";
import { typographyTemplate as template } from "./typography.template.js";

interface TypePosition {
    fontSize: string;
    lineHeight: string;
}

function format(value: Evaluated): string {
    const rounded = (n: number) => `${Math.round(n * 100) / 100}`;
    return typeof value === "number" ? rounded(value) : `${rounded(value.value)}${value.unit}`;
}

/**
 * The positions of the body type ramp, with their sizes and line heights in the scope it is in.
 */
@customElement({
    name: "app-typography",
    template: template(),
    styles,
})
export class Typography extends FASTElement {
    @State state!: State;

    @observable
    public values: Partial<Record<TypeRampPosition, TypePosition>> = {};

    private library?: ExplorerLibrary;
    private readonly libraryChanged: Library.Subscriber<any> = { onChange: () => this.updateValues() };

    public connectedCallback(): void {
        super.connectedCallback();
        this.library = ScopeLibrary.get(this);
        this.library.subscribe(this.libraryChanged);
        Observable.getNotifier(this.state).subscribe(this, "multiline");
        this.updateValues();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.library?.unsubscribe(this.libraryChanged);
        Observable.getNotifier(this.state).unsubscribe(this, "multiline");
    }

    public handleChange(): void {
        this.updateValues();
    }

    private updateValues(): void {
        const library = this.library;
        if (!library) {
            return;
        }
        const ramp = library.tokens.typography.ramp.body;
        const lineHeight = this.state.multiline ? ramp.lineHeightMultiline : ramp.lineHeight;
        const values: Partial<Record<TypeRampPosition, TypePosition>> = {};
        for (const position of typeRampPositions) {
            values[position] = {
                fontSize: format(evaluate(ramp.fontSize[position].$value, library)),
                lineHeight: format(evaluate(lineHeight[position].$value, library)),
            };
        }
        this.values = values;
    }
}
