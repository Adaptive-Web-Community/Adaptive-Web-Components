const svgIcon = (path: string, className: "stroked" | "filled" = "stroked"): string => {
    const pathStyle = className === "filled" ? 'stroke="none"': 'fill="none"';
    return `<svg class="${className}" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="${path}" ${pathStyle}/>
</svg>`;
}

export const checkboxIcon = svgIcon("M3 9L5.5 11.5L13.5 4");

export const checkboxIndeterminateIcon = svgIcon("M2.5 8H13.5");

export const radioIcon = svgIcon("M12.5 8a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z", "filled");

export const chevronDownIcon = svgIcon("M3.5 6L8 10.5L12.5 6");

export const chevronLeftIcon = svgIcon("M10 12.5L5.5 8L10 3.5");

export const chevronRightIcon = svgIcon("M6 3.5L10.5 8L6 12.5");

export const chevronUpIcon = svgIcon("M3.5 10L8 5.5L12.5 10");
