// ISO dates (`2026-10-27`) as plain days, without a time zone: computed in UTC, so no day shifts with daylight saving.

const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Whether a string is an ISO date that exists.
 */
export function isIsoDate(value: string): boolean {
    const match = isoPattern.exec(value);
    return !!match && toIso(fromIso(value)) === value;
}

/**
 * The date of an ISO date, at midnight UTC.
 */
export function fromIso(value: string): Date {
    const [, year, month, day] = isoPattern.exec(value) ?? [];
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

/**
 * The ISO date of a date in UTC.
 */
export function toIso(date: Date): string {
    const year = `${date.getUTCFullYear()}`.padStart(4, "0");
    const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
    const day = `${date.getUTCDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * An ISO date a number of days later, or earlier.
 */
export function addDays(value: string, days: number): string {
    const date = fromIso(value);
    date.setUTCDate(date.getUTCDate() + days);
    return toIso(date);
}

/**
 * An ISO date a number of months later, or earlier, on the same day, or the last of the month when it has fewer.
 */
export function addMonths(value: string, months: number): string {
    const date = fromIso(value);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + months);
    date.setUTCDate(Math.min(day, daysInMonth(date.getUTCFullYear(), date.getUTCMonth() + 1)));
    return toIso(date);
}

/**
 * The number of days of a month, from 1 to 12.
 */
export function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Today's ISO date, where the user is.
 */
export function today(): string {
    const now = new Date();
    return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}
