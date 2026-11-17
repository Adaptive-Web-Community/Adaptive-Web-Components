import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link CalendarElement}.
 *
 * @public
 */
export const calendarDocumentation = defineDocumentation({
    id: "calendar",
    definition:
        "A **Calendar** shows one month as a grid of days for selecting one date or several, as a form control.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The label and header surround a table grid the controller fills in the `days` part.",
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text that names the grid.",
            },
            header: {
                description: "The previous button, title, and next button.",
                parts: {
                    previousMonth: {
                        description: "Shows the previous month.",
                        interactive: true,
                    },
                    title: {
                        description: "The month and year shown.",
                    },
                    nextMonth: {
                        description: "Shows the next month.",
                        interactive: true,
                    },
                },
            },
            days: {
                description: "The grid of days (`role=\"grid\"`).",
                parts: {
                    weekDays: {
                        description: "The row of weekday names.",
                        parts: {
                            weekDay: {
                                description: "One weekday column header.",
                            },
                        },
                    },
                    week: {
                        description: "One week row.",
                        parts: {
                            day: {
                                description: "One day cell.",
                                parts: {
                                    date: {
                                        description: "The day number in the cell.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    contract: {
        include: [labelledDocumentation],
        properties: [
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The name of its value in the form data.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description: "The selected date, or the first of several with `multiple`, or an empty string.",
            },
            {
                id: "multiple",
                kind: ContractPropertyKind.boolean,
                description: "Whether any number of dates can be selected, or one.",
            },
            {
                id: "min",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The earliest selectable date, or null.",
            },
            {
                id: "max",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The latest selectable date, or null.",
            },
            {
                id: "disabledDates",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "Dates that can't be selected, comma-separated.",
            },
            {
                id: "month",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The month shown (1–12), or null to derive from the value or today.",
            },
            {
                id: "year",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The year shown, or null to derive from the value or today.",
            },
            {
                id: "locale",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The locale for names and numbers, or null for `lang` or the browser.",
            },
            {
                id: "firstDay",
                kind: ContractPropertyKind.number,
                nullable: true,
                description: "The first day of the week (0–6), or null for the locale's.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled. A disabled `<fieldset>` also disables it: select `:disabled`.",
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is read only: keys move but dates can't be selected.",
            },
        ],
        slots: [
            {
                id: "label",
                description: "Visible label (see the `labelled` contract).",
            },
            {
                id: "previous-month",
                description: "Content of the previous-month button.",
            },
            {
                id: "next-month",
                description: "Content of the next-month button.",
            },
        ],
    },
});
