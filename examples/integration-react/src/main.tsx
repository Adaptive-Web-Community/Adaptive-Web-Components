import React from "react";
import ReactDOM from "react-dom";
import { DesignToken } from "@microsoft/fast-foundation";
import "./index.css";
import App from "./App.js";

// Needed so design tokens know where to render: css properties on the doc root by default.
DesignToken.registerDefaultStyleTarget();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
