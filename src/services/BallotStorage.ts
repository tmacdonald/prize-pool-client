import { SimpleStorage, SimpleLocalStorage } from "./CrudStorage";

export interface Ballot {
  participantId: string;
  prizeId: number;
  ticketId: number;
  name: string;
  group?: string;

  restrictions?: string[];
}

const createSetKey = (ballot: Ballot): string =>
  `${ballot.participantId}:${ballot.ticketId}`;

class ProxySimpleCrudStorage<T> implements SimpleStorage<T> {
  constructor(private internalStorage: SimpleStorage<T>) {}

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

class BallotStorage extends ValidatingSimpleCrudStorage<Ballot> {
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

const getBallotStorage = (eventId: string) => {
  const internalStorage = new SimpleLocalStorage<Ballot>(`${eventId}:ballots`);
  return new BallotStorage(internalStorage);
};

export { BallotStorage, getBallotStorage };
