
// packages/adaptive-ui/src/design-tokens/modules.ts
// packages/adaptive-ui/src/design-tokens/README.md

export const typeRampBaseStyles = {
    fontFamily: "var(--font-family)",
    fontSize: "var(--type-ramp-base-font-size)",
    lineHeight: "var(--type-ramp-base-line-height)",
    fontWeight: "var(--font-weight)",
    fontVariationSettings: "var(--type-ramp-base-font-variations)",
}
export const typeRampMinus1Styles = {
    fontFamily: "var(--font-family)",
    fontSize: "var(--type-ramp-minus-1-font-size)",
    lineHeight: "var(--type-ramp-minus-1-line-height)",
    fontWeight: "var(--font-weight)",
    fontVariationSettings: "var(--type-ramp-minus-1-font-variations)",
}


export const controlShapeStyles = {
    borderTopLeftRadius: "var(--corner-radius-control)",
    borderTopRightRadius: "var(--corner-radius-control)",
    borderBottomRightRadius: "var(--corner-radius-control)",
    borderBottomLeftRadius: "var(--corner-radius-control)",

};

export const controlDensityStyles = {
    paddingTop: "var(--density_control-vertical-padding)",
    paddingRight: "var(--density_control-horizontal-padding)",
    paddingBottom: "var(--density_control-vertical-padding)",
    paddingLeft: "var(--density_control-horizontal-padding)",
    gap: "var(--density_control-horizontal-gap)",
};


export const structureStyles = {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    flexgrow: "1",
    justifyContent: "center",
    border: "none",
    margin: "0",
    padding: "0",
};

export const densityBorderStyles = {
    borderTopWidth: "var(--stroke-thickness)",
    borderRightWidth: "var(--stroke-thickness)",
    borderBottomWidth: "var(--stroke-thickness)",
    borderLeftWidth: "var(--stroke-thickness)",
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",

    // Border fill color changes. 
}

export const actionStyles = {
    ...controlShapeStyles,
    ...controlDensityStyles,
    ...densityBorderStyles,
};



// MENU Styles

export const layerShapeStyles = {
    borderTopLeftRadius: 'var(--corner-radius-layer)',
    borderTopRightRadius: 'var(--corner-radius-layer)',
    borderBottomRightRadius: 'var(--corner-radius-layer)',
    borderBottomLeftRadius: 'var(--corner-radius-layer)',
};


export const flyoutStyles = {
    ...layerShapeStyles,
    boxShadow: 'var(--elevation-flyout)',

    backgroundColor: 'var(--layer-fill-fixed-plus-1)',

};

export const itemContainerDensityStyles = {
    paddingTop: 'var(--density_item-container-vertical-padding)',
    paddingRight: 'var(--density_item-container-horizontal-padding)',
    paddingBottom: 'var(--density_item-container-vertical-padding)',
    paddingLeft: 'var(--density_item-container-horizontal-padding)',
    gap: 'var(--density_item-container-horizontal-gap)',
};

// Menu Item Styles

export const menuItemStyles = {
    ...controlShapeStyles,
    ...controlDensityStyles,
    ...typeRampBaseStyles,
};


// Input Styles

export const inputStyles = {
    ...controlShapeStyles,
    ...densityBorderStyles,
};




