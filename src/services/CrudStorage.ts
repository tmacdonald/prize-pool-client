import { getList, removeItem, setItem } from "./localStorage";

export interface Identifiable<K> {
  id: K;
}

export interface SimpleStorage<T> {
  list: () => Promise<T[]>;
  create: (...newItems: T[]) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export interface CrudStorage<K, T extends Identifiable<K>>
  extends SimpleStorage<T> {
  get: (key: K) => Promise<T | undefined>;
  update: (key: K, item: T) => Promise<void>;
  delete: (key: K) => Promise<void>;
}

export class SimpleLocalStorage<T> implements SimpleStorage<T> {
  constructor(protected storageKey: string) {}

  list() {
    return Promise.resolve(getList<T>(this.storageKey));
  }

  async create(...newItems: T[]) {
    const existingItems = await this.list();
    console.log(existingItems, newItems);
    const updatedItems = [...existingItems, ...newItems];
    setItem(this.storageKey, updatedItems);
  }

  async deleteAll() {
    removeItem(this.storageKey);
  }
}

// TODO Consider beforeCreate and afterCreate
export class SimpleInMemoryStorage<T> implements SimpleStorage<T> {
  constructor(protected storageKey: string) {}

  private internalList: T[] = [];

  list() {
    return Promise.resolve(this.internalList);
  }

  async create(...newItems: T[]) {
    const existingItems = await this.list();
    const updatedItems = [...existingItems, ...newItems];
    this.internalList = updatedItems;
  }

  async deleteAll() {
    this.internalList = [];
  }
}

export class LocalStorage<K, T extends Identifiable<K>>
  extends SimpleLocalStorage<T>
  implements CrudStorage<K, T>
{
  async get(key: K) {
    const items = await this.list();
    return items.find((item) => item.id === key);
  }

  async update(key: K, item: T) {
    const items = await this.list();
    const itemIndex = items.findIndex((item) => item.id === key);
    items[itemIndex] = item;
    setItem(this.storageKey, items);
  }

  async delete(key: K) {
    const items = await this.list();
    const itemIndex = items.findIndex((item) => item.id === key);
    const updatedItems = [
      ...items.slice(0, itemIndex),
      ...items.slice(itemIndex + 1),
    ];
    setItem(this.storageKey, updatedItems);
  }
}
