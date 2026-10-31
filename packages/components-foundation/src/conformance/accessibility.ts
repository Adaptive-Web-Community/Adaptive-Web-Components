/// <reference types="@vitest/browser-playwright" />
import { cdp } from "vitest/browser";

type Session = ReturnType<typeof cdp>;

const documentOf = (session: Session) => session.send("DOM.getDocument", { depth: -1, pierce: true });
const accessibilityNodesOf = (session: Session, backendNodeId: number) =>
    session.send("Accessibility.getPartialAXTree", { backendNodeId, fetchRelatives: false });

type DomNode = Awaited<ReturnType<typeof documentOf>>["root"];
type AXNode = Awaited<ReturnType<typeof accessibilityNodesOf>>["nodes"][number];

/**
 * What the browser exposes of an element to assistive technology: its node of the accessibility tree.
 *
 * @public
 */
export interface AccessibilityNode {
    /**
     * The id of the element in the browser, which the {@link AccessibilityNode.relations} of other nodes refer to.
     */
    readonly id: number;

    /**
     * Whether the element isn't in the accessibility tree, as when it is hidden.
     */
    readonly ignored: boolean;

    /**
     * The role, such as `button`.
     */
    readonly role: string | undefined;

    /**
     * The accessible name.
     */
    readonly name: string | undefined;

    /**
     * The states and properties, such as `disabled`, `expanded`, or `level`, by name.
     */
    readonly properties: Readonly<Record<string, unknown>>;

    /**
     * The ids of the elements of each relation, such as `controls`, by name.
     */
    readonly relations: Readonly<Record<string, readonly number[]>>;
}

const probeAttribute = "data-accessibility-probe";
let probes = 0;

/**
 * The node of the accessibility tree of an element in the document or in a shadow root, as the browser computes it.
 *
 * @remarks
 * The role, the states, and the name that a component sets through `ElementInternals` aren't in the DOM, so they are read from the browser,
 * with the Chrome DevTools Protocol. Needs Vitest's browser mode with the Playwright provider and Chromium.
 *
 * @public
 */
export async function accessibilityNodeOf(element: Element): Promise<AccessibilityNode> {
    const session = cdp();
    const id = await backendNodeIdOf(session, element);
    const { nodes } = await accessibilityNodesOf(session, id);
    const node = nodes.find(n => n.backendDOMNodeId === id);
    if (!node) {
        throw new Error(`The element ${element.localName} has no node in the accessibility tree.`);
    }

    const properties: Record<string, unknown> = {};
    const relations: Record<string, number[]> = {};
    for (const { name, value } of node.properties ?? []) {
        if (value.relatedNodes) {
            relations[name] = value.relatedNodes.map(related => related.backendDOMNodeId);
        } else {
            properties[name] = value.value;
        }
    }

    return {
        id,
        ignored: node.ignored,
        role: textOf(node.role),
        name: textOf(node.name),
        properties,
        relations,
    };
}

async function backendNodeIdOf(session: Session, element: Element): Promise<number> {
    const probe = `${++probes}`;
    element.setAttribute(probeAttribute, probe);
    try {
        const { root } = await documentOf(session);
        const node = findProbe(root, probe);
        if (!node) {
            throw new Error(`The element ${element.localName} isn't in the document.`);
        }
        return node.backendNodeId;
    } finally {
        element.removeAttribute(probeAttribute);
    }
}

function findProbe(node: DomNode, probe: string): DomNode | undefined {
    const attributes = node.attributes ?? [];
    for (let i = 0; i < attributes.length; i += 2) {
        if (attributes[i] === probeAttribute && attributes[i + 1] === probe) {
            return node;
        }
    }

    const contentDocument = node.contentDocument ? [node.contentDocument] : [];
    for (const child of [...(node.shadowRoots ?? []), ...(node.children ?? []), ...contentDocument]) {
        const found = findProbe(child, probe);
        if (found) {
            return found;
        }
    }

    return undefined;
}

function textOf(value: AXNode["name"]): string | undefined {
    return value?.value === undefined ? undefined : `${value.value}`;
}