export const muiCSSTheme = {

    cssVarPrefix: "hs",
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true, // disable ripple on the across app
                disableTouchRipple: true,
            },
            styleOverrides: {
                root: {
                    ...typeRampBaseStyles,

                    '&:focus-visible': {
                        backgroundColor: 'var(--neutral-fill-subtle-focus)',
                        color: 'var(--neutral-stroke-strong-on-neutral-fill-subtle-focus)',
                        borderTopColor: 'var(--neutral-stroke-subtle-focus)',
                        borderRightColor: 'var(--neutral-stroke-subtle-focus)',
                        borderBottomColor: 'var(--neutral-stroke-subtle-focus)',
                        borderLeftColor: 'var(--neutral-stroke-subtle-focus)',
                    },

                }
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: ({ ownerState }) => ({

                    // MUI overrides
                    // buttons have text-transform: uppercase by default
                    textTransform: 'none ',

                    // // button structure styles:
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    flexgrow: "1",
                    justifyContent: "center",
                    border: "none",
                    margin: "0",
                    padding: "0",

                    // Action control overrides
                    ...actionStyles,



                    // Variants
                    ...(ownerState.variant === "critical" && {
                        color: 'var(--black-or-white-readable-on-critical-fill-readable-rest)',
                        backgroundColor: 'var(--critical-fill-readable-rest)',
                        borderTopColor: "var(--critical-stroke-subtle-rest)",
                        borderRightColor: "var(--critical-stroke-subtle-rest)",
                        borderBottomColor: "var(--critical-stroke-subtle-rest)",
                        borderLeftColor: "var(--critical-stroke-subtle-rest)",

                        "&:hover": {
                            backgroundColor: "var(--critical-fill-subtle-hover)",
                            color: "var(--critical-stroke-strong-on-critical-fill-subtle-hover)",
                            borderTopColor: "var(--critical-stroke-subtle-hover)",
                            borderRightColor: "var(--critical-stroke-subtle-hover)",
                            borderBottomColor: "var(--critical-stroke-subtle-hover)",
                            borderLeftColor: "var(--critical-stroke-subtle-hover)",
                        },
                        "&:active": {
                            backgroundColor: "var(--critical-fill-subtle-active)",
                            color: "var(--critical-stroke-strong-on-critical-fill-subtle-active)",
                            borderTopColor: "var(--critical-stroke-subtle-active)",
                            borderRightColor: "var(--critical-stroke-subtle-active)",
                            borderBottomColor: "var(--critical-stroke-subtle-active)",
                            borderLeftColor: "var(--critical-stroke-subtle-active)",
                        },
                    }),
                    ...(ownerState.variant === "normal" && {

                        backgroundColor: "var(--neutral-fill-subtle-rest)",
                        color: "var(--neutral-stroke-strong-on-neutral-fill-subtle-rest)",
                        fill: "currentcolor",

                        borderTopColor: `var(--neutral-stroke-subtle-rest)`,
                        borderRightColor: "var(--neutral-stroke-subtle-rest)",
                        borderBottomColor: "var(--neutral-stroke-subtle-rest)",
                        borderLeftColor: "var(--neutral-stroke-subtle-rest)",
                        "&:hover": {
                            backgroundColor: "var(--neutral-fill-subtle-hover)",
                            color: "var(--neutral-stroke-strong-on-neutral-fill-subtle-hover)",
                            borderTopColor: "var(--neutral-stroke-subtle-hover)",
                            borderRightColor: "var(--neutral-stroke-subtle-hover)",
                            borderBottomColor: "var(--neutral-stroke-subtle-hover)",
                            borderLeftColor: "var(--neutral-stroke-subtle-hover)",
                        },

                        "&:active": {
                            backgroundColor: "var(--neutral-fill-subtle-active)",
                            color: "var(--neutral-stroke-strong-on-neutral-fill-subtle-active)",
                            borderTopColor: "var(--neutral-stroke-subtle-active)",
                            borderRightColor: "var(--neutral-stroke-subtle-active)",
                            borderBottomColor: "var(--neutral-stroke-subtle-active)",
                            borderLeftColor: "var(--neutral-stroke-subtle-active)",
                        },
                    }),

                }),
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    // these are hard coded in awc
                    maxWidth: "368px",
                    minWidth: "64px",

                    ...flyoutStyles,
                    ...itemContainerDensityStyles,
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    ...menuItemStyles,


                    backgroundColor: 'var(--neutral-fill-stealth-rest)',
                    color: 'var(--neutral-stroke-strong-on-neutral-fill-stealth-rest)',
                    fill: 'currentcolor',

                    borderTopColor: 'var(--neutral-stroke-safety-rest)',
                    borderRightColor: 'var(--neutral-stroke-safety-rest)',
                    borderBottomColor: 'var(--neutral-stroke-safety-rest)',
                    borderLeftColor: 'var(--neutral-stroke-safety-rest)',
                    "&:hover": {
                        backgroundColor: 'var(--neutral-fill-stealth-hover)',
                        color: 'var(--neutral-stroke-strong-on-neutral-fill-stealth-hover)',
                        borderTopColor: 'var(--neutral-stroke-safety-hover)',
                        borderRightColor: 'var(--neutral-stroke-safety-hover)',
                        borderBottomColor: 'var(--neutral-stroke-safety-hover)',
                        borderLeftColor: 'var(--neutral-stroke-safety-hover)',
                    },
                    "&:active": {
                        backgroundColor: 'var(--neutral-fill-stealth-active)',
                        color: 'var(--neutral-stroke-strong-on-neutral-fill-stealth-active)',
                        borderTopColor: 'var(--neutral-stroke-safety-active)',
                        borderRightColor: 'var(--neutral-stroke-safety-active)',
                        borderBottomColor: 'var(--neutral-stroke-safety-active)',
                        borderLeftColor: 'var(--neutral-stroke-safety-active)',
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: 'var(--label-font-family)',
                    fontSize: 'var(--type-ramp-base-font-size)',
                    lineHeight: 'var(--type-ramp-base-line-height)',
                    fontWeight: 'var(--label-font-weight)',
                    color: 'var(--neutral-stroke-strong-rest)',
                    fill: 'currentcolor',
                    fontStyle: 'var(--label-font-style)',
                    // gap: 'var(--density_control-vertical-gap)',
                }
            }
        },
        // Todo: There are several MuiInputs. Figure out which one is getting the style. 
        MuiTextField: {
            styleOverrides: {
                root: {

                    ...typeRampBaseStyles,
                    ...inputStyles,

                    borderTopColor: 'var(--neutral-stroke-discernible-rest)',
                    borderRightColor: 'var(--neutral-stroke-discernible-rest)',
                    borderBottomColor: 'var(--neutral-stroke-discernible-rest)',
                    borderLeftColor: 'var(--neutral-stroke-discernible-rest)',
                    color: 'var(--neutral-stroke-strong-rest)',
                    fill: 'currentcolor',
                    backgroundColor: 'var(--fill-color)',


                    gap: 'var(--density_control-horizontal-gap)',

                    '.MuiInputBase-input': {


                        paddingTop: 'var(--density_control-vertical-padding);',
                        paddingRight: 'var(--density_control-horizontal-padding)',
                        paddingBottom: 'var(--density_control-vertical-padding)',
                        paddingLeft: 'var(--density_control-horizontal-padding)',

                    }

                }
            }

        },


        MuiAccordion: {
            styleOverrides: {
                root: {
                    ...typeRampBaseStyles,
                    // host
                    display: 'flex',
                    flexDirection: 'column',
                    // pulled further up
                    backgroundColor: 'var(--fill-color)',

                    color: 'var(--neutral-stroke-strong-rest)',
                    fill: 'currentcolor',
                    borderTopColor: 'var(--neutral-stroke-subtle-rest)',
                    borderTopStyle: 'solid',
                    borderTopWidth: 'var(--stroke-thickness)',
                    boxShadow: 'none'
                }
            }

        },
        MuiAccordionSummary: {
            defaultProps: {
                disableRipple: true,
            },
            styleOverrides: {
                root: {

                    color: 'var(--neutral-stroke-strong-rest)',
                    fill: 'currentcolor',
                    borderBottomColor: 'var(--neutral-stroke-subtle-rest)',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: 'var(--stroke-thickness)',

                }
            }

        },

        // MUI uses an svg icon for checked / unchecked.. 
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '.MuiTypography-root': {
                        ...typeRampBaseStyles,
                        color: 'var(--neutral-stroke-strong-rest)',
                    },

                    '.MuiSvgIcon-root': {
                        color: 'var(--neutral-stroke-discernible-rest)',
                        fill: 'currentcolor',

                    }
                },
            }
        },
        MuiBadge: {
            styleOverrides: {
                root: {
                    ...typeRampMinus1Styles,

                    '.MuiBadge-badge': {
                        // padding: 'calc(((var(--design-unit) * 0.5) - var(--stroke-thickness)) * 1) calc((var(--design-unit) - var(--stroke-thickness)) * 1)',
                        borderRadius: 'var(--corner-radius-control)',
                        // borderTopLeftRadius: 'var(--corner-radius-control',
                        // borderTopRightRadius: 'var(--corner-radius-control)',
                        // borderBottomRightRadius: 'var(--corner-radius-control)',
                        // borderBottomLeftRadius: 'var(--corner-radius-control)',
                        borderTopWidth: 'var(--stroke-thickness)',
                        borderRightWidth: 'var(--stroke-thickness)',
                        borderBottomWidth: 'var(--stroke-thickness)',
                        borderLeftWidth: 'var(--stroke-thickness)',
                        borderTopStyle: 'solid',
                        borderRightStyle: 'solid',
                        borderBottomStyle: 'solid',
                        borderLeftStyle: 'solid',
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                        paddingRight: '0px',
                        paddingLeft: '0',
                        marginRight: '0',
                        marginLeft: '0',
                        backgroundColor: 'var(--neutral-fill-readable-rest)',
                        color: 'var(--neutral-stroke-strong-on-neutral-fill-readable-rest)',
                        // fill: 'currentcolor',
                    },


                }
            }
        }
    }

}