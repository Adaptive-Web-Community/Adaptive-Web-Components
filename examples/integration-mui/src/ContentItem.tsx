import { useEffect, useRef } from "react";
import root from "react-shadow";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { layerFillInteractiveRest } from "@adaptive-web/adaptive-ui/reference";
import { Badge } from "../react/Badge.js";
import { Button } from "../react/Button.js";
import { DesignTokenContext, DesignTokenContextElement } from "../react/DesignTokenContext.js";
import ActionsIcon from "./assets/ActionsIcon.js";
import BlobIcon from "./assets/BlobIcon.js";
import BookmarkIcon from "./assets/BookmarkIcon.js";
import background from "./assets/card-background.jpg";
import { ContentItemStyles } from "./ContentItem.styles.js";

/**
 * Conditions the ContentItem component supports. (Potentially `selected`, `viewType`, etc.)
 */
export const ContentItemConditions = {};

/**
 * Parts of the ContentItem anatomy.
 */
export const ContentItemParts = {
    container: "container",
    thumbnail: "thumbnail",
    details: "details",
    title: "title",
    description: "description",
    properties: "properties",
    badge: "badge",
    metadata: "metadata",
    actions: "actions",
    root: "MuiButton-root",
};

/**
 * The Adaptive UI format for describing the anatomy of the ContentItem component.
 */
export const ContentItemAnatomy: ComponentAnatomy<typeof ContentItemConditions, typeof ContentItemParts> = {
    interactivity: Interactivity.always,
    conditions: ContentItemConditions,
    parts: ContentItemParts,
    focus: Focus.partFocused("container"),
};

/**
 * ContentItem React component props.
 */
export type ContentItemProps = {
    ref?: React.RefObject<any>;
    title?: string;
    description?: string;
    badge?: string;
};

/**
 * ContentItem React component styled with Adaptive UI.
 */
export default function ContentItem(props: ContentItemProps) {
    // This should be on the DesignTokenContext but for some reason the ref is not getting set.
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Attach the styles when the component loads
            const styles = ContentItemStyles.styles;
            // debugger;
            styles.addStylesTo(containerRef.current);
        }
    });

    // The root div is here to provide a shadow dom. Once I figure out why the ref isn't working on the
    // DesignTokenContext this can move to there.
    // To map Adaptive UI to another component without more modification we need the shadow dom so
    // class names aren't ambiguous or overlapping.

    // The key is this is all plain semantic html without styling. Easy to generate this from (well-crafted) Figma designs.

    // DesignTokenContext I needed as an anchor to adjust the fill-color token which most color values depend on.
    // I have an idea to make this better but it requires an update in fast-foundation (in process).
    return (
        <root.div ref={containerRef}>
            <DesignTokenContext
                className={ContentItemParts.container}
                fillColor={layerFillInteractiveRest}
                tabIndex="0"
            >
                <img className={ContentItemParts.thumbnail} src={background} />
                <div className={ContentItemParts.details}>
                    <div className={ContentItemParts.title}>{props.title}</div>
                    <div className={ContentItemParts.description}>{props.description}</div>
                    <div className={ContentItemParts.properties}>
                        <Badge className={ContentItemParts.badge}>{props.badge}</Badge>
                        <div className={ContentItemParts.metadata}>
                            <BlobIcon />
                            <span>Feb 8, 2024</span>
                        </div>
                        <div className={ContentItemParts.actions}>
                            <Button>
                                <BookmarkIcon />
                            </Button>
                            <Button>
                                <ActionsIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </DesignTokenContext>
        </root.div>
    );
}

ContentItem.defaultProps = {
    title: "Content item title",
    description: "Content item description",
    badge: "Internal",
} as ContentItemProps;
