"use client";

import { Participant } from "@prisma/client";
import {
    ColumnFiltersState,
    SortingState,
    Table,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import SelectField from "../../shared/components/SelectField";
import StatusLabel from "../../shared/components/StatusLabel";
import { prisma } from "../../shared/db";

const columnHelper = createColumnHelper<Participant>();

const TableContext = createContext<Table<Participant> | undefined>(undefined);

export function ParticipantsTableContext({
    children,
    participants,
}: PropsWithChildren<{ participants: Participant[] }>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        getTableFilteredColumnsFromFilter("full"),
    );
    const data = useMemo(() => participants ?? [], [participants]);

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => (
                    <div className="flex flex-col">
                        <Link
                            href={`/dashboard/participants/${info.row.original.id}`}
                            className="font-semibold text-dark-500"
                        >
                            {info.getValue()}
                        </Link>
                        <span className="text-dark-50">{info.row.original.email}</span>
                    </div>
                ),
            }),
            columnHelper.accessor("age", {
                header: "Age",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("address", {
                header: "Address",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("telephone", {
                header: "Telephone",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("amount", {
                header: "Amount",
                cell: (info) => getAmountPaid(info.getValue()),
            }),
            columnHelper.accessor("status", {
                header: "Status",
                cell: (info) => <StatusLabel status={info.getValue()} />,
            }),
            columnHelper.accessor("groupId", {
                header: "Group",
                cell: (info) => info.getValue(),
            }),
            columnHelper.display({
                header: "Actions",
                cell: function Actions(info) {
                    return (
                        <div className="flex items-center">
                            <div className="group relative">
                                <span className="icon-[heroicons--ellipsis-vertical] text-lg text-primary"></span>
                                <div className="absolute left-0 top-0 z-20 hidden rounded bg-white shadow-md group-hover:block">
                                    <form
                                        action={async (formData) => {
                                            "use server";
                                            const id = Number(formData.get("participant"));
                                            await prisma.participant.delete({ where: { id } });
                                            revalidatePath("/dashboard/participants");
                                        }}
                                    >
                                        <input
                                            type="hidden"
                                            name="participant"
                                            id={info.row.original.id.toString()}
                                        />
                                        <button
                                            className="flex min-w-max items-center p-2 text-sm"
                                            type="submit"
                                        >
                                            <span className="icon-[heroicons--trash] text-xl text-red-500"></span>
                                            Delete Participant
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <Link href={`/participants/${info.row.original.id}/edit`}>
                                <span className="icon-[heroicons--pencil-square-solid] text-lg text-primary"></span>
                            </Link>
                        </div>
                    );
                },
            }),
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        state: { columnFilters, sorting },
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    });

    return <TableContext.Provider value={table}>{children}</TableContext.Provider>;
}

export function FilterParticipantsSelectField() {
    const table = useContext(TableContext);
    if (!table) return null;
    return (
        <label
            htmlFor="columnFilters"
            className="flex items-center rounded border border-solid border-primary px-4 text-sm font-bold text-primary"
        >
            Filter by
            <select
                name="filters"
                id="filters"
                onChange={(event) => {
                    table.setColumnFilters(
                        getTableFilteredColumnsFromFilter(event.currentTarget.value),
                    );
                }}
                className="max-w-min border-none py-2 outline-none"
                value={getFilterFromTableColumnFilters(table.getState().columnFilters)}
            >
                <option value="full">Paid participants</option>
                <option value="partial">Partially paid participants</option>
                <option value="pledge">Un-paid participants</option>
                <option value="none"></option>
            </select>
        </label>
    );
}

export function TablePaginationSelectField() {
    const table = useContext(TableContext);
    if (!table) return null;
    return (
        <SelectField
            label="Show"
            onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
            value={table.getState().pagination.pageSize}
            inline
            className="max-w-[6.4rem]"
        >
            {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                    {size}
                </option>
            ))}
        </SelectField>
    );
}

export function ParticipantsTable() {
    const table = useContext(TableContext);
    if (!table) return null;
    return (
        <table className="w-full border-collapse">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-[#F3F2F7]">
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                className="group border-b border-solid border-primary-50 px-4 py-2 text-left text-sm font-semibold uppercase text-dark-500"
                                data-sorted={header.column.getIsSorted()}
                            >
                                {header.isPlaceholder ? null : (
                                    <div className="flex items-center gap-2">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                        <div className="flex flex-1 flex-col items-end">
                                            <span className="icon-[heroicons--chevron-up] text-xs opacity-50 group-data-[sorted=asc]:opacity-100"></span>
                                            <span className="icon-[heroicons--chevron-down] text-xs opacity-50 group-data-[sorted=asc]:opacity-100"></span>
                                        </div>
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                className="border-b border-solid border-primary-50 px-4 py-2 text-left text-sm text-dark"
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function getAmountPaid(value: unknown): string {
    return typeof value === "number" ? value.toFixed(2) : "N/A";
}

function getTableFilteredColumnsFromFilter(filters: string) {
    const valueToActionMapping: Record<string, { id: keyof Participant; value: string }> = {
        partial: { id: "status", value: "partial" },
        pledge: { id: "status", value: "pledge" },
        full: { id: "status", value: "full" },
    };
    const columnFilter = valueToActionMapping[filters] ?? undefined;
    return columnFilter ? [columnFilter] : [];
}

function getFilterFromTableColumnFilters(columnFilters: ColumnFiltersState) {
    const filter = columnFilters?.find((state) => state.id === "status")?.value;
    return filter as string | undefined;
}
