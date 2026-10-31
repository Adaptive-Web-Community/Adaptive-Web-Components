// An icon of 16 by 16, whose path is stroked or filled with the current color by `svgIconStyles`.
const svgIcon = (path: string, className: "stroked" | "filled" = "stroked"): string => {
    const pathStyle = className === "filled" ? 'stroke="none"': 'fill="none"';
    return `<svg class="${className}" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="${path}" ${pathStyle}/>
</svg>`;
}

/**
 * The SVG of a check mark, for a checked checkbox.
 *
 * @public
 */
export const checkboxIcon = svgIcon("M3 9L5.5 11.5L13.5 4");

/**
 * The SVG of a dash, for an indeterminate checkbox.
 *
 * @public
 */
export const checkboxIndeterminateIcon = svgIcon("M2.5 8H13.5");

/**
 * The SVG of a dot, for a checked radio.
 *
 * @public
 */
export const radioIcon = svgIcon("M12.5 8a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z", "filled");

/**
 * The SVG of a chevron down.
 *
 * @public
 */
export const chevronDownIcon = svgIcon("M3.5 6L8 10.5L12.5 6");

/**
 * The SVG of a chevron left.
 *
 * @public
 */
export const chevronLeftIcon = svgIcon("M10 12.5L5.5 8L10 3.5");

/**
 * The SVG of a chevron right.
 *
 * @public
 */
export const chevronRightIcon = svgIcon("M6 3.5L10.5 8L6 12.5");

/**
 * The SVG of a chevron up.
 *
 * @public
 */
export const chevronUpIcon = svgIcon("M3.5 10L8 5.5L12.5 10");

/**
 * The SVG of a cross, to dismiss.
 *
 * @public
 */
export const dismissIcon = svgIcon("M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5");
