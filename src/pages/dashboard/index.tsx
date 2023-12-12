import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import { Link } from "react-router-dom";
import { PARTICIPANTS_STORAGE_KEY, REGISTRATION_FEE } from "../../shared/constants";
import { Participant } from "../../types";

export default function Dashboard() {
    const query = useQuery([PARTICIPANTS_STORAGE_KEY], () =>
        localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY),
    );

    const fullPaidInfo = getStatusInfo("full");
    const partialPaidInfo = getStatusInfo("partial");
    const pledgePaidInfo = getStatusInfo("pledge");

    const amountPaid = query.data?.reduce((acc, participant) => acc + participant.amount, 0);
    const totalAmountToBeCollected = REGISTRATION_FEE * (query.data?.length ?? 0);
    const remainingAmountToBePaid = totalAmountToBeCollected - (amountPaid ?? 0);

    const totalRegisteredParticipants =
        fullPaidInfo.people + partialPaidInfo.people + pledgePaidInfo.people;
    const registeredParticipantsPercent = (fullPaidInfo.people / totalRegisteredParticipants) * 100;

    function getStatusInfo(status: Participant["status"]) {
        const initialValues = { totalAmount: 0, people: 0 };
        if (!query.data) return initialValues;
        return query.data?.reduce((acc, participant) => {
            return participant.status === status
                ? { totalAmount: acc.totalAmount + participant.amount, people: acc.people + 1 }
                : acc;
        }, initialValues);
    }

    return (
        <div className="rounded bg-white p-8 shadow-2xl">
            <div className="flex items-start">
                <div className="rounded shadow-md">
                    <div className="px-4 py-4">
                        <h3 className="flex w-full items-center justify-between text-sm text-gray-600">
                            Registered Participants
                            <span className="icon-[heroicons--question-mark-circle] ml-8 text-gray-400"></span>
                        </h3>
                        <div className="mt-4 flex items-center justify-center">
                            <span className="rounded-full border border-gray-100 p-8 text-xl text-gray-600">
                                {Math.ceil(registeredParticipantsPercent)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center border-t border-solid border-gray-100">
                        <div className="flex flex-1 flex-col items-center justify-center border-r border-solid border-gray-100 py-2">
                            <h4 className="text-xs text-gray-400">Fully paid</h4>
                            <span className="text-base font-bold text-gray-600">
                                {fullPaidInfo.people}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center py-2">
                            <h4 className="text-xs text-gray-400">Unpaid</h4>
                            <span className="text-base font-bold text-gray-600">
                                {partialPaidInfo.people + pledgePaidInfo.people}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 rounded shadow-md"></div>
            </div>
            <Link to="/register">Add Participant</Link>
            <ul>
                <li>
                    <strong>Total number of registered participants:</strong>
                    {query.data?.length}
                </li>
                <li>
                    <strong>Total paid amount: </strong>
                    {amountPaid?.toFixed(2)}
                </li>
                <li>
                    <strong>Amount to be collected: </strong>
                    {totalAmountToBeCollected.toFixed(2)}
                </li>
                <li>
                    <strong>Amount remaining to be paid: </strong>
                    {remainingAmountToBePaid.toFixed(2)}
                </li>
                <li>
                    <div>
                        <strong>Total fully paid amount: </strong>
                        {fullPaidInfo?.totalAmount.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of fully paid participants: </strong>
                        {fullPaidInfo?.people}
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Total partial paid amount: </strong>
                        {partialPaidInfo?.totalAmount.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of partial paid participants: </strong>
                        {partialPaidInfo?.people}
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Total pledges to be paid: </strong>
                        {pledgePaidInfo?.totalAmount.toFixed(2)}
                    </div>
                    <div>
                        <strong>Number of participants who has pledge: </strong>
                        {pledgePaidInfo?.people}
                    </div>
                </li>
            </ul>
        </div>
    );
}
