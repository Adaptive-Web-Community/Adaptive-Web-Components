const containers = new Set<HTMLElement>();

/**
 * Waits for the next frame, by which a framework has rendered what changed.
 *
 * @public
 */
export function nextFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

/**
 * Adds HTML to the document, and waits for its custom elements to be defined and rendered.
 *
 * @param html - The HTML.
 * @param type - The class that the element of the HTML is an instance of, `HTMLElement` by default.
 * @returns The element of the HTML, or the first when it has several.
 *
 * @public
 */
export async function fixture(html: string): Promise<HTMLElement>;
export async function fixture<T extends HTMLElement>(html: string, type: abstract new () => T): Promise<T>;
export async function fixture(html: string, type: abstract new () => HTMLElement = HTMLElement): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    containers.add(container);

    const names = new Set(Array.from(container.querySelectorAll("*"), element => element.localName).filter(name => name.includes("-")));
    await Promise.all(Array.from(names, name => customElements.whenDefined(name)));
    // A framework may render after an element is defined or connected, and an element may wait for its children to be defined.
    await nextFrame();
    await nextFrame();

    const element = container.firstElementChild;
    if (!(element instanceof type)) {
        throw new Error(`The element of the fixture isn't a ${type.name}.`);
    }
    return element;
}

/**
 * Removes the fixtures from the document.
 *
 * @public
 */
export function cleanupFixtures(): void {
    for (const container of containers) {
        container.remove();
    }
    containers.clear();
}

/**
 * The element of a part in the shadow root of an element.
 *
 * @public
 */
export function partOf(element: Element, part: string): HTMLElement {
    const found = element.shadowRoot?.querySelector(`[part~="${part}"]`);
    if (!(found instanceof HTMLElement)) {
        throw new Error(`The element ${element.localName} has no part ${part} in an open shadow root.`);
    }
    return found;
}

/**
 * The first element of a selector, or an error when there is none.
 *
 * @public
 */
export function query(root: ParentNode, selector: string): HTMLElement {
    return queryAll(root, selector)[0];
}

/**
 * The elements of a selector, or an error when there are none.
 *
 * @public
 */
export function queryAll(root: ParentNode, selector: string): HTMLElement[] {
    const elements = Array.from(root.querySelectorAll(selector)).filter(element => element instanceof HTMLElement);
    if (elements.length === 0) {
        throw new Error(`Nothing matches ${selector}.`);
    }
    return elements;
}
