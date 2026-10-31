/**
 * Calls back once each of the elements that isn't defined yet is defined in its registry.
 *
 * @remarks
 * For a container that knows its children by their class: a child defined after the container becomes one of its children without a change
 * of what is slotted, so the container looks at its children again.
 *
 * An element's registry is the one of the root it is in, with scoped registries (`customElementRegistry`), and the global one without them.
 *
 * @public
 */
export function onDefined(elements: readonly Element[], callback: () => void): void {
    for (const element of elements) {
        if (!element.matches(":defined")) {
            void registryOf(element).whenDefined(element.localName).then(callback);
        }
    }
}

// The DOM types of TypeScript don't have `customElementRegistry` on an element yet.
function registryOf(element: Element): CustomElementRegistry {
    return "customElementRegistry" in element && element.customElementRegistry instanceof CustomElementRegistry ?
        element.customElementRegistry :
        customElements;
}
