export function mapReplacer(key: string, value: any): any {
    if (value instanceof Map) {
        return [["__dataType__", "Map"], ...value];
        // Legacy format, supported in `mapReviver` below:
        // return {
        //     dataType: "Map",
        //     value: [...value],
        // };
    }

    return value;
}

export function mapReviver(key: string, value: any): any {
    if (value) {
        if (typeof value === "object" && value.dataType === "Map") {
            // Legacy format (revive existing values, see above)
            return new Map(value.value);
        } else if (Array.isArray(value) &&
            value.length > 0 &&
            value.every(val => Array.isArray(val) && val.length === 2) &&
            value[0][0] === "__dataType__"
        ) {
            return new Map(value.slice(1));
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
            if (e instanceof SyntaxError && e.message === "Unexpected end of JSON input") {
                // Empty string, ignore
            } else {
                console.warn(e);
            }
        }
    }

    return new Map();
}

export function serializeMap(map: Map<any, any>): string {
    return JSON.stringify(map, mapReplacer);
}
