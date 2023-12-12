import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { deleteParticipant } from "../../../service/storage";
import StatusLabel from "../../../shared/components/StatusLabel";
import { PARTICIPANTS_STORAGE_KEY } from "../../../shared/constants";
import { Participant } from "../../../types";

const columnHelper = createColumnHelper<Participant>();

export const PARTICIPANTS_COLUMNS = [
    columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
            <div className="flex flex-col">
                <Link
                    to={`/dashboard/participants/${info.row.original.participantId}`}
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
            const client = useQueryClient();
            const mutation = useMutation(deleteParticipant, {
                onSuccess: () => client.invalidateQueries([PARTICIPANTS_STORAGE_KEY]),
            });

            function handleParticipantDeletion() {
                const isDelete = confirm(`Do you want to delete ${info.row.original.name}`);
                if (!isDelete) return;
                mutation.mutate(info.row.original.participantId);
            }

            return (
                <div className="flex items-center">
                    <div className="group relative">
                        <span className="icon-[heroicons--ellipsis-vertical] text-lg text-primary"></span>
                        <div className="absolute left-0 top-0 z-20 hidden rounded bg-white shadow-md group-hover:block">
                            <button
                                onClick={handleParticipantDeletion}
                                className="flex min-w-max items-center px-2 py-2 text-sm"
                            >
                                <span className="icon-[heroicons--trash] text-xl text-red-500"></span>
                                Delete Participant
                            </button>
                        </div>
                    </div>
                    <Link to={`/participants/${info.row.original.participantId}/edit`}>
                        <span className="icon-[heroicons--pencil-square-solid] text-lg text-primary"></span>
                    </Link>
                </div>
            );
        },
    }),
];

function getAmountPaid(value: unknown): string {
    return typeof value === "number" ? value.toFixed(2) : "N/A";
}
