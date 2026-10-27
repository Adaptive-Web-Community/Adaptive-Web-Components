// The nodes that are content: elements, and text other than white space.
function contentNodes(nodes: readonly Node[]): Node[] {
    return nodes.filter(node =>
        node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim())
    );
}

/**
 * Whether there is content: an element, or text other than white space.
 *
 * @remarks
 * For the content of a slot, so a part around it can be hidden when it is empty (a label).
 *
 * @public
 */
export function hasContent(nodes: readonly Node[]): boolean {
    return contentNodes(nodes).length > 0;
}

/**
 * Whether content is one icon: a single SVG element, and no text other than white space.
 *
 * @remarks
 * For the content of a default slot, so the styles of an element that shows only an icon can differ (a button that is square).
 *
 * @public
 */
export function isIconOnly(nodes: readonly Node[]): boolean {
    const content = contentNodes(nodes);
    return content.length === 1 && content[0] instanceof SVGElement;
}
