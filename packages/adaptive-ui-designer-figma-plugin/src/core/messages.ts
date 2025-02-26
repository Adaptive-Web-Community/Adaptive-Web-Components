import { PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";

export interface CreateStatesMessage {
    readonly type: 'CREATE_STATES';
    id: string;
}

export interface NodeDataMessage {
    readonly type: 'NODE_DATA';
    nodes: PluginUINodeData[];
}

export interface SkipInvisibleNodesMessage {
    readonly type: 'SKIP_INVISIBLE_NODES';
    value: boolean;
}

export type PluginMessage = CreateStatesMessage | NodeDataMessage | SkipInvisibleNodesMessage;
