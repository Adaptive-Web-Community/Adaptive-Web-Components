import { ColorRGBA64, parseColor, rgbToRelativeLuminance } from "@microsoft/fast-colors";
import { StyleProperty } from "@adaptive-web/adaptive-ui";
import { AppliedDesignTokens, AppliedStyleModules, DesignTokenValues, PluginNodeData } from "../core/model.js";
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

function isContainerNode(node: BaseNode): node is
    FrameNode |
    ComponentNode |
    InstanceNode {
    return [
        isFrameNode,
        isComponentNode,
        isInstanceNode,
    ].some((test: (node: BaseNode) => boolean) => test(node));
}

function isShapeNode(node: BaseNode): node is
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

const FIGMA_SHARED_DATA_NAMESPACE: string = "adaptive_ui";

export class FigmaPluginNode extends PluginNode {
    public id: string;
    public type: string;
    public name: string;
    private _node: BaseNode;

    private static NodeCache: Map<string, FigmaPluginNode> = new Map();

    private constructor(node: BaseNode) {
        super();

        // Controller.nodeCount++;

        this._node = node;
        this.id = node.id;
        this.type = node.type;
        this.name = node.name;

        // console.log("  new FigmaPluginNode", this.debugInfo, "node", node);

        /*
        This data model and token processing is to handle an unfortunate consequence of the Figma component model.

        An instance component will inherit plugin data from the main component by default. For instance:

        Main component (set plugin data "A=1") --> Instance (get plugin data "A=1")

        This is mostly beneficial as when it comes to applying design tokens, we want to apply whatever was defined on main.

        However, once you override the value at an instance level, you no longer directly get the value from main:

        Instance (set plugin data "A=2") --> Instance (set plugin data "A=2")

        In our normal workflow we're reevaluating the applied tokens, so the instance may have the same overall structure
        but with different values. This would also normally be fine as we're going to evaluate for current values anyway.

        The problem is that once we've updated the values on the instance don't directly get any _changes_ made on the main.

        Main component (set plugin data "A=1, B=2") --> Instance (get plugin data "A=2")

        Notice we don't have the addition of "B=2".

        The solution is to *store* the fully evaluated tokens on the instance node, but to *read* back both the main and instance
        values, and to deduplicate them.

        In the example above, we'd read "A=2" from the instance, "A=1, B=2" from the main, then assemble the full list, keeping
        any overrides from the instance: "A=2, B=2".

        In the case of the "design tokens" the key will be the name of the token, like "corner-radius".
        In the case of the "applied design tokens" the key will be the style target, like "backgroundFill".
        */

        // Find the "main" reference node if this node is part of an instance.
        let mainComponentNode: BaseNode | null = null;
        if (isInstanceNode(this._node)) {
            mainComponentNode = (this._node as InstanceNode).mainComponent;
        } else if (this.id.startsWith("I")) {
            // Child nodes of an instance have an ID like `I##:##;##:##;##:##`
            // where each `##:##` points to the containing instance, and the last always points to the main node.
            const ids = this.id.split(";");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mainComponentNode = figma.getNodeById(ids.pop()!);
        }

        const deserializedDesignTokens = this.deserializeLocalDesignTokens();
        const parsedAppliedStyleModules = this.deserializeAppliedStyleModules();
        let filteredAppliedStyleModules = parsedAppliedStyleModules;
        const deserializedAppliedDesignTokens = this.deserializeAppliedDesignTokens();

        // Reconcile plugin data with the main component.
        if (mainComponentNode) {
            // console.log("    get main");
            const mainFigmaNode = FigmaPluginNode.get(mainComponentNode);
            // console.log("      is instance node", this.debugInfo, mainFigmaNode);

            this._componentDesignTokens = mainFigmaNode.localDesignTokens;
            this._componentAppliedStyleModules = mainFigmaNode.appliedStyleModules;
            this._componentAppliedDesignTokens = mainFigmaNode.appliedDesignTokens;

            mainFigmaNode.localDesignTokens.forEach((value, tokenId) => {
                // If the token values are the same between the nodes, remove it from the local.
                if (deserializedDesignTokens.get(tokenId)?.value === value.value) {
                    // console.log("    removing design token", this.debugInfo, tokenId);
                    deserializedDesignTokens.delete(tokenId);
                }
            });

            filteredAppliedStyleModules = parsedAppliedStyleModules
                .filter((parsedName) => mainFigmaNode.appliedStyleModules.indexOf(parsedName) === -1) as AppliedStyleModules;

            mainFigmaNode.appliedDesignTokens.forEach((applied, target) => {
                // If the target and token are the same between the nodes, remove it from the local.
                if (deserializedAppliedDesignTokens.get(target)?.tokenID === applied.tokenID) {
                    // console.log("    removing applied design token", this.debugInfo, target, applied.tokenID);
                    deserializedAppliedDesignTokens.delete(target);
                }
            });

            if (deserializedDesignTokens.size) {
                // console.log("    reconciled design tokens", this.debugInfo, deserializedDesignTokens.serialize());
            }

            if (deserializedAppliedDesignTokens.size) {
                // console.log("    reconciled applied design tokens", this.debugInfo, deserializedAppliedDesignTokens.serialize());
            }
        }

        this._localDesignTokens = deserializedDesignTokens;
        this._appliedStyleModules = filteredAppliedStyleModules;
        this._appliedDesignTokens = deserializedAppliedDesignTokens;

        // Check for and/or remove legacy FAST plugin data.
        // const fastKeys = this._node.getSharedPluginDataKeys("fast");
        // if (fastKeys.length > 0) {
        //     console.log("Found FAST keys", this.type, this._node.name, fastKeys);
        //     fastKeys.forEach((fastKey) => {
        //         // this._node.setSharedPluginData("fast", fastKey, "");
        //         console.log("  deleting data", fastKey);
        //         // console.log("  ", fastKey, this._node.getSharedPluginData("fast", fastKey));
        //     });
        // }

        // if (this._appliedDesignTokens.size) {
        //     console.log("    final applied design tokens", this._appliedDesignTokens.serialize());
        // }

        // TODO This isn't working and is causing a lot of token evaluation issues. It would be nice if _some_ layers
        // in the design tool could have a fixed color and provide that to the tokens, but the logic for _which_
        // layers turns out to be pretty complicated.
        // For now the requirement is basing the adaptive design with a "layer" recipe.
        // this.setupFillColor();
    }

