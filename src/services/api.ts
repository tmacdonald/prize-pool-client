const serverUrl = import.meta.env.VITE_SERVER_URL;

export interface Ballot extends Ticket {
  prizeId: number;
}

export interface Ticket {
  participantId: number;
  ticketId: number;
}

export function submitBallot(prizeId: number, ticket: Ticket) {
  fetch(`${serverUrl}/api/v1/pools/sps-cake-walk/ballots`, { method: 'POST', headers: { 'Content-Type': 'application/json' },  body: JSON.stringify({ prizeId, ...ticket })});
}

export async function getBallots(): Promise<Ballot[]> {
  const response = await fetch(`${serverUrl}/api/v1/pools/sps-cake-walk/ballots`)
  const ballots = await response.json() as Ballot[];
  return ballots;
}

export async function createMatches() {
  const response = await fetch(`${serverUrl}/api/v1/pools/sps-cake-walk`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'sps-cake-walk', numPrizes: 10, areMatchesSet: true })});
  const pool = await response.json();
  console.log(pool);
  return pool;
}