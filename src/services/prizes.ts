import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Prize extends Identifiable<number> {
  freeFromRestrictions?: string[];
}

class PrizeStorage extends LocalStorage<number, Prize> {}

const getPrizeStorage = (poolId: string) => {
  return new PrizeStorage(`${poolId}:prizes`);
}

export { getPrizeStorage };