    public static get(node: BaseNode): FigmaPluginNode {
        if (FigmaPluginNode.NodeCache.has(node.id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return FigmaPluginNode.NodeCache.get(node.id)!;
        } else {
            const pluginNode = new FigmaPluginNode(node);
            FigmaPluginNode.NodeCache.set(node.id, pluginNode);
            return pluginNode;
        }
    }

    public static clearCache(): void {
        FigmaPluginNode.NodeCache.clear();
    }

    private deserializeLocalDesignTokens(): DesignTokenValues {
        const json = this.getPluginData("designTokens");
        const value = new DesignTokenValues();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeLocalDesignTokens", this.debugInfo, value);
        }
        return value;
    }

    private deserializeAppliedStyleModules(): AppliedStyleModules {
        const json = this.getPluginData("appliedStyleModules");
        const value = new AppliedStyleModules();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeAppliedStyleModules", this.debugInfo, value);
        }
        return value;
    }

    private deserializeAppliedDesignTokens(): AppliedDesignTokens {
        const json = this.getPluginData("appliedDesignTokens");
        const value = new AppliedDesignTokens();
        if (json) {
            value.deserialize(json);
            // console.log("    deserializeAppliedDesignTokens", this.debugInfo, value);
        }
        return value;
    }

    public get canHaveChildren(): boolean {
        return canHaveChildren(this._node);
    }

    public get children(): PluginNode[] {
        if (canHaveChildren(this._node)) {
            const children: FigmaPluginNode[] = [];

            // console.log("    get children");
            for (const child of this._node.children) {
                children.push(FigmaPluginNode.get(child));
            }

            return children;
        } else {
            return [];
        }
    }

    public get supports(): Array<StyleProperty> {
        return Object.keys(StyleProperty).filter((key: string) => {
            switch (key) {
                case StyleProperty.backgroundFill:
                    return [
                        isPageNode,
                        isContainerNode,
                        isShapeNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.borderFillTop:
                case StyleProperty.borderFillRight:
                case StyleProperty.borderFillBottom:
                case StyleProperty.borderFillLeft:
                case StyleProperty.borderStyleTop:
                case StyleProperty.borderStyleRight:
                case StyleProperty.borderStyleBottom:
                case StyleProperty.borderStyleLeft:
                case StyleProperty.borderThicknessTop:
                case StyleProperty.borderThicknessRight:
                case StyleProperty.borderThicknessBottom:
                case StyleProperty.borderThicknessLeft:
                    return [
                        isContainerNode,
                        isShapeNode,
                        isLineNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.paddingTop:
                case StyleProperty.paddingRight:
                case StyleProperty.paddingBottom:
                case StyleProperty.paddingLeft:
                case StyleProperty.gap:
                    return [
                        isContainerNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));        
                case StyleProperty.cornerRadiusTopLeft:
                case StyleProperty.cornerRadiusTopRight:
                case StyleProperty.cornerRadiusBottomRight:
                case StyleProperty.cornerRadiusBottomLeft:
                    return [
                        isContainerNode,
                        isShapeNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.foregroundFill:
                    return [
                        isContainerNode, // Applies to children (for style module support)
                        isShapeNode,
                        isLineNode,
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                case StyleProperty.fontFamily:
                case StyleProperty.fontSize:
                case StyleProperty.fontStyle:
                case StyleProperty.fontWeight:
                case StyleProperty.lineHeight:
                    return [
                        isContainerNode, // Applies to children (for style module support)
                        isTextNode,
                    ].some((test: (node: BaseNode) => boolean) => test(this._node));
                default:
                    return false;
            }
        }) as Array<StyleProperty>;
    }

    public paint(target: StyleProperty, value: string): void {
        if (isContainerNode(this._node) && (
            target === StyleProperty.foregroundFill ||
            target === StyleProperty.fontFamily ||
            target === StyleProperty.fontSize ||
            target === StyleProperty.fontStyle ||
            target === StyleProperty.fontWeight ||
            target === StyleProperty.lineHeight))
        {
            this.children.forEach((child) => {
                child.paint(target, value);
            });
        } else {
            switch (target) {
                case StyleProperty.borderFillTop:
                case StyleProperty.borderFillRight:
                case StyleProperty.borderFillBottom:
                case StyleProperty.borderFillLeft:
                case StyleProperty.backgroundFill:
                case StyleProperty.foregroundFill:
                    this.paintColor(target, value);
                    break;
                case StyleProperty.borderStyleTop:
                case StyleProperty.borderStyleRight:
                case StyleProperty.borderStyleBottom:
                case StyleProperty.borderStyleLeft:
                    // Ignore for now, "solid" only
                    break;
                case StyleProperty.borderThicknessTop:
                case StyleProperty.borderThicknessRight:
                case StyleProperty.borderThicknessBottom:
                case StyleProperty.borderThicknessLeft:
                    this.setBoxSizing();
                    this.paintStrokeWidth(value);
                    break;
                case StyleProperty.cornerRadiusTopLeft:
                case StyleProperty.cornerRadiusTopRight:
                case StyleProperty.cornerRadiusBottomRight:
                case StyleProperty.cornerRadiusBottomLeft:
                    this.paintCornerRadius(target, value);
                    break;
                case StyleProperty.fontFamily:
                    // TODO Handle font list better and font weight
                    if (isTextNode(this._node)) {
                        const families = value.split(",");
                        const fontName = { family: families[0], style: "Regular" };
                        figma.loadFontAsync(fontName).then(x => {
                            (this._node as TextNode).fontName = fontName;
                        });
                    }
                    break;
                case StyleProperty.fontSize:
                    if (isTextNode(this._node)) {
                        const textNode = this._node as TextNode;
                        figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                            textNode.fontSize = Number.parseFloat(value);
                        });
                    }
                    break;
                case StyleProperty.fontStyle:
                    // Ignore, but don't throw an error.
                    break;
                case StyleProperty.fontWeight:
                    // Ignore, but don't throw an error.
                    break;
                case StyleProperty.fontVariationSettings:
                    // Ignore, but don't throw an error.
                    break;
                case StyleProperty.lineHeight:
                    if (isTextNode(this._node)) {
                        const textNode = this._node as TextNode;
                        figma.loadFontAsync(textNode.fontName as FontName).then(x => {
                            textNode.lineHeight = {
                                value: Number.parseFloat(value),
                                unit: "PIXELS",
                            };
                        });
                    }
                    break;
                case StyleProperty.paddingTop:
                    this.setBoxSizing();
                    (this._node as BaseFrameMixin).paddingTop = Number.parseFloat(value); // Removes unit, so assumes px
                    break;
                case StyleProperty.paddingRight:
                    this.setBoxSizing();
                    (this._node as BaseFrameMixin).paddingRight = Number.parseFloat(value); // Removes unit, so assumes px
                    break;
                case StyleProperty.paddingBottom:
                    this.setBoxSizing();
                    (this._node as BaseFrameMixin).paddingBottom = Number.parseFloat(value); // Removes unit, so assumes px
                    break;
                case StyleProperty.paddingLeft:
                    this.setBoxSizing();
                    (this._node as BaseFrameMixin).paddingLeft = Number.parseFloat(value); // Removes unit, so assumes px
                    break;
                case StyleProperty.gap:
                    (this._node as BaseFrameMixin).itemSpacing = Number.parseFloat(value); // Removes unit, so assumes px
                    break;
                default:
                    throw new Error(`Applied design token could not be painted for ${target}: ${JSON.stringify(value)}`);
            }
        }
    }

    public get parent(): FigmaPluginNode | null {
        const parent = this._node.parent;

        if (parent === null) {
            return null;
        }

        // console.log("    get parent");
        return FigmaPluginNode.get(parent);
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
                        // console.log("handleManualDarkMode", this._node.variantProperties['Dark mode'], "color", color.toStringHexRGB(), "dark", containerIsDark);
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
        // console.log("    getPluginData", this.debugInfo, key, value);
        return value;
    }

    protected setPluginData<K extends keyof PluginNodeData>(key: K, value: string): void {
        // console.log("    setPluginData", this.debugInfo, key, value);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, value);
    }

    protected deletePluginData<K extends keyof PluginNodeData>(key: K): void {
        // console.log("    deletePluginData", this.debugInfo, key);
        this._node.setSharedPluginData(FIGMA_SHARED_DATA_NAMESPACE, key, "");
    }

    private setBoxSizing() {
        (this._node as BaseFrameMixin).strokesIncludedInLayout = true;
    }

    private paintColor(target: StyleProperty, value: string): void {
        let paint: Paint | null = null;

        if (value.startsWith("linear-gradient")) {
            const linearMatch = /linear-gradient\((?<params>.+)\)/;
            const matches = value.match(linearMatch);
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
            const color = parseColor(value);

            if (color === null) {
                throw new Error(
                    `The value "${value}" could not be converted to a ColorRGBA64`
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
                case StyleProperty.borderFillTop:
                    // TODO: Figma only supports on border color, though it can be hacked using inner shadow.
                    (this._node as MinimalStrokesMixin).strokes = [paint];
                    break;
            }
        }
    }

    private paintStrokeWidth(value: string): void {
        (this._node as MinimalStrokesMixin).strokeWeight = Number.parseFloat(value);
    }

    private paintCornerRadius(target: StyleProperty, value: string): void {
        const numValue = Number.parseFloat(value);
        if (isContainerNode(this._node) || isRectangleNode(this._node)) {
            switch (target) {
                case StyleProperty.cornerRadiusTopLeft:
                    (this._node as RectangleCornerMixin).topLeftRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusTopRight:
                    (this._node as RectangleCornerMixin).topRightRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusBottomRight:
                    (this._node as RectangleCornerMixin).bottomRightRadius = numValue;
                    break;
                case StyleProperty.cornerRadiusBottomLeft:
                    (this._node as RectangleCornerMixin).bottomLeftRadius = numValue;
                    break;
            }
        } else {
            (this._node as CornerMixin).cornerRadius = numValue;
        }
    }
}
