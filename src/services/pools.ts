import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Pool extends Identifiable {
  name: string;
}

class PoolStorage extends LocalStorage<Pool> {}

const poolStorage = new PoolStorage('pools');

export { poolStorage }