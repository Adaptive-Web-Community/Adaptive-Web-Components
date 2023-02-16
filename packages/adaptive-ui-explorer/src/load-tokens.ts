import { parse } from "@adaptive-web/adaptive-ui";
import { DesignToken } from "@microsoft/fast-foundation";

// console.log("Importing tokens.json");
import tokens from "./test.tokens.json";
parse(tokens);

DesignToken.registerDefaultStyleTarget();
