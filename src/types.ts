export interface Participant {
	name: string;
	age: number;
	address: string;
	telephone: string;
	email: string;
	amount: number;
	status: 'partial' | 'full' | 'pledge';
	groupId: number;
	participantId: number;
}
