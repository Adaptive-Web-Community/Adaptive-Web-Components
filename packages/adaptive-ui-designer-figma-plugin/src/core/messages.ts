import { PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";

export interface CreateStatesMessage {
    readonly type: 'CREATE_STATES';
    id: string;
}

export interface NodeDataMessage {
    readonly type: 'NODE_DATA';
    nodes: PluginUINodeData[];
}

export type PluginMessage = CreateStatesMessage | NodeDataMessage;
