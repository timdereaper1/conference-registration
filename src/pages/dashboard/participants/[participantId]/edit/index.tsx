import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import localforage from "localforage";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { PARTICIPANTS_STORAGE_KEY, REGISTRATION_FEE } from "../../../../../shared/constants";
import { Participant } from "../../../../../types";

export default function EditParticipantPage() {
    const params = useParams();
    if (!params.participantId) return <div>There is no participant</div>;
    const participantId = parseFloat(params.participantId);
    return <EditParticipant participantId={participantId} />;
}

const validationSchema = z.object({
    name: z.string(),
    age: z.number(),
    address: z.string(),
    telephone: z.string(),
    email: z.string().email(),
    amount: z.number().nullable(),
    status: z.string(),
    groupId: z.number().max(10).min(1),
});

function EditParticipant({ participantId }: { participantId: number }) {
    const navigate = useNavigate();

    const client = useQueryClient();
    const query = useQuery([PARTICIPANTS_STORAGE_KEY, participantId], async () => {
        const participants = await localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY);
        return participants?.find((participant) => participant.participantId === participantId);
    });
    const mutation = useMutation(
        async (values: Omit<Participant, "participantId">) => {
            const participants = await localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY);
            const updatedParticipantsData = participants?.map((participant) =>
                participant.participantId === participantId
                    ? { ...values, participantId }
                    : participant,
            );
            return localforage.setItem(PARTICIPANTS_STORAGE_KEY, updatedParticipantsData);
        },
        {
            onSuccess() {
                return client.invalidateQueries([PARTICIPANTS_STORAGE_KEY]);
            },
            onSettled(_, error) {
                if (error) return;
                navigate(-1);
            },
        },
    );

    const form = useFormik({
        enableReinitialize: true,
        validationSchema: toFormikValidationSchema(validationSchema),
        initialValues: {
            name: query.data?.name ?? "",
            age: query.data?.age ?? 0,
            address: query.data?.address ?? "",
            telephone: query.data?.telephone ?? "",
            email: query.data?.email ?? "",
            amount: query.data?.amount ?? 0,
            status: query.data?.status ?? ("partial" as Participant["status"]),
            groupId: query.data?.groupId ?? -1,
        },
        onSubmit(values, formikHelpers) {
            if (values.amount < REGISTRATION_FEE && values.status === "full")
                return formikHelpers.setFieldError(
                    "status",
                    "Should not choose full payment when participant hasn't paid the full amount",
                );
            mutation.mutate(values);
        },
    });

    return (
        <>
            <form onSubmit={form.handleSubmit}>
                <div>
                    <label htmlFor="name">
                        Name* <br />
                        <input
                            value={form.values.name}
                            onChange={form.handleChange}
                            type="text"
                            name="name"
                            id="name"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="age">
                        Age* <br />
                        <input
                            required
                            type="number"
                            onChange={form.handleChange}
                            value={form.values.age}
                            name="age"
                            id="age"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="address">
                        Address* <br />
                        <textarea
                            name="address"
                            onChange={form.handleChange}
                            required
                            id="address"
                            value={form.values.address}
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label htmlFor="telephone">
                        Telephone* <br />
                        <input
                            type="text"
                            name="telephone"
                            onChange={form.handleChange}
                            id="telephone"
                            required
                            value={form.values.telephone}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="email">
                        Email <br />
                        <input
                            onChange={form.handleChange}
                            type="email"
                            name="email"
                            id="email"
                            value={form.values.email}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="amount">
                        Amount <br />
                        <input
                            onChange={form.handleChange}
                            type="number"
                            name="amount"
                            id="amount"
                            value={form.values.amount}
                            min={0}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="groupId">
                        Assigned Group* <br />
                        <input
                            required
                            onChange={form.handleChange}
                            type="number"
                            name="groupId"
                            id="groupId"
                            value={form.values.groupId ?? ""}
                            min={1}
                            max={10}
                            step={1}
                        />
                        {form.errors.groupId ? <small>{form.errors.groupId}</small> : null}
                    </label>
                </div>
                <div>
                    <label htmlFor="status">
                        Status* <br />
                        <select
                            onChange={form.handleChange}
                            name="status"
                            id="status"
                            required
                            value={form.values.status}
                        >
                            <option value="full">Full Payment</option>
                            <option value="partial">Partial Payment</option>
                            <option value="pledge">Pledge</option>
                        </select>
                        {form.errors.status ? <small>{form.errors.status}</small> : null}
                    </label>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </>
    );
}
