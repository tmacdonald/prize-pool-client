import { getList, removeItem, setItem } from "./localStorage";

export interface Identifiable<K> {
  id: K;
}

export interface SimpleCrudStorage<T> {
  list: () => Promise<T[]>;
  create: (item: T | T[]) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export interface CrudStorage<K, T extends Identifiable<K>> extends SimpleCrudStorage<T> {
  get: (key: K) => Promise<T | undefined>;
  update: (key: K, item: T) => Promise<void>;
  delete: (key: K) => Promise<void>;
}

export class SimpleLocalStorage<T> implements SimpleCrudStorage<T> {
  constructor(protected storageKey: string) { }
  
  list() {
    return Promise.resolve(getList<T>(this.storageKey));
  }

  async create(item: T | T[]) {
    const items = await this.list();
    const newItems = Array.isArray(item) ? item : [item];
    const updatedItems = [...items, ...newItems];
    setItem(this.storageKey, updatedItems);
  }

  async deleteAll() {
    removeItem(this.storageKey);
  }
}

export class LocalStorage<K, T extends Identifiable<K>> extends SimpleLocalStorage<T> implements CrudStorage<K, T> {
  async get(key: K) {
    const items = await this.list();
    return items.find(item => item.id === key);
  }

  async update(key: K, item: T) {
    const items = await this.list();
    const itemIndex = items.findIndex(item => item.id === key);
    items[itemIndex] = item;
    setItem(this.storageKey, items);
  }

  async delete(key: K) {
    const items = await this.list();
    const itemIndex = items.findIndex(item => item.id === key);
    const updatedItems = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)];
    setItem(this.storageKey, updatedItems);
  }
}
