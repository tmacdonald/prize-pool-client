import { LocalStorage } from "./CrudStorage";

export interface Identifiable {
  id: string;
}

export interface Pool extends Identifiable{
  name: string;
}

class PoolStorage extends LocalStorage<Pool> {}

const poolStorage = new PoolStorage('pools');

export { poolStorage }