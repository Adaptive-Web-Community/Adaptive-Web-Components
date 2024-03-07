export function getTheme(): string {
    const theme = window.location.search.replace("?", "") || "default";
    return theme;
}
