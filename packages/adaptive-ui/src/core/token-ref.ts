import { isRef, Library, refs } from "design-token-library";

// Refs of any path, which are what a ref of a path given as data is made from.
const anyRefs = refs<object>();

/**
 * Gets a ref to the token at a path that is data, like a name in an anatomy written as JSON, which the types of the library can't check.
 * The library has no way to make one from a string yet.
 *
 * @internal
 */
export function refAt(path: readonly string[]): Library.Ref<unknown, never> {
    const value: unknown = path.reduce<unknown>((group, key) => Reflect.get(Object(group), key), anyRefs);
    if (!isRef(value)) {
        throw new Error(`There is no ref of ${path.join(".")}`);
    }
    return value;
}
