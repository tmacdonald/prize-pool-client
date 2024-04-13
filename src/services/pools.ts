import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Pool extends Identifiable<string> {
  name: string;
  availableRestrictions?: string[];
}

class PoolStorage extends LocalStorage<string, Pool> {}

const poolStorage = new PoolStorage('pools');

export { poolStorage }