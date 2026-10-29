import { StyleProperties, StylePropertyShorthand, StyleValues } from "./properties.js";

/**
 * A treatment: a set of style properties with a name, which is applied as a unit, like "the accent fill of a control" or "the shape of a
 * layer".
 *
 * @remarks
 * A treatment is plain data. It is composed of other treatments and has properties of its own, which are applied after those of the
 * treatments, so a property of its own replaces the same property of one of them, and a later treatment replaces an earlier one.
 *
 * @public
 */
export interface Treatment {
    /**
     * The name that an anatomy written as data refers to the treatment by, like `"shape.control"`.
     */
    readonly name?: string;

    /**
     * The treatments it is composed of, applied in order.
     */
    readonly treatments?: readonly Treatment[];

    /**
     * The properties of its own, applied after those of the treatments.
     */
    readonly properties?: StyleProperties;
}

/**
 * Gets the properties of a treatment, or of a rule, with those of the treatments it is composed of.
 *
 * @remarks
 * A shorthand is the properties that it is for, and a property that has no value (`undefined`, `null`, or `""`) is left out. Zero is a value.
 *
 * @param treatment - The treatment, or a rule, which has the treatments and the properties of one
 * @returns The value of each property, in the order the properties were first given
 *
 * @public
 */
export function treatmentProperties(treatment: Pick<Treatment, "treatments" | "properties">): Map<string, StyleValues> {
    const properties = new Map<string, StyleValues>();
    for (const composed of treatment.treatments ?? []) {
        for (const [key, value] of treatmentProperties(composed)) {
            properties.set(key, value);
        }
    }
    for (const [key, value] of Object.entries(treatment.properties ?? {})) {
        if (value === undefined || value === null || value === "") {
            continue;
        }
        const keys: readonly string[] = isShorthand(key) ? StylePropertyShorthand[key] : [key];
        for (const property of keys) {
            properties.set(property, value);
        }
    }
    return properties;
}

function isShorthand(key: string): key is StylePropertyShorthand {
    return Object.prototype.hasOwnProperty.call(StylePropertyShorthand, key);
}
