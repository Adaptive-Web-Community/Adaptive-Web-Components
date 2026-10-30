type Entry = [string, unknown];

const isEntries = (value: unknown): value is Entry[] =>
    Array.isArray(value) && value.every(entry => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string");

// The entries of a record as a node stores it, an object, or in a form of a `Map` that versions before 1.0 stored.
function readEntries(json: string): Entry[] {
    const data: unknown = JSON.parse(json);
    if (isEntries(data) && data[0]?.[0] === "__dataType__") {
        return data.slice(1);
    }
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        if ("dataType" in data && data.dataType === "Map" && "value" in data && isEntries(data.value)) {
            return data.value;
        }
        return Object.entries(data);
    }
    throw new Error("Plugin data isn't a record");
}

/**
 * Reads a record that a node stores as JSON: an object by key.
 *
 * @remarks
 * Versions before 1.0 kept a record as a `Map`, which JSON doesn't have, and some nodes have it in one of the forms they wrote it
 * in: `{ "dataType": "Map", "value": [[key, value], ...] }`, or `[["__dataType__", "Map"], [key, value], ...]`. Both read as the record.
 *
 * @param json - The plugin data string.
 * @param isValue - Whether a value is one of the record. One that isn't is left out, with a warning.
 * @returns The record, or an empty one for no data or data that isn't a record.
 */
export function deserializeRecord<V>(json: string | null, isValue: (value: unknown) => value is V): Record<string, V> {
    if (!json) {
        return {};
    }

    try {
        const record: Record<string, V> = {};
        for (const [key, value] of readEntries(json)) {
            if (isValue(value)) {
                record[key] = value;
            } else {
                console.warn(`Plugin data has a value for "${key}" that isn't one of the record`, value);
            }
        }
        return record;
    } catch (e) {
        console.warn(`Plugin data can't be read: ${e instanceof Error ? e.message : e}`, json);
        return {};
    }
}
