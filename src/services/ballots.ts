import { SimpleLocalStorage } from "./CrudStorage";

export interface Ballot {
  participantId: number;
  prizeId: number;
  ticketId: number;
  // not sure if these belong here
  name: string;
  group: string;
}

const createSetKey = (ballot: Ballot): string =>
  `${ballot.participantId}:${ballot.ticketId}`;

class BallotStorage extends SimpleLocalStorage<Ballot> {
  protected validateOnCreate(
    newItems: Ballot[],
    existingItems: Ballot[]
  ): boolean {
    const set = new Set<string>(existingItems.map(createSetKey));
    for (let i = 0; i < newItems.length; i += 1) {
      const newItem = newItems[i];
      const key = createSetKey(newItem);
      if (set.has(key)) {
        return false;
      }
      set.add(key);
    }
    return true;
  }
}

const getBallotStorage = (poolId: string) => {
  return new BallotStorage(`${poolId}:ballots`);
};

export { getBallotStorage };
