import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Prize extends Identifiable {
  freeFromRestrictions?: string[];
}

class PrizeStorage extends LocalStorage<Prize> {}

const getPrizeStorage = (poolId: string) => {
  return new PrizeStorage(`${poolId}:prizes`);
}

export { getPrizeStorage }