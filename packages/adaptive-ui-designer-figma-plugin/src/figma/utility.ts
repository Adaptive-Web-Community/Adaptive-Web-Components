import { Rgb } from "culori/fn/index.js";

export const SOLID_BLACK: SolidPaint = {
    type: "SOLID",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    color: {
        r: 0,
        g: 0,
        b: 0,
    },
};

export const SOLID_TRANSPARENT: SolidPaint = {
    type: "SOLID",
    visible: true,
    opacity: 0,
    blendMode: "NORMAL",
    color: {
        r: 1,
        g: 1,
        b: 1,
    },
};

export function isNodeType<T extends BaseNode>(type: NodeType): (node: BaseNode) => node is T {
    return (node: BaseNode): node is T => node.type === type;
}

export const isDocumentNode = isNodeType<DocumentNode>("DOCUMENT");
export const isPageNode = isNodeType<PageNode>("PAGE");
export const isFrameNode = isNodeType<FrameNode>("FRAME");
export const isGroupNode = isNodeType<GroupNode>("GROUP");
export const isComponentNode = isNodeType<ComponentNode>("COMPONENT");
export const isComponentSetNode = isNodeType<ComponentNode>("COMPONENT_SET");
export const isInstanceNode = isNodeType<InstanceNode>("INSTANCE");
export const isBooleanOperationNode = isNodeType<BooleanOperationNode>("BOOLEAN_OPERATION");
export const isVectorNode = isNodeType<VectorNode>("VECTOR");
export const isStarNode = isNodeType<StarNode>("STAR");
export const isLineNode = isNodeType<LineNode>("LINE");
export const isEllipseNode = isNodeType<EllipseNode>("ELLIPSE");
export const isPolygonNode = isNodeType<PolygonNode>("POLYGON");
export const isRectangleNode = isNodeType<RectangleNode>("RECTANGLE");
export const isTextNode = isNodeType<TextNode>("TEXT");

export function isContainerNode(node: BaseNode): node is
    FrameNode |
    ComponentNode |
    InstanceNode {
    return [
        isFrameNode,
        isComponentNode,
        isInstanceNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export function isLayoutNode(node: BaseNode): node is
    FrameNode |
    GroupNode |
    ComponentSetNode |
    ComponentNode |
    InstanceNode |
    RectangleNode |
    EllipseNode |
    PolygonNode |
    StarNode |
    BooleanOperationNode |
    VectorNode |
    LineNode |
    TextNode {
    return [
        isFrameNode,
        isGroupNode,
        isComponentSetNode,
        isComponentNode,
        isInstanceNode,
        isShapeNode,
        isLineNode,
        isTextNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export function isShapeNode(node: BaseNode): node is
    RectangleNode |
    EllipseNode |
    PolygonNode |
    StarNode |
    BooleanOperationNode |
    VectorNode {
    return [
        isRectangleNode,
        isEllipseNode,
        isPolygonNode,
        isStarNode,
        isBooleanOperationNode,
        isVectorNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export function canHaveIndividualStrokes(node: BaseNode): node is
    FrameNode |
    ComponentNode |
    InstanceNode |
    RectangleNode {
    return [
        isContainerNode,
        isRectangleNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

export function canHaveChildren(node: BaseNode): node is
    DocumentNode |
    PageNode |
    FrameNode |
    GroupNode |
    BooleanOperationNode |
    InstanceNode |
    ComponentNode |
    ComponentSetNode {
    return [
        isDocumentNode,
        isPageNode,
        isFrameNode,
        isGroupNode,
        isBooleanOperationNode,
        isInstanceNode,
        isComponentNode,
        isComponentSetNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

/**
 * Gets a string representation of `isTrue` based on the format of `booleanFormat`.
 *
 * @remarks
 * Figma supports component properties like "true", "True", "yes", and "Yes", but doesn't do the work to interpret it.
 *
 * Assumes the value is paired with the same case and set (i.e. "Yes" / "No", "true" / "false", etc.).
 * 
 * @param booleanFormat - String representation of a boolean value like "Yes" or "false"
 * @param isTrue - The actual boolean value to convert to the appropriate string
 */
export const variantBooleanHelper = (booleanFormat: string, isTrue: boolean): string | undefined => {
    const booleanPairs = [
        ["No", "Yes"],
        ["False", "True"],
    ];

    const found = booleanPairs.find(
        (pair) => pair.find(
            (bool) => bool.toLowerCase() === booleanFormat.toLowerCase()
        )
    );

    return found?.map(
        (bool) => (booleanFormat.match(/^[nytf]/) ? bool.toLowerCase() : bool)
    )[
        !isTrue ? 0 : 1
    ];
}

export const colorToRgb = (color: Rgb): RGB => {
    return {
        r: roundToDecimals(color.r, 6),
        g: roundToDecimals(color.g, 6),
        b: roundToDecimals(color.b, 6),
    };
}

export const colorToRgba = (color: Rgb): RGBA => {
    return {
        r: roundToDecimals(color.r, 6),
        g: roundToDecimals(color.g, 6),
        b: roundToDecimals(color.b, 6),
        a: color.alpha !== undefined ? roundToDecimals(color.alpha!, 6) : 1,
    };
}

export const roundToDecimals = (num: number, dec: number): number => {
    return parseFloat(num.toFixed(dec));
}
