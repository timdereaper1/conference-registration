import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import localforage from "localforage";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Button from "../../shared/components/Button";
import SelectField from "../../shared/components/SelectField";
import TextField from "../../shared/components/TextField";
import { PARTICIPANTS_STORAGE_KEY, REGISTRATION_FEE } from "../../shared/constants";
import { Participant } from "../../types";
import DesignerGirl from "../../undraw_designer_girl_re_h54c.svg";

const validationSchema = z.object({
    name: z.string(),
    age: z.number(),
    address: z.string(),
    telephone: z.string(),
    email: z.string().email(),
    amount: z.number().nullable(),
    status: z.string(),
});

type RegisterParticipant = Omit<Participant, "groupId" | "participantId">;

export default function RegisterParticipant() {
    const [searchParams] = useSearchParams();
    const client = useQueryClient();

    const mutation = useMutation(async (values: RegisterParticipant) => {
        const participants = await localforage.getItem<Participant[]>("participants");

        if (!participants) {
            return localforage.setItem("participants", [
                { ...values, groupId: 1, participantId: 0 },
            ]);
        }

        const registeredParticipant = participants[participants.length - 1];
        const calculatedGroupId = registeredParticipant.groupId + 1;
        const newGroupId = calculatedGroupId === 11 ? 1 : calculatedGroupId;
        const participantData: Participant = {
            ...form.values,
            groupId: newGroupId,
            participantId: registeredParticipant.participantId + 1,
        };
        return localforage.setItem("participants", participants.concat(participantData));
    });

    const form = useFormik({
        initialValues: {
            name: "",
            age: 18,
            address: "",
            telephone: "",
            email: "",
            amount: 0,
            status: "partial" as Participant["status"],
        } satisfies RegisterParticipant,
        validationSchema: toFormikValidationSchema(validationSchema),
        async onSubmit(values, formikHelpers) {
            if (values.amount < REGISTRATION_FEE && values.status === "full") {
                return formikHelpers.setFieldError(
                    "status",
                    "Should not choose full payment when participant hasn't paid the full amount",
                );
            }

            mutation.mutate(values, {
                onSuccess() {
                    client.invalidateQueries([PARTICIPANTS_STORAGE_KEY]);
                    formikHelpers.resetForm();
                },
            });
        },
    });

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
            <div className="flex min-w-[80%] items-center overflow-hidden rounded-md border border-solid border-dark-500 shadow-2xl">
                <div className="flex h-full basis-4/12 items-center justify-center bg-[#f8f8f8]">
                    <img src={DesignerGirl} alt="illustration" className="w-60" />
                </div>
                <form
                    className="flex h-full basis-8/12 flex-col justify-center gap-4 bg-white p-20"
                    onSubmit={form.handleSubmit}
                >
                    <header className="flex items-center gap-4 pb-4">
                        {searchParams.get("redirect") ? (
                            <Link to={`/${searchParams.get("redirect")}`}>
                                <span className="icon-[heroicons--chevron-left] text-xl"></span>
                            </Link>
                        ) : null}
                        <div>
                            <h1 className="text-2xl font-semibold text-dark-500">
                                Participant Registration Form
                            </h1>
                            <p className="text-sm text-dark">
                                Enter the participant&apos;s information to register for the
                                conference
                            </p>
                        </div>
                    </header>
                    <div className="flex items-center gap-4">
                        <TextField
                            placeholder="John"
                            label="Name"
                            required
                            value={form.values.name}
                            onChange={form.handleChange}
                            name="name"
                        />
                        <TextField
                            placeholder="Age"
                            label="Age"
                            required
                            value={form.values.age}
                            onChange={form.handleChange}
                            name="age"
                            type="number"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <TextField
                            placeholder="(472) 765-3654"
                            label="Mobile number"
                            required
                            value={form.values.telephone}
                            onChange={form.handleChange}
                            name="telephone"
                        />
                        <TextField
                            placeholder="Email"
                            label="Email Address"
                            value={form.values.email}
                            onChange={form.handleChange}
                            name="email"
                        />
                    </div>
                    <div>
                        <TextField
                            placeholder="Address"
                            label="Home Address"
                            required
                            value={form.values.address}
                            onChange={form.handleChange}
                            name="address"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <TextField
                            placeholder="Amount"
                            label="Amount"
                            value={form.values.amount}
                            onChange={form.handleChange}
                            name="amount"
                            min={0}
                            type="number"
                        />
                        <SelectField
                            name="status"
                            value={form.values.status}
                            onChange={form.handleChange}
                            label="Status"
                            required
                            error={form.errors.status}
                        >
                            <option value="full">Full Payment</option>
                            <option value="partial">Partial Payment</option>
                            <option value="pledge">Pledge</option>
                        </SelectField>
                    </div>
                    <div className="pt-4 text-right">
                        <Button type="submit">Register</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
