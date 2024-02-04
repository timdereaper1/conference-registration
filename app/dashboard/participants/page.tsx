import Link from "next/link";
import TextField from "../../shared/components/TextField";
import { prisma } from "../../shared/db";
import {
    FilterParticipantsSelectField,
    ParticipantsTable,
    ParticipantsTableContext,
    TablePaginationSelectField,
} from "./participants-table";

export default async function ParticipantsPage() {
    const participants = await prisma.participant.findMany();
    return (
        <section className="rounded-md bg-white shadow-2xl">
            <ParticipantsTableContext participants={participants}>
                <header>
                    <div className="flex items-center justify-between border-b border-solid border-primary-50 p-4">
                        <h2 className="text-base">Registered Participants</h2>
                        <div className="flex items-center gap-4">
                            <FilterParticipantsSelectField />
                            <Link
                                href="/register?redirect=dashboard/participants"
                                className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-white"
                            >
                                <span className="icon-[heroicons--plus]"></span>
                                Add Record
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-solid border-primary-50 p-4">
                        <TablePaginationSelectField />
                        <TextField inline label="Search" name="search" className="max-w-xs" />
                    </div>
                </header>
                <ParticipantsTable />
            </ParticipantsTableContext>
        </section>
    );
}
