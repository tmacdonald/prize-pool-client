import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Prize extends Identifiable<string> {
  freeFromRestrictions?: string[];
}

class PrizeStorage extends LocalStorage<string, Prize> {}

const getPrizeStorage = (eventId: string) => {
  return new PrizeStorage(`${eventId}:prizes`);
};

export { getPrizeStorage };
