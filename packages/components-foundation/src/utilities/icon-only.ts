/**
 * Whether content is one icon: a single SVG element, and no text other than white space.
 *
 * @remarks
 * For the content of a default slot, so the styles of an element that shows only an icon can differ (a button that is square).
 *
 * @public
 */
export function isIconOnly(nodes: readonly Node[]): boolean {
    const content = nodes.filter(node =>
        node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim())
    );

    return content.length === 1 && content[0] instanceof SVGElement;
}
