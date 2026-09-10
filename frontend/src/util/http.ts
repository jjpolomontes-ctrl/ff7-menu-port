interface PartyMember {
    id: number;
    name: string;
    level: number;
    limit_level: number;
    age_epoch: number;
    hp: number;
    mp: number;
    image_path: string;
}

const ENDPOINT_URL = "http://localhost:5000";

export async function fetchPartyMember({ signal, memberId }: { signal: AbortSignal, memberId: number }): Promise<PartyMember> {
    const response = await fetch(`${ENDPOINT_URL}/partymember/${memberId}`, { signal });
    if (!response.ok) throw new Error("An error occurred while fetching party Member");
    return await response.json();
}
