import localforage from "localforage";
import { PARTICIPANTS_STORAGE_KEY } from "../shared/constants";
import { Participant } from "../types";

export async function deleteParticipant(participantId: number) {
    const participants = await localforage.getItem<Participant[]>(PARTICIPANTS_STORAGE_KEY);
    if (!participants) return true;
    const filteredParticipants = participants.filter(
        (participant) => participant.participantId !== participantId,
    );
    return localforage.setItem(PARTICIPANTS_STORAGE_KEY, filteredParticipants);
}
