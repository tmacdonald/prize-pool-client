import { SimpleCrudStorage, SimpleLocalStorage } from "./CrudStorage";

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

class ProxySimpleCrudStorage<T> implements SimpleCrudStorage<T> {
  constructor(private internalStorage: SimpleCrudStorage<T>) {}

  list(): Promise<T[]> {
    return this.internalStorage.list();
  }

  create(...newItems: T[]): Promise<void> {
    return this.internalStorage.create(...newItems);
  }

  deleteAll(): Promise<void> {
    return this.internalStorage.deleteAll();
  }
}

class ValidatingSimpleCrudStorage<T> extends ProxySimpleCrudStorage<T> {
  async create(...newItems: T[]): Promise<void> {
    const existingItems = await this.list();
    if (this.validateOnCreate(existingItems, newItems)) {
      super.create(...newItems);
    }
  }

  protected validateOnCreate(_existingItems: T[], _newItems: T[]): boolean {
    return true;
  }
}

export class BallotStorage extends ValidatingSimpleCrudStorage<Ballot> {
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
  const internalStorage = new SimpleLocalStorage<Ballot>(`${poolId}:ballots`);
  return new BallotStorage(internalStorage);
};

export { getBallotStorage };
