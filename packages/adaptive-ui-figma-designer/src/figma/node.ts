import { ColorRGBA64, parseColor, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { AppliedDesignToken, AppliedDesignTokens, DesignTokenValues, PluginNodeData } from "../core/model.js";
import { PluginNode } from "../core/node.js";
import { variantBooleanHelper } from "./utility.js";

function isNodeType<T extends BaseNode>(type: NodeType): (node: BaseNode) => node is T {
    return (node: BaseNode): node is T => node.type === type;
}

const isDocumentNode = isNodeType<DocumentNode>("DOCUMENT");
const isPageNode = isNodeType<PageNode>("PAGE");
const isFrameNode = isNodeType<FrameNode>("FRAME");
const isGroupNode = isNodeType<GroupNode>("GROUP");
const isComponentNode = isNodeType<ComponentNode>("COMPONENT");
const isComponentSetNode = isNodeType<ComponentNode>("COMPONENT_SET");
const isInstanceNode = isNodeType<InstanceNode>("INSTANCE");
const isBooleanOperationNode = isNodeType<BooleanOperationNode>("BOOLEAN_OPERATION");
const isVectorNode = isNodeType<VectorNode>("VECTOR");
const isStarNode = isNodeType<StarNode>("STAR");
const isLineNode = isNodeType<LineNode>("LINE");
const isEllipseNode = isNodeType<EllipseNode>("ELLIPSE");
const isPolygonNode = isNodeType<PolygonNode>("POLYGON");
const isRectangleNode = isNodeType<RectangleNode>("RECTANGLE");
const isTextNode = isNodeType<TextNode>("TEXT");

function canHaveChildren(node: BaseNode): node is
    | DocumentNode
    | PageNode
    | FrameNode
    | GroupNode
    | BooleanOperationNode
    | InstanceNode
    | ComponentNode
    | ComponentSetNode {
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

export const FIGMA_SHARED_DATA_NAMESPACE: string = "adaptive_ui";

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    private _node: BaseNode;

    constructor(node: BaseNode) {
        super();

        // Controller.nodeCount++;

        // console.log("  new FigmaPluginNode", node.id, node.name, node);

        this._node = node;
        this.id = node.id;
        this.type = node.type;

        this.loadLocalDesignTokens();
        this.loadAppliedDesignTokens();

        // If it's an instance node, the plugin data may also include main component settings. Deduplicate them.
        if (isInstanceNode(this._node)) {
            const mainComponentNode = (this._node as InstanceNode).mainComponent;
            if (mainComponentNode) {
                this.deduplicateComponentDesignTokens(mainComponentNode);
                this.deduplicateComponentAppliedDesignTokens(mainComponentNode);
            }
        }

        // if (this._appliedDesignTokens.size) {
        //     console.log("    final applied design tokens", this._appliedDesignTokens.serialize());
        // }

        // TODO This isn't working and is causing a lot of token evaluation issues. It would be nice if _some_ layers
        // in the design tool could have a fixed color and provide that to the tokens, but the logic for _which_
        // layers turns out to be pretty complicated.
        // For now the requirement is basing the adaptive design with a "layer" recipe.
        // this.setupFillColor();
    }

    private deduplicateComponentDesignTokens(node: BaseNode) {
        this._componentDesignTokens = new DesignTokenValues();
        const componentDesignTokensJson = this.getPluginData("designTokens");
        this._componentDesignTokens.deserialize(componentDesignTokensJson);

        this._componentDesignTokens.forEach((token, tokenId) => {
            this._localDesignTokens.delete(tokenId);
        });
    }

    private deduplicateComponentAppliedDesignTokens(node: BaseNode) {
        this._componentAppliedDesignTokens = new AppliedDesignTokens();
        const componentAppliedDesignTokensJson = this.getPluginData("appliedDesignTokens");
        this._componentAppliedDesignTokens.deserialize(componentAppliedDesignTokensJson);

        this._componentAppliedDesignTokens.forEach((applied, target) => {
            this._appliedDesignTokens.delete(target);
        });
    }

    public canHaveChildren(): boolean {
        return canHaveChildren(this._node);
    }

    public children(): FigmaPluginNode[] {
        if (canHaveChildren(this._node)) {
            const children: FigmaPluginNode[] = [];

            // console.log("  get children");
            for (const child of this._node.children) {
                children.push(new FigmaPluginNode(child));
            }

            return children;
        } else {
            return [];
        }
    }

    public supports(): Array<StyleProperty> {
        return Object.keys(StyleProperty).filter((key: string) => {
            switch (key) {
                case StyleProperty.backgroundFill:
                    return [
                        isDocumentNode,
                        isPageNode,
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isBooleanOperationNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.borderFill:
                case StyleProperty.borderThickness:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isLineNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.cornerRadius:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isStarNode,
                        isComponentNode,
                        isInstanceNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.foregroundFill:
                    return [
                        isFrameNode,
                        isRectangleNode,
                        isEllipseNode,
                        isPolygonNode,
                        isLineNode,
                        isStarNode,
                        isBooleanOperationNode,
                        isVectorNode,
                        isComponentNode,
                        isInstanceNode,
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.fontFamily:
                case StyleProperty.fontSize:
                case StyleProperty.lineHeight:
                    return isTextNode(this._node);
                default:
                    return false;
            }
        }) as Array<StyleProperty>;
    }

    public paint(target: StyleProperty, data: AppliedDesignToken): void {
        switch (target) {
            case StyleProperty.borderFill:
            case StyleProperty.backgroundFill:
            case StyleProperty.foregroundFill:
                this.paintColor(target, data);
                break;
            case StyleProperty.borderThickness:
                this.paintStrokeWidth(data);
                break;
            case StyleProperty.cornerRadius:
                this.paintCornerRadius(data);
                break;
            case StyleProperty.fontFamily:
                {
                    // TODO Handle font list better and font weight
                    const families = data.value.split(",");
                    const fontName = { family: families[0], style: "Regular" };
                    figma.loadFontAsync(fontName).then(x => {
                        (this._node as TextNode).fontName = fontName;
                    });
                }
                break;
            case StyleProperty.fontSize:
                {
                    const textNode = this._node as TextNode;
                    figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                        textNode.fontSize = Number.parseFloat(data.value);
                    });
                }
                break;
            case StyleProperty.lineHeight:
                {
                    const textNode = this._node as TextNode;
                    figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                        textNode.lineHeight = {
                            value: Number.parseFloat(data.value),
                            unit: "PIXELS",
                        };
                    });
                }
                break;
            default:
                throw new Error(`Applied design token could not be painted ${JSON.stringify(data)}`);
        }
    }

    public parent(): FigmaPluginNode | null {
        const parent = this._node.parent;

        if (parent === null) {
            return null;
        }

        // console.log("  get parent");
        return new FigmaPluginNode(parent);
    }

    public getEffectiveFillColor(): ColorRGBA64 | null {
        let node: BaseNode | null = this._node;

        while (node !== null) {
            if ((node as GeometryMixin).fills) {
                const fills = (node as GeometryMixin).fills;

                if (Array.isArray(fills)) {
                    const paints: SolidPaint[] = fills.filter(
                        (fill: Paint) => fill.type === "SOLID" && fill.visible
                    );

                    // TODO: how do we process multiple paints?
                    if (paints.length === 1) {
                        const parsed = ColorRGBA64.fromObject(paints[0].color);
                        if (parsed instanceof ColorRGBA64) {
                            return parsed;
                        }
                    }
                }
            }

            node = node.parent;
        }

        return null;
    }

    private darkTarget: number = (-0.1 + Math.sqrt(0.21)) / 2;

    public handleManualDarkMode(): boolean {
        if (isInstanceNode(this._node)) {
            if (this._node.variantProperties) {
                const currentDarkMode = this._node.variantProperties["Dark mode"];
                if (currentDarkMode) {
                    const color = this.getEffectiveFillColor();
                    if (color) {
                        const containerIsDark = rgbToRelativeLuminance(color) <= this.darkTarget;
                        // eslint-disable-next-line max-len
                        // console.log("handleManualDarkMode", this.node.variantProperties['Dark mode'], "color", color.toStringHexRGB(), "dark", containerIsDark);
                        const value = variantBooleanHelper(currentDarkMode, containerIsDark);
                        if (value) {
                            this._node.setProperties({
                                "Dark mode": value,
                            });
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    protected getPluginData<K extends keyof PluginNodeData>(key: K): string | undefined {
        let value: string | undefined = this._node.getSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key as string);
        if (value === "") {
            value = undefined;
        }
        // console.log("    getPluginData", this.node.id, this.node.type, key, value);
        return value;
    }

    protected setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void {
        // console.log("    setPluginData", this.node.id, this.node.type, key, value);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, value);
    }

    protected deletePluginData<K extends keyof PluginNodeData>(key: K): void {
        // console.log("    deletePluginData", this.node.id, this.node.type, key);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, "");
    }

    private paintColor(target: StyleProperty, data: AppliedDesignToken): void {
        let paint: Paint | null = null;

        if (data.value.startsWith("linear-gradient")) {
            const linearMatch = /linear-gradient\((?<params>.+)\)/;
            const matches = data.value.match(linearMatch);
            if (matches && matches.groups) {
                const array = matches.groups.params.split(",").map(p => p.trim());

                let degrees: number = 90;
                if (array[0].endsWith("deg")) {
                    const angle = array.shift()?.replace("deg", "") || "90";
                    degrees = Number.parseFloat(angle);
                }
                const radians: number = degrees * (Math.PI / 180);

                const paramMatch = /(?<color>#[\w\d]+)( (?<pos>.+))?/;
                const stops = array.map((p, index, array) => {
                    const paramMatches = p.match(paramMatch);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const color = parseColor(paramMatches?.groups?.color || "FF00FF")!;
                    let position: number = 0;
                    if (paramMatches?.groups && paramMatches?.groups?.pos) {
                        if (paramMatches.groups.pos.endsWith("%")) {
                            position = Number.parseFloat(paramMatches.groups.pos) / 100;
                        } else if (paramMatches.groups.pos.startsWith("calc(100% - ")) {
                            const px = Number.parseFloat(
                                paramMatches.groups.pos
                                    .replace("calc(100% - ", "")
                                    .replace("px)", "")
                            );
                            const size = degrees === 90 || degrees === 270
                                ? (this._node as LayoutMixin).height
                                : (this._node as LayoutMixin).width;
                            position = (size - px) / size;
                        }
                    } else if (index === array.length - 1) {
                        position = 1;
                    }
                    const stop: ColorStop = {
                        position,
                        color: {
                            r: color.r,
                            g: color.g,
                            b: color.b,
                            a: color.a,
                        },
                    };
                    return stop;
                });

                const gradientPaint: GradientPaint = {
                    type: "GRADIENT_LINEAR",
                    gradientStops: stops,
                    gradientTransform: [
                        [Math.cos(radians), Math.sin(radians), 0],
                        [Math.sin(radians) * -1, Math.cos(radians), 1],
                    ],
                };
                paint = gradientPaint;
            }
        } else {
            // Assume it's solid
            const color = parseColor(data.value);

            if (color === null) {
                throw new Error(
                    `The value "${data.value}" could not be converted to a ColorRGBA64`
                );
            }

            const colorObject = color.toObject();
            const solidPaint: SolidPaint = {
                type: "SOLID",
                visible: true,
                opacity: colorObject.a,
                blendMode: "NORMAL",
                color: {
                    r: colorObject.r,
                    g: colorObject.g,
                    b: colorObject.b,
                },
            };
            paint = solidPaint;
        }

        if (paint) {
            switch (target) {
                case StyleProperty.backgroundFill:
                case StyleProperty.foregroundFill:
                    (this._node as MinimalFillsMixin).fills = [paint];
                    break;
                case StyleProperty.borderFill:
                    (this._node as MinimalStrokesMixin).strokes = [paint];
                    break;
            }
        }
    }

    private paintStrokeWidth(data: AppliedDesignToken): void {
        (this._node as MinimalStrokesMixin).strokeWeight = Number.parseFloat(data.value);
    }

    private paintCornerRadius(data: AppliedDesignToken): void {
        (this._node as CornerMixin).cornerRadius = Number.parseFloat(data.value);
    }
}
