import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatusLabel from "../../../shared/components/StatusLabel";
import { prisma } from "../../../shared/db";

export default async function ParticipantPage({ params }: { params: { id: string } }) {
    const participant = await prisma.participant.findFirst({ where: { id: Number(params.id) } });
    return (
        <section className="max-w-xs rounded-md bg-white px-8 py-16 shadow-xl">
            <div className="flex flex-col items-center pb-12">
                <span className="icon-[heroicons--user-circle-solid] text-9xl leading-none"></span>
                <h3>{participant?.name}</h3>
            </div>
            <h2 className="border-b border-solid border-[#EBE9F1] text-lg font-semibold text-dark-500">
                Details
            </h2>
            <ul className="flex flex-col gap-2 py-3 text-sm text-dark">
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Age:</span>
                    {participant?.age}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Email:</span>
                    {participant?.email}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Telephone:</span>
                    {participant?.telephone}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Amount Paid:</span>
                    {participant?.amount}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Payment Status:</span>
                    <StatusLabel status={participant?.status} />
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Assigned Group:</span>
                    {participant?.groupId}
                </li>
                <li className="flex items-center gap-4">
                    <span className="font-semibold">Address:</span>
                    {participant?.address}
                </li>
            </ul>
            {/* <Link to="/participants">Go To Participants</Link> */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <Link
                    href={`/dashboard/participants/${params.id}/edit`}
                    className="inline-block rounded bg-primary px-4 py-2 text-sm text-white"
                >
                    Edit
                </Link>
                <form
                    action={async (formData) => {
                        "use server";
                        const id = Number(formData.get("id"));
                        await prisma.participant.delete({ where: { id } });
                        revalidatePath("/dashboard/participants");
                        redirect("/dashboard/participants");
                    }}
                >
                    <input type="hidden" name="id" value={params.id} />
                    <button
                        type="submit"
                        className="rounded border border-solid border-red-500 bg-white px-4 py-2 text-sm text-red-500"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </section>
    );
}
