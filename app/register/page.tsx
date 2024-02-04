import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import Button from "../shared/components/Button";
import SelectField from "../shared/components/SelectField";
import TextField from "../shared/components/TextField";
import { REGISTRATION_FEE } from "../shared/constants";
import { prisma } from "../shared/db";

export default function Register({ searchParams }: { searchParams?: { redirect: string } }) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
            <div className="flex min-w-[80%] items-center overflow-hidden rounded-md border border-solid border-dark-500 shadow-2xl">
                <div className="flex h-full basis-4/12 items-center justify-center bg-[#f8f8f8]">
                    <Image
                        src="/undraw_designer_girl_re_h54c.svg"
                        alt="illustration"
                        className="w-60"
                    />
                </div>
                <form
                    className="flex h-full basis-8/12 flex-col justify-center gap-4 bg-white p-20"
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
                        });

                        const newParticipant = validationSchema.parse({
                            name: formData.get("name"),
                            age: formData.get("age"),
                            address: formData.get("address"),
                            telephone: formData.get("telephone"),
                            email: formData.get("email"),
                            amount: formData.get("amount"),
                            status: formData.get("status"),
                        });

                        if (
                            newParticipant.amount < REGISTRATION_FEE &&
                            newParticipant.status === "full"
                        ) {
                            throw new Error(
                                "Should not choose full payment when participant hasn't paid the full amount",
                            );
                        }

                        const participant = await prisma.participant.findFirst({
                            orderBy: { createdAt: "desc" },
                            take: 1,
                            select: { groupId: true },
                        });

                        const groupId = ((participant?.groupId ?? 0) + 1) % 11 || 1;

                        await prisma.participant.create({
                            data: { ...newParticipant, groupId },
                        });

                        revalidatePath("/dashboard/participants");
                    }}
                >
                    <header className="flex items-center gap-4 pb-4">
                        {searchParams?.redirect ? (
                            <Link href={`/${searchParams.redirect}`}>
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
                        <TextField placeholder="John" label="Name" required name="name" />
                        <TextField
                            placeholder="Age"
                            label="Age"
                            required
                            name="age"
                            type="number"
                            defaultValue={18}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <TextField
                            placeholder="(472) 765-3654"
                            label="Mobile number"
                            required
                            name="telephone"
                        />
                        <TextField placeholder="Email" label="Email Address" name="email" />
                    </div>
                    <div>
                        <TextField
                            placeholder="Address"
                            label="Home Address"
                            required
                            name="address"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <TextField
                            placeholder="Amount"
                            label="Amount"
                            name="amount"
                            min={0}
                            defaultValue={0}
                            type="number"
                        />
                        <SelectField defaultValue="partial" name="status" label="Status" required>
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
