import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { REGISTRATION_FEE } from "../../../../shared/constants";
import { prisma } from "../../../../shared/db";

export default async function EditParticipantPage({ params }: { params?: { id?: string } }) {
    const participant = await prisma.participant.findFirst({ where: { id: Number(params?.id) } });
    return (
        <form
            action={async (formData) => {
                "use server";

                const validationSchema = z.object({
                    name: z.string(),
                    age: z.number(),
                    address: z.string(),
                    telephone: z.string(),
                    email: z.string().email(),
                    amount: z.number(),
                    status: z.string(),
                    groupId: z.number().max(10).min(1),
                });

                const values = validationSchema.parse({
                    name: formData.get("name"),
                    age: formData.get("age"),
                    address: formData.get("address"),
                    telephone: formData.get("telephone"),
                    email: formData.get("email"),
                    amount: formData.get("amount"),
                    status: formData.get("status"),
                    groupId: formData.get("groupId"),
                });

                if (values.amount < REGISTRATION_FEE && values.status === "full")
                    throw new Error(
                        "Should not choose full payment when participant hasn't paid the full amount",
                    );

                await prisma.participant.update({
                    data: values,
                    where: { id: Number(formData.get("id")) },
                });

                revalidatePath("/dashboard/participants");
                revalidatePath(`/dashboard/participants/${formData.get("id")}`);
                redirect(`/dashboard/participants/${formData.get("id")}`);
            }}
        >
            <input type="hidden" name="id" value={params?.id} />
            <div>
                <label htmlFor="name">
                    Name* <br />
                    <input
                        defaultValue={participant?.name}
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
                        defaultValue={participant?.age}
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
                        defaultValue={participant?.address}
                        required
                        id="address"
                    ></textarea>
                </label>
            </div>
            <div>
                <label htmlFor="telephone">
                    Telephone* <br />
                    <input
                        type="text"
                        name="telephone"
                        id="telephone"
                        required
                        defaultValue={participant?.telephone}
                    />
                </label>
            </div>
            <div>
                <label htmlFor="email">
                    Email <br />
                    <input type="email" name="email" id="email" defaultValue={participant?.email} />
                </label>
            </div>
            <div>
                <label htmlFor="amount">
                    Amount <br />
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        defaultValue={participant?.amount}
                        min={0}
                    />
                </label>
            </div>
            <div>
                <label htmlFor="groupId">
                    Assigned Group* <br />
                    <input
                        required
                        type="number"
                        name="groupId"
                        id="groupId"
                        defaultValue={participant?.groupId}
                        min={1}
                        max={10}
                        step={1}
                    />
                    {/* {form.errors.groupId ? <small>{form.errors.groupId}</small> : null} */}
                </label>
            </div>
            <div>
                <label htmlFor="status">
                    Status* <br />
                    <select name="status" id="status" required defaultValue={participant?.status}>
                        <option value="full">Full Payment</option>
                        <option value="partial">Partial Payment</option>
                        <option value="pledge">Pledge</option>
                    </select>
                    {/* {form.errors.status ? <small>{form.errors.status}</small> : null} */}
                </label>
            </div>
            <div>
                <button type="submit">Register</button>
            </div>
        </form>
    );
}
