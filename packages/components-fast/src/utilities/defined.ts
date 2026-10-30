/**
 * Calls back once each of the elements that isn't defined yet is defined in the registry.
 *
 * @remarks
 * For a container that knows its children by their class: a child defined after the container becomes one of its children without a change
 * of what is slotted, so the container looks at its children again.
 *
 * @public
 */
export function onDefined(elements: readonly Element[], registry: CustomElementRegistry, callback: () => void): void {
    for (const element of elements) {
        if (!element.matches(":defined")) {
            void registry.whenDefined(element.localName).then(callback);
        }
    }
}
