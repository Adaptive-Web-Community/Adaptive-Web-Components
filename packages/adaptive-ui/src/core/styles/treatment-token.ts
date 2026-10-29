import { DesignToken, isRef, Library, pathOf } from "design-token-library";
import { Reference } from "../expression.js";
import { InteractiveSet, isInteractiveSet, mapStates } from "../interactive.js";
import { atName } from "../token-css.js";
import { TokenMetadata, tokenMetadata } from "../token-metadata.js";
import { refAt } from "../token-ref.js";
import { AdaptiveDesignToken } from "../token-types.js";
import { isOnFill } from "./on-fill.js";
import { StyleProperties, StyleValue, StyleValues } from "./properties.js";
import { Treatment } from "./treatment.js";

/**
 * A value of a style property in a treatment token: a value, or a {@link Reference} to a token.
 *
 * @public
 */
export type TreatmentStyleValue = Exclude<StyleValue, Library.Ref<unknown, never>> | Reference;

/**
 * A value on a fill in a treatment token, with references to its token and fill, the shape of `SerializableOnFill`.
 *
 * @public
 */
export interface TreatmentOnFill {
    readonly token: Reference;
    readonly fill?: Reference;
    readonly activeFollowsRest?: boolean;
}

/**
 * The values of a style property in a treatment token.
 *
 * @public
 */
export type TreatmentStyleValues = TreatmentStyleValue | InteractiveSet<TreatmentStyleValue> | TreatmentOnFill;

/**
 * The value of a treatment token: the treatments it is composed of, as references to treatment tokens, in order, and its own properties.
 *
 * @remarks
 * It is plain data, which is what a token of the library holds and what it is in JSON. A ref is kept as the path of its token, a
 * {@link Reference}, as an expression keeps one, since the library resolves the refs in a value; in JSON it is a DTCG alias.
 *
 * @public
 */
export interface TreatmentValue {
    readonly treatments?: readonly Reference[];
    readonly properties?: Readonly<Record<string, TreatmentStyleValues>>;
}

/**
 * A treatment as a token of the library, of the `treatment` type, which isn't written to CSS.
 *
 * @public
 */
export type TreatmentToken = DesignToken.Custom<typeof AdaptiveDesignToken.treatment, TreatmentValue>;

/**
 * A ref to a treatment token, or to a group whose `$root` is one, which stands for its root.
 *
 * @remarks
 * `density.control.treatment` is the treatment of the control density whether it is a token or a group of its variants, so adding a
 * variant changes nothing that refers to it.
 *
 * @public
 */
export type TreatmentRef = Library.Ref<TreatmentValue, never> | { readonly $root: Library.Ref<TreatmentValue, never> };

// A ref, or a group that stands for its root.
type RefOrRoot = Library.Ref<unknown, never> | { readonly $root: Library.Ref<unknown, never> };

// The path of a ref, or of a group that stands for its root, which is read as the root when the treatment is read.
const pathOfRef = (ref: RefOrRoot): string => (isRef(ref) ? pathOf(ref) : pathOf(ref.$root).slice(0, -1)).join(".");
const reference = (ref: RefOrRoot): Reference => ({ ref: pathOfRef(ref) });
const isReference = (value: unknown): value is Reference =>
    typeof value === "object" && value !== null && !isRef(value) && typeof Reflect.get(value, "ref") === "string";

/**
 * Gets the path of the token at a path of a library, which is the `$root` of a group at the path.
 *
 * @throws An error for a group without a `$root`
 *
 * @internal
 */
export function tokenPathAt(library: Library.Library<any>, path: string): string {
    const node = atName<Record<string, unknown>>(library.tokens, path);
    if ("$value" in node) {
        return path;
    }
    if (typeof node.$root === "object" && node.$root !== null) {
        return `${path}.$root`;
    }
    throw new Error(`${path} is a group without a $root, which a reference can't be to`);
}

function toValue(value: StyleValues): TreatmentStyleValues {
    if (isRef(value)) {
        return reference(value);
    }
    if (isOnFill(value)) {
        const { token, fill, activeFollowsRest } = value;
        return {
            token: reference(token),
            ...(fill !== undefined && { fill: reference(fill) }),
            ...(activeFollowsRest !== undefined && { activeFollowsRest }),
        };
    }
    if (isInteractiveSet<StyleValue>(value)) {
        return mapStates(value, state => (isRef(state) ? reference(state) : state));
    }
    return value;
}

