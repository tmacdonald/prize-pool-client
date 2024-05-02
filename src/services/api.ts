const serverUrl = import.meta.env.VITE_SERVER_URL;

export interface Ballot extends Ticket {
  prizeId: number;
}

export interface Ticket {
  childId: string;
  ticketId: number;
  name: string;
  group: string;
  restrictions?: string[];
}

export interface Match {
  poolId: string;
  prizeId: number;
  participantId: number;
  name: string;
  homeroom: string;
}

export function getBaseUrl() {
  return serverUrl;
}

export function submitBallot(prizeId: number, ticket: Ticket) {
  fetch(`${serverUrl}/api/v1/pools/sps-cake-walk/ballots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prizeId, ...ticket }),
  });
}

export async function getBallots(
  poolId: string,
  requestInfo: RequestInit = {}
): Promise<Ballot[]> {
  const response = await fetch(
    `${serverUrl}/api/v1/pools/${poolId}/ballots`,
    requestInfo
  );
  const ballots = (await response.json()) as Ballot[];
  return ballots;
}

export async function createMatches(poolId: string) {
  const response = await fetch(`${serverUrl}/api/v1/pools/${poolId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "sps-cake-walk",
      numPrizes: 10,
      areMatchesSet: true,
    }),
  });
  const pool = await response.json();
  return pool;
}

export async function getMatches(poolId: string) {
  const response = await fetch(`${serverUrl}/api/v1/pools/${poolId}/matches`);
  const matches = (await response.json()) as Match[];
  return matches;
}
