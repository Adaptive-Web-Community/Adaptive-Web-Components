import { useEffect } from "react";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { Slider as MuiSlider } from "@mui/material";
import { MuiSliderAuiStyle } from "./MuiSliderAuiStyles.styles.js";

/**
 * Conditions the MuiSliderAuiStyles component supports.
 */
export const MuiSliderAuiStylesConditions = {};

/**
 * Parts of the MuiSliderAuiStyles anatomy.
 */
export const MuiSliderAuiStylesParts = {
    /**
     * The root container
     */
    root: "MuiSlider-root",

    /**
     * The slider thumb
     */
    thumb: "MuiSlider-thumb",

    /**
     * The full-width slider background
     */
    rail: "MuiSlider-rail",

    /**
     * The portion representing the selected value (left)
     */
    track: "MuiSlider-track",

    /**
     * A slider value mark
     */
    mark: "MuiSlider-mark",

    /**
     * A slider value mark label
     */
    markLabel: "MuiSlider-markLabel",

    /**
     * The root, but for the focus state TypeScript limitation
     */
    "MuiSlider-root": "MuiSlider-root",
};

/**
 * The Adaptive UI format for describing the anatomy of the MuiSliderAuiStyles component.
 */
export const MuiSliderAuiStylesAnatomy: ComponentAnatomy<
    typeof MuiSliderAuiStylesConditions,
    typeof MuiSliderAuiStylesParts
> = {
    host: MuiSliderAuiStylesParts.root,
    interactivity: Interactivity.disabledAttribute,
    conditions: MuiSliderAuiStylesConditions,
    parts: MuiSliderAuiStylesParts,
    focus: Focus.partFocused("MuiSlider-root"),
};

/**
 * MuiSliderAuiStyles React component props.
 */
export type MuiSliderAuiStylesProps = {
    ref?: React.RefObject<any>;
    variant: "normal";
};

/**
 * MuiSliderAuiStyles React component styled with Adaptive UI.
 */
export default function MuiSliderAuiStyles(props: MuiSliderAuiStylesProps) {
    useEffect(() => {
        MuiSliderAuiStyle.registerStyles();
    }, []);

    const sliderMarks = [
        {
          value: 0,
          label: '0°C',
        },
        {
          value: 10,
          label: '10°C',
        },
        {
          value: 90,
          label: '90°C',
        },
        {
          value: 100,
          label: '100°C',
        },
    ];

    return (
        <MuiSlider defaultValue={5} min={0} max={100} marks={sliderMarks} />
    );
}

MuiSliderAuiStyles.defaultProps = {
    variant: "normal",
} as MuiSliderAuiStylesProps;
