import { DesignToken } from "@microsoft/fast-foundation";
import { reactWrapper } from "@microsoft/fast-react-wrapper";
import { AdaptiveDesignSystem } from "@adaptive-web/adaptive-web-components";
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";

AdaptiveDesignSystem.defineComponents({
    buttonDefinition,
});

DesignToken.registerDefaultStyleTarget();

const wrap = reactWrapper(React);
export const AdaptiveButton = wrap(buttonDefinition);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
