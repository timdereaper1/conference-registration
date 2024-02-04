import Link from "next/link";
import { REGISTRATION_FEE } from "../shared/constants";
import { prisma } from "../shared/db";

export default async function DashboardPage() {
    const participants = await prisma.participant.findMany();

    let totalAmountPaid = 0;
    const totalParticipants = participants?.length ?? 0;
    const totalAmountToCollect = REGISTRATION_FEE * totalParticipants;

    const payment = participants?.reduce(
        (acc, participant) => {
            acc[participant.status] = {
                people: acc[participant.status].people + 1,
                total: acc[participant.status].total + participant.amount,
            };
            totalAmountPaid += participant.amount;
            return acc;
        },
        {
            full: { total: 0, people: 0 },
            partial: { total: 0, people: 0 },
            pledge: { total: 0, people: 0 },
        },
    );

    const sumOfPaidParticipants = (payment?.full.people ?? 0) + (payment?.partial.people ?? 0);

    const total = {
        paid: totalAmountPaid,
        remaining: totalAmountToCollect - totalAmountPaid,
        amount: totalAmountToCollect,
        participants: totalParticipants,
    };

    const paidPercentage = Math.ceil((sumOfPaidParticipants / totalParticipants) * 100);

    return (
        <div className="rounded bg-white p-8 shadow-2xl">
            <div className="flex items-start">
                <div className="rounded shadow-lg">
                    <div className="p-4">
                        <h3 className="flex w-full items-center justify-between text-sm text-gray-600">
                            Paid Participants
                            <span className="icon-[heroicons--question-mark-circle] ml-8 text-gray-400"></span>
                        </h3>
                        <div className="mt-4 flex items-center justify-center">
                            <span className="rounded-full border border-gray-100 p-8 text-xl text-gray-600">
                                {paidPercentage}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center border-t border-solid border-gray-100">
                        <div className="flex flex-1 flex-col items-center justify-center border-r border-solid border-gray-100 py-2">
                            <h4 className="text-xs text-gray-400">Paid</h4>
                            <span className="text-base font-bold text-gray-600">
                                {(payment?.full.people ?? 0) + (payment?.partial.people ?? 0)}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center py-2">
                            <h4 className="text-xs text-gray-400">Unpaid</h4>
                            <span className="text-base font-bold text-gray-600">
                                {payment?.pledge.people}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 rounded shadow-md"></div>
            </div>
            <Link href="/register">Add Participant</Link>
            <ul>
                <li>
                    <strong>Total number of registered participants:</strong>
                    {total.participants}
                </li>
                <li>
                    <strong>Total paid amount: </strong>
                    {total.paid?.toFixed(2)}
                </li>
                <li>
                    <strong>Amount to be collected: </strong>
                    {total.amount.toFixed(2)}
                </li>
                <li>
                    <strong>Amount remaining to be paid: </strong>
                    {total.remaining.toFixed(2)}
                </li>
                <li>
                    <div>
                        <strong>Total fully paid amount: </strong>
                        {payment?.full.total.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of fully paid participants: </strong>
                        {payment?.full.people}
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Total partial paid amount: </strong>
                        {payment?.partial.total.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of partial paid participants: </strong>
                        {payment?.partial.people}
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Total pledges to be paid: </strong>
                        {payment?.pledge.total.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of participants who has pledge: </strong>
                        {payment?.pledge.people}
                    </div>
                </li>
            </ul>
        </div>
    );
}
