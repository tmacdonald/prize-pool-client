import { getList, setItem } from "./localStorage";
import { Identifiable } from "./pools";

export interface CrudStorage<Key, T extends Identifiable> {
  list: () => Promise<T[]>;
  get: (key: Key) => Promise<T | undefined>;
  create: (item: T) => Promise<void>;
  update: (key: Key, item: T) => Promise<void>;
  delete: (key: Key) => Promise<void>;
}
export class LocalStorage<T extends Identifiable> implements CrudStorage<string, T> {
  constructor(private storageKey: string) { }

  list() {
    return Promise.resolve(getList<T>(this.storageKey));
  }

  async get(key: string) {
    const items = await this.list();
    return items.find(item => item.id === key);
  }

  async create(item: T) {
    const items = await this.list();
    const updatedItems = [...items, item];
    setItem(this.storageKey, updatedItems);
  }

  async update(key: string, item: T) {
    const items = await this.list();
    const itemIndex = items.findIndex(item => item.id === key);
    items[itemIndex] = item;
    setItem(this.storageKey, items);
  }

  async delete(key: string) {
    const items = await this.list();
    const itemIndex = items.findIndex(item => item.id === key);
    const updatedItems = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)];
    setItem(this.storageKey, updatedItems);
  }
}
