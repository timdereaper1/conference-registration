import { useQuery } from "@tanstack/react-query";
import {
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useFormik } from "formik";
import localforage from "localforage";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SelectField from "../../../shared/components/SelectField";
import TextField from "../../../shared/components/TextField";
import { PARTICIPANTS_STORAGE_KEY } from "../../../shared/constants";
import { Participant } from "../../../types";
import { PARTICIPANTS_COLUMNS } from "./columns";
import {
    getFilterFromTableColumnFilters,
    getTableFilteredColumnsFromFilter,
} from "./utils/filtering";

export default function Participants() {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        getTableFilteredColumnsFromFilter("full"),
    );
    const [sorting, setSorting] = useState<SortingState>([]);

    const form = useFormik({
        initialValues: { search: "" },
        onSubmit() {
            return;
        },
    });

    const query = useQuery([PARTICIPANTS_STORAGE_KEY], () =>
        localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY),
    );

    const data = useMemo(() => query.data ?? [], [query.data]);

    const table = useReactTable({
        columns: PARTICIPANTS_COLUMNS,
        data,
        getCoreRowModel: getCoreRowModel(),
        state: { columnFilters, sorting },
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
    });

    function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
        table.setColumnFilters(getTableFilteredColumnsFromFilter(event.currentTarget.value));
    }

    return (
        <section className="rounded-md bg-white shadow-2xl">
            <header>
                <div className="flex items-center justify-between border-b border-solid border-primary-50 p-4">
                    <h2 className="text-base">Registered Participants</h2>
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="columnFilters"
                            className="flex items-center rounded border border-solid border-primary px-4 text-sm font-bold text-primary"
                        >
                            Filter by
                            <select
                                name="filters"
                                id="filters"
                                onChange={handleFilterChange}
                                className="max-w-min border-none py-2 outline-none "
                                value={getFilterFromTableColumnFilters(columnFilters)}
                            >
                                <option value="full">Paid participants</option>
                                <option value="partial">Partially paid participants</option>
                                <option value="pledge">Un-paid participants</option>
                                <option value="none"></option>
                            </select>
                        </label>
                        <Link
                            to="/register?redirect=dashboard/participants"
                            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-white"
                        >
                            <span className="icon-[heroicons--plus]"></span>
                            Add Record
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-solid border-primary-50 p-4">
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
                    <TextField
                        inline
                        label="Search"
                        name="search"
                        onChange={form.handleChange}
                        value={form.values.search}
                        className="max-w-xs"
                    />
                </div>
            </header>
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
        </section>
    );
}
