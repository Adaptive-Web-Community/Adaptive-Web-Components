import { useEffect, useRef } from "react";
import root from "react-shadow";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";

import { Button as MuiButton } from "@mui/material";
import { Button as BaseButton } from "@mui/base/Button";

import { MuiButtonAuiStyle } from "./MuiButtonAuiStyles.styles.js";
import { StyledEngineProvider, createTheme, ThemeProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

/**
 * Conditions the MuiButtonAuiStyles component supports. (Potentially `selected`, `viewType`, etc.)
 */
export const MuiButtonAuiStylesConditions = {};

/**
 * Parts of the MuiButtonAuiStyles anatomy.
 */
export const MuiButtonAuiStylesParts = {
    container: "container",

    "MuiButton-root": "MuiButton-root",
    "MuiButtonBase-root": "MuiButtonBase-root",
    "base-Button-root": "base-Button-root",
};

/**
 * The Adaptive UI format for describing the anatomy of the MuiButtonAuiStyles component.
 */
export const MuiButtonAuiStylesAnatomy: ComponentAnatomy<
    typeof MuiButtonAuiStylesConditions,
    typeof MuiButtonAuiStylesParts
> = {
    interactivity: Interactivity.disabledAttribute, // when not disabled.
    conditions: MuiButtonAuiStylesConditions,
    parts: MuiButtonAuiStylesParts,
    focus: Focus.partFocused("MuiButtonBase-root"),
};

/**
 * MuiButtonAuiStyles React component props.
 */
export type MuiButtonAuiStylesProps = {
    ref?: React.RefObject<any>;
    variant: "normal";
};

/**
 * MuiButtonAuiStyles React component styled with Adaptive UI.
 */
export default function MuiButtonAuiStyles(props: MuiButtonAuiStylesProps) {
    // This should be on the DesignTokenContext but for some reason the ref is not getting set.
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Attach the styles when the component loads
            const styles = MuiButtonAuiStyle.styles;

            styles.addStylesTo(containerRef.current);
        }
    });

    const emotionRoot = document.createElement("style");

    const theme = createTheme({
        components: {
            MuiButtonBase: {
                defaultProps: {
                    disableRipple: true, // disable ripple on the across app
                    disableTouchRipple: true,
                },
            },
        },
    });

    const cache = createCache({
        key: "css",
        prepend: true,
        container: emotionRoot,
    });

    return (
        <root.div ref={containerRef}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CacheProvider value={cache}>
                        <MuiButton disabled>AUI Button</MuiButton>
                    </CacheProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </root.div>
    );
}

MuiButtonAuiStyles.defaultProps = {
    variant: "normal",
} as MuiButtonAuiStylesProps;
