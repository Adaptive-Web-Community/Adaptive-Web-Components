import React from "react";
//import ReactDOM from "react-dom";
import * as ReactDOM from "react-dom/client";
import { DesignToken } from "@microsoft/fast-foundation";
import "./index.css";
import App from "./App.js";

// Needed so design tokens know where to render: css properties on the doc root by default.
DesignToken.registerDefaultStyleTarget();

// Shadow root
// import createCache from "@emotion/cache";
// import { CacheProvider } from "@emotion/react";
// import { StyledEngineProvider, createTheme, ThemeProvider } from "@mui/material/styles";

// const container = document.querySelector("#root");
// const shadowRoot = container.attachShadow({ mode: "open" });
// const emotionRoot = document.createElement("style");
// const renderIn = document.createElement("div");
// renderIn.id = "DailyFlightView";
// renderIn.style = "height: 100%; overflow: hidden";
// shadowRoot.appendChild(emotionRoot);
// shadowRoot.appendChild(renderIn);

// const shadowRootElement = renderIn;

// const theme = createTheme({
//     components: {
//         MuiPopover: {
//             defaultProps: {
//                 container: shadowRootElement,
//             },
//         },
//         MuiPopper: {
//             defaultProps: {
//                 container: shadowRootElement,
//             },
//         },
//     },
// });

// const cache = createCache({
//     key: "css",
//     prepend: true,
//     container: emotionRoot,
// });

// const root = ReactDOM.createRoot(renderIn);
// root.render(
//     <StyledEngineProvider injectFirst>
//         <ThemeProvider theme={theme}>
//             <CacheProvider value={cache}>
//                 <App shadowRootElement={shadowRootElement} />
//             </CacheProvider>
//         </ThemeProvider>
//     </StyledEngineProvider>
// );

const domNode = document.getElementById("root");

ReactDOM.createRoot(domNode).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    // document.getElementById("root")
);
