import { SimpleLocalStorage } from "./CrudStorage";

export interface Ballot {
  participantId: number;
  prizeId: number;
  ticketId: number;
  // not sure if these belong here
  name: string;
  group: string;
}

class BallotStorage extends SimpleLocalStorage<Ballot> {}

const getBallotStorage = (poolId: string) => {
  return new BallotStorage(`${poolId}:ballots`);
}

export { getBallotStorage }