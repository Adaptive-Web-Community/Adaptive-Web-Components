/**
 * The type of the values of a constant object, to make a union type of the values of an enumeration.
 *
 * @example
 * ```ts
 * export const Foo = { a: "a", b: "b" } as const;
 * export type Foo = ValuesOf<typeof Foo>;
 * ```
 *
 * @public
 */
export type ValuesOf<T> = T[keyof T];
