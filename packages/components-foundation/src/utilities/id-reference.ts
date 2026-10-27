/**
 * The element whose id is given, found where the element that refers to it is (its document or shadow root), as an HTML id reference is.
 *
 * @public
 */
export function findById(from: Element, id: string | null): HTMLElement | null {
    if (!id) {
        return null;
    }

    const root = from.getRootNode();
    const found = root instanceof Document || root instanceof DocumentFragment ? root.getElementById(id) : null;
    return found instanceof HTMLElement ? found : null;
}

/**
 * The elements whose ids are given, separated by white space, found where the element that refers to them is. An id without an element is
 * left out.
 *
 * @public
 */
export function findByIds(from: Element, ids: string): HTMLElement[] {
    return ids
        .split(/\s+/)
        .map(id => findById(from, id))
        .filter((element): element is HTMLElement => element !== null);
}
