import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import localforage from "localforage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteParticipant } from "../../../../service/storage";
import StatusLabel from "../../../../shared/components/StatusLabel";
import { PARTICIPANTS_STORAGE_KEY } from "../../../../shared/constants";
import { Participant } from "../../../../types";

export default function ParticipantInfo() {
    const params = useParams();
    if (!params.participantId) return <div>There is no participant to show</div>;
    const participantId = parseFloat(params.participantId);
    return <ParticipantDetails participantId={participantId} />;
}

function ParticipantDetails({ participantId }: { participantId: number }) {
    const client = useQueryClient();
    const query = useQuery([PARTICIPANTS_STORAGE_KEY, participantId], async () => {
        const participants = await localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY);
        return participants?.find((participant) => participant.participantId === participantId);
    });
    const navigate = useNavigate();
    const mutation = useMutation(deleteParticipant, {
        onSuccess: async () => {
            await client.invalidateQueries([PARTICIPANTS_STORAGE_KEY]);
            navigate("/participants");
        },
    });

    function handleDelete() {
        const isDelete = confirm(`Do you want to delete ${query.data?.name}`);
        if (!isDelete) return;
        mutation.mutate(participantId);
    }

    return (
        <section className="max-w-xs rounded-md bg-white px-8 py-16 shadow-xl">
            <div className="flex flex-col items-center pb-12">
                <span className="icon-[heroicons--user-circle-solid] text-9xl leading-none"></span>
                <h3>{query.data?.name}</h3>
            </div>
            <h2 className="border-b border-solid border-[#EBE9F1] text-lg font-semibold text-dark-500">
                Details
            </h2>
            <ul className="flex flex-col gap-2 py-3 text-sm text-dark">
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Age:</span>
                    {query.data?.age}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Email:</span>
                    {query.data?.email}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Telephone:</span>
                    {query.data?.telephone}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Amount Paid:</span>
                    {query.data?.amount}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Payment Status:</span>
                    <StatusLabel status={query.data?.status} />
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Assigned Group:</span>
                    {query.data?.groupId}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Address:</span>
                    {query.data?.address}
                </li>
            </ul>
            {/* <Link to="/participants">Go To Participants</Link> */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <Link
                    to={`/dashboard/participants/${participantId}/edit`}
                    className="inline-block rounded bg-primary px-4 py-2 text-sm text-white"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="rounded border border-solid border-red-500 bg-white px-4 py-2 text-sm text-red-500"
                >
                    Delete
                </button>
            </div>
        </section>
    );
}
