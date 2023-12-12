import { ColumnFiltersState } from "@tanstack/react-table";
import { Participant } from "../../../../types";

export function getTableFilteredColumnsFromFilter(filters: string) {
    const valueToActionMapping: Record<string, { id: keyof Participant; value: string }> = {
        partial: { id: "status", value: "partial" },
        pledge: { id: "status", value: "pledge" },
        full: { id: "status", value: "full" },
    };
    const columnFilter = valueToActionMapping[filters] ?? undefined;
    return columnFilter ? [columnFilter] : [];
}

export function getFilterFromTableColumnFilters(columnFilters: ColumnFiltersState) {
    const filter = columnFilters?.find((state) => state.id === "status")?.value;
    return filter as string | undefined;
}