function fromValue(library: Library.Library<any>, value: TreatmentStyleValues): StyleValues {
    const at = (data: Reference) => refAt(tokenPathAt(library, data.ref).split("."));
    if (isReference(value)) {
        return at(value);
    }
    if (typeof value === "object" && value !== null && "token" in value) {
        const { token, fill, activeFollowsRest } = value;
        return { token: at(token), ...(fill !== undefined && { fill: at(fill) }), ...(activeFollowsRest !== undefined && { activeFollowsRest }) };
    }
    if (isInteractiveSet<TreatmentStyleValue>(value)) {
        return mapStates(value, state => (isReference(state) ? at(state) : state));
    }
    return value;
}

/**
 * The config of a treatment token.
 *
 * @public
 */
export interface TreatmentConfig {
    readonly $type: typeof AdaptiveDesignToken.treatment;
    readonly $value: TreatmentValue;
    readonly $extensions?: Record<string, unknown>;
}

const config = (value: TreatmentValue, metadata?: TokenMetadata): TreatmentConfig => ({
    $type: AdaptiveDesignToken.treatment,
    $value: value,
    ...(metadata && { $extensions: tokenMetadata(metadata) }),
});

/**
 * Creates the config of a treatment token: the treatments it is composed of, in order, and its own properties, written with refs.
 *
 * @example
 * ```ts
 * actionControl: treatment({
 *     treatments: [tokens.shape.treatments.control, tokens.density.control.treatment],
 *     properties: { borderFill: color.neutral.stroke.subtle },
 * }),
 * ```
 *
 * @param spec - The treatments it is composed of, by ref, and its properties
 * @param metadata - What Adaptive UI keeps about the token, like the names it had
 * @returns The config of the token
 *
 * @public
 */
export function treatment(spec: { treatments?: readonly TreatmentRef[]; properties?: StyleProperties }, metadata?: TokenMetadata): TreatmentConfig {
    const properties = Object.fromEntries(
        Object.entries(spec.properties ?? {}).flatMap(([key, value]) => (value === undefined ? [] : [[key, toValue(value)] as const]))
    );
    return config(
        {
            ...(spec.treatments && { treatments: spec.treatments.map(reference) }),
            ...(Object.keys(properties).length > 0 && { properties }),
        },
        metadata
    );
}

/**
 * A change to the treatments that a treatment is composed of, which names a treatment by ref.
 *
 * @public
 */
export type TreatmentStep =
    | { readonly replace: TreatmentRef; readonly with: TreatmentRef }
    | { readonly remove: TreatmentRef }
    | { readonly insert: TreatmentRef; readonly before: TreatmentRef | "start" }
    | { readonly insert: TreatmentRef; readonly after?: TreatmentRef | "end" };

/**
 * The changes to a treatment: steps for the treatments it is composed of, in order, and properties to merge, where `null` removes one.
 *
 * @public
 */
export interface TreatmentChanges {
    readonly treatments?: readonly TreatmentStep[];
    readonly properties?: Readonly<Record<string, StyleValues | null>>;
}

/**
 * Creates the config of a treatment token from a treatment of a library and changes to it, for a library that extends that one.
 *
 * @remarks
 * The steps change the treatments it is composed of, in order: `replace` one with another, `remove` one, or `insert` one `before` or
 * `after` another, or at the `"start"` or the `"end"`, which is where an `insert` without a position goes. A step names a treatment by ref,
 * and a group is the same as its `$root`. The properties are merged, and `null` removes one. The treatment is read from the library when
 * this is called, and the config is its full value, so the library that extends it holds a full value like any other.
 *
 * @example
 * ```ts
 * library.extend({
 *     treatments: {
 *         actionControl: changeTreatment(library, tokens.treatments.actionControl, {
 *             treatments: [{ replace: tokens.typography.ramp.default.treatments.base, with: tokens.typography.ramp.default.treatments.plus1 }],
 *         }),
 *     },
 * });
 * ```
 *
 * @param library - The library of the treatment, which the new one extends
 * @param base - The treatment to change, by ref
 * @param changes - The steps and the properties
 * @param metadata - What Adaptive UI keeps about the token, like the names it had
 * @returns The config of the token
 * @throws An error for a step that replaces, or inserts next to, a treatment that the list doesn't have; a remove of one is a warning
 *
 * @public
 */
