export function mapReplacer(key: string, value: any): any {
    if (value instanceof Map) {
        return [["__dataType__", "Map"], ...value];
        // Legacy format:
        // return {
        //     dataType: "Map",
        //     value: [...value],
        // };
    } else {
        return value;
    }
}

export function mapReviver(key: string, value: any): any {
    if (value !== null) {
        if (typeof value === "object" && value.dataType === "Map") {
            // Legacy format (revive existing values, see above)
            return new Map(value.value);
        } else if (Array.isArray(value) && value.length > 0 && value.every(val => Array.isArray(val) && val.length === 2)) {
            if (value[0][0] === "__dataType__") {
                value = value.slice(1);
            }
            return new Map(value);
        }
    }
    return value;
}

export function deserializeMap<K, V>(json?: string): Map<K, V> {
    if (json) {
        try {
            const map = JSON.parse(json, mapReviver) as Map<K, V>;
            return map;
        } catch (e) {
            // console.warn(e);
            // Ignore, empty string
        }
    }

    return new Map();
}

export function serializeMap(map: Map<any, any>): string {
    return JSON.stringify(map, mapReplacer);
}
