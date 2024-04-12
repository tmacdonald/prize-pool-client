import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Ballot extends Identifiable {
  participantId: number;
  prizeId: number;
  ticketId: string;
  // not sure if these belong here
  name: string;
  group: string;
}

class BallotStorage extends LocalStorage<Ballot> {}

const getBallotStorage = (poolId: string) => {
  return new BallotStorage(`${poolId}:ballots`);
}

export { getBallotStorage }