export function changeTreatment(
    library: Library.Library<any>,
    base: TreatmentRef,
    changes: TreatmentChanges,
    metadata?: TokenMetadata
): TreatmentConfig {
    const basePath = tokenPathAt(library, pathOfRef(base));
    const value = atName<{ $value: TreatmentValue }>(library.tokens, basePath).$value;
    // The treatments are compared as the tokens they are for, so a group and its `$root` are the same.
    const key = (ref: TreatmentRef) => tokenPathAt(library, pathOfRef(ref));
    const list = (value.treatments ?? []).map(composed => ({ key: tokenPathAt(library, composed.ref), reference: composed }));
    const indexOf = (ref: TreatmentRef, step: string) => {
        const index = list.findIndex(entry => entry.key === key(ref));
        if (index === -1) {
            throw new Error(`${pathOfRef(base)} isn't composed of ${pathOfRef(ref)}, which a step to ${step} names`);
        }
        return index;
    };

    for (const step of changes.treatments ?? []) {
        if ("replace" in step) {
            list.splice(indexOf(step.replace, "replace"), 1, { key: key(step.with), reference: reference(step.with) });
        } else if ("remove" in step) {
            const index = list.findIndex(entry => entry.key === key(step.remove));
            if (index === -1) {
                console.warn(`${pathOfRef(base)} isn't composed of ${pathOfRef(step.remove)}, which a step to remove names`);
            } else {
                list.splice(index, 1);
            }
        } else {
            const entry = { key: key(step.insert), reference: reference(step.insert) };
            if ("before" in step) {
                list.splice(step.before === "start" ? 0 : indexOf(step.before, "insert"), 0, entry);
            } else {
                list.splice(step.after === undefined || step.after === "end" ? list.length : indexOf(step.after, "insert") + 1, 0, entry);
            }
        }
    }

    const properties: Record<string, TreatmentStyleValues> = { ...value.properties };
    for (const [property, change] of Object.entries(changes.properties ?? {})) {
        if (change === null) {
            delete properties[property];
        } else {
            properties[property] = toValue(change);
        }
    }

    return config(
        {
            ...(list.length > 0 && { treatments: list.map(entry => entry.reference) }),
            ...(Object.keys(properties).length > 0 && { properties }),
        },
        metadata
    );
}

/**
 * Gets the treatment of a treatment token of a library, as the renderer takes it, with the treatments it is composed of.
 *
 * @param library - The library of the treatment
 * @param path - The path of the token, or of a group whose `$root` it is, which is the name of the treatment
 * @returns The treatment
 *
 * @public
 */
export function treatmentAt(library: Library.Library<any>, path: string): Treatment {
    const value = atName<{ $value: TreatmentValue }>(library.tokens, tokenPathAt(library, path)).$value;
    return {
        name: path,
        ...(value.treatments && { treatments: value.treatments.map(composed => treatmentAt(library, composed.ref)) }),
        ...(value.properties && {
            properties: Object.fromEntries(Object.entries(value.properties).map(([key, data]) => [key, fromValue(library, data)])),
        }),
    };
}

/**
 * Tests whether a ref, like one made from a name written as data, is to a treatment token of a library, or to a group whose `$root` is one.
 *
 * @param library - The library of the token
 * @param ref - The ref
 * @returns Whether it is a ref to a treatment
 *
 * @public
 */
export function isTreatmentRef(library: Library.Library<any>, ref: Library.Ref<unknown, never>): ref is Library.Ref<TreatmentValue, never> {
    const path = pathOf(ref).join(".");
    try {
        return atName<{ $type: unknown }>(library.tokens, tokenPathAt(library, path)).$type === AdaptiveDesignToken.treatment;
    } catch {
        return false;
    }
}

/**
 * Gets the treatment that a ref is to, which the style rules refer to.
 *
 * @public
 */
export type TreatmentResolver = (ref: TreatmentRef) => Treatment;

/**
 * Gets the treatments of a library by ref, for the renderer of the style rules.
 *
 * @param library - The library of the treatments
 * @returns A function that gets the treatment of a ref
 *
 * @public
 */
export function libraryTreatments(library: Library.Library<any>): TreatmentResolver {
    return ref => treatmentAt(library, pathOfRef(ref));
}
