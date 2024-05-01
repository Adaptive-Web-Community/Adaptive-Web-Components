import "./dom-shim.js";
import fs from 'fs';
import path from "path";
import type * as FigmaRESTAPI from "@figma/rest-api-spec";
import { FigmaPluginNode } from "../figma/node.js";
import { CodeController } from "../ui/ui-controller-code.js"
import { parseNode } from "./parser.js";


const response: FigmaRESTAPI.GetComponentResponse = {} as any;
response.meta

function compile(node: FigmaRESTAPI.Node) {
    const k = FigmaPluginNode.get(node as any, true)
    console.log(k)
    // controller.getNode(node.id);
}

const data = fs.readFileSync(path.resolve(process.cwd(), "test.json")).toString();
const jsonData = JSON.parse(data) as FigmaRESTAPI.GetFileNodesResponse;

const generator = new CodeController();

for (const key in jsonData.nodes) {
    const node = jsonData.nodes[key];
    const parsed = parseNode(node.document);
    const styles = generator.generateStyles(parsed);
}