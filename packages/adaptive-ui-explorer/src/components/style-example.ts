import {
    contrast,
    formatPaint,
    type InteractiveSet,
    InteractiveState,
    isGradient,
    isInteractiveSet,
    isOnFill,
    isPaint,
    libraryTreatments,
    type Paint,
    resolveOnFills,
    StyleProperty,
    type StyleValues,
    treatmentProperties,
    type TreatmentRef,
    valueOnFill,
} from "@adaptive-web/adaptive-ui";
import { componentBaseStyles } from "@adaptive-web/components-fast";
import { css, customElement, FASTElement, html, observable, repeat, when } from "@microsoft/fast-element";
import { isRef, type Library, pathOf } from "design-token-library";
import { type ExplorerLibrary, properties, tokens } from "../library.js";
import { ScopeLibrary } from "../scope.js";
import { AdaptiveComponent } from "./adaptive-component.js";
import { AppSwatch, type SwatchInfo, SwatchType } from "./swatch.js";

AdaptiveComponent;
AppSwatch;

const swatchTemplate = html<SwatchInfo, StyleExample>`
    <app-swatch :swatch="${x => x}"></app-swatch>
`;

const swatchesTemplate = html<StyleExample>`
    ${repeat(x => x.swatches, swatchTemplate)}
`;

const template = html<StyleExample>`
    <template>
        <div class="example">
            <app-adaptive-component ?disabled=${x => x.disabledState} :treatment=${x => x.treatment}>
                <slot></slot>
            </app-adaptive-component>
        </div>
        ${when(x => x.showSwatches, swatchesTemplate)}
    </template>
`;

const styles = css`
    ${componentBaseStyles}

    :host {
        display: flex;
        flex-direction: column;
        gap: ${properties.density.control.vertical.gap.var};
    }

    .example {
        display: flex;
        justify-content: center;
        padding: 24px 0;
    }
`;

// The value of the token of a ref in a library. The library reads a token by its path in `tokens`, and has no function that reads a ref
// (a `valueOf(library, ref)` of the library would replace it).
function valueOf(library: ExplorerLibrary, ref: Library.Ref<unknown, never>): unknown {
    let node: unknown = library.tokens;
    for (const key of pathOf(ref)) {
        node = typeof node === "object" && node !== null ? Reflect.get(node, key) : undefined;
    }
    return typeof node === "object" && node !== null && "$value" in node ? node.$value : undefined;
}

// A paint of a state, with the name of where it is from.
interface StatePaint {
    name: string;
    paint: Paint;
}

// The paints of a value of a property in each state that it has a paint for. A value of CSS is left out.
function paintsOf(library: ExplorerLibrary, value: StyleValues | undefined): Map<InteractiveState, StatePaint> {
    const paints = new Map<InteractiveState, StatePaint>();
    const add = (state: InteractiveState, name: string, paint: unknown) => {
        if (isPaint(paint)) {
            paints.set(state, { name, paint });
        }
    };
    const addStates = (set: InteractiveSet<unknown>, name: (state: InteractiveState, value: unknown) => string | undefined) => {
        for (const state of Object.values(InteractiveState)) {
            const stateName = name(state, set[state]);
            if (stateName !== undefined) {
                const stateValue = set[state];
                const resolved = isRef(stateValue) ? valueOf(library, stateValue) : stateValue;
                add(state, stateName, isInteractiveSet(resolved) ? resolved[state] : resolved);
            }
        }
    };

    if (isOnFill(value)) {
        const { fill } = value;
        if (fill) {
            const name = `${pathOf(value.token).join(".")} on ${pathOf(fill).join(".")}`;
            addStates(valueOnFill(library, { ...value, fill }, tokens.color.context), state => `${name} ${state}`);
        }
    } else if (isRef(value)) {
        const name = pathOf(value).join(".");
        const tokenValue = valueOf(library, value);
        if (isInteractiveSet(tokenValue)) {
            addStates(tokenValue, state => `${name} ${state}`);
        } else {
            add(InteractiveState.rest, name, tokenValue);
        }
    } else if (isInteractiveSet(value)) {
        // A set of refs, each the token in that state.
        addStates(value, (state, stateValue) => isRef(stateValue) ? `${pathOf(stateValue).join(".")} ${state}` : undefined);
    }
    return paints;
}

// The contrast of two paints, which a color with opacity has none of, since it depends on what is under it.
function formatContrast(a: Paint, b: Paint): string {
    const ratio = contrast(a, b);
    return Number.isFinite(ratio) ? `Contrast: ${ratio.toFixed(2)} : 1` : "Contrast: depends on what is under it";
}

// The value of a paint as a swatch shows it: a color as CSS, and a gradient by its type, which is drawn in the swatch.
function swatchValue(paint: Paint): string {
    return isGradient(paint) ? "gradient" : formatPaint(paint);
}

// The swatches of the background, the foreground, and the border of a treatment, in each state, in a library.
function swatchesOf(library: ExplorerLibrary, treatment: TreatmentRef): SwatchInfo[] {
    const properties = resolveOnFills(treatmentProperties(libraryTreatments(library)(treatment)));
    const context = library.tokens.color.context.$value;
    const backgrounds = paintsOf(library, properties.get(StyleProperty.backgroundFill));
    const swatches: SwatchInfo[] = [];

    for (const { name, paint } of backgrounds.values()) {
        swatches.push({ type: SwatchType.fill, name, fill: formatPaint(paint), value: swatchValue(paint), contrast: formatContrast(paint, context) });
    }

    const foregrounds = paintsOf(library, properties.get(StyleProperty.foregroundFill));
    for (const [state, { name, paint }] of foregrounds) {
        const fill = backgrounds.get(state)?.paint ?? context;
        swatches.push({
            type: SwatchType.foreground,
            name,
            fill: formatPaint(fill),
            foreground: formatPaint(paint),
            value: swatchValue(paint),
            contrast: formatContrast(paint, fill),
        });
    }

    const borders = paintsOf(library, properties.get(StyleProperty.borderFillTop));
    for (const [state, { name, paint }] of borders) {
        const fill = backgrounds.get(state)?.paint ?? context;
        swatches.push({
            type: SwatchType.outline,
            name,
            fill: formatPaint(fill),
            outline: formatPaint(paint),
            value: swatchValue(paint),
            contrast: formatContrast(paint, context),
        });
    }

    return swatches;
}

/**
 * An example of a treatment, and the swatches of its colors in the scope it is in.
 */
@customElement({
    name: "app-style-example",
    template,
    styles,
})
export class StyleExample extends FASTElement {
    @observable
    public disabledState: boolean = false;

    @observable
    public showSwatches: boolean = false;
    protected showSwatchesChanged(): void {
        this.updateSwatches();
    }

    @observable
    public treatment?: TreatmentRef;
    protected treatmentChanged(): void {
        this.updateSwatches();
    }

    @observable
    public swatches: SwatchInfo[] = [];

    private library?: ExplorerLibrary;
    private readonly libraryChanged: Library.Subscriber<any> = { onChange: () => this.updateSwatches() };

    public connectedCallback(): void {
        super.connectedCallback();
        this.library = ScopeLibrary.get(this);
        this.library.subscribe(this.libraryChanged);
        this.updateSwatches();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.library?.unsubscribe(this.libraryChanged);
        this.library = undefined;
    }

    private updateSwatches(): void {
        this.swatches = this.showSwatches && this.library && this.treatment ? swatchesOf(this.library, this.treatment) : [];
    }
}
