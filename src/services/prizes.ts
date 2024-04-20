import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Prize extends Identifiable<number> {
  freeFromRestrictions?: string[];
}

class PrizeStorage extends LocalStorage<number, Prize> {}

const getPrizeStorage = (eventId: string) => {
  return new PrizeStorage(`${eventId}:prizes`);
};

export { getPrizeStorage };
