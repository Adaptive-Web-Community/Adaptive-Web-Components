/**
 * The ARIA that an element has by default, for its `ElementInternals`.
 *
 * @remarks
 * A component's function of its properties gives it, and the binding assigns it to the element's `ElementInternals` when one of those
 * properties changes. An attribute the author puts on the element overrides it. A property that is absent is left as it is, and `null` clears
 * it.
 *
 * @public
 */
export type DefaultAria = Partial<ARIAMixin>;
