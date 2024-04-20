import { useEffect, useState } from "react";
import { CrudStorage, Identifiable, SimpleStorage } from "./CrudStorage";

export function useList<T>(storage: SimpleStorage<T>): T[] {
  const { items } = useSimpleCrudStorage<T>(storage);
  return items;
}

export function useItem<K, T extends Identifiable<K>>(
  storage: CrudStorage<K, T>,
  key: K
): T | undefined {
  const [item, setItem] = useState<T | undefined>(undefined);

  useEffect(() => {
    const retrieveItem = async () => {
      const retrievedItem = await storage.get(key);
      setItem(retrievedItem);
    };
    retrieveItem();
  }, [key]);

  return item;
}

interface UseSimpleCrudStorageResult<T> {
  items: T[];
  createItem: (...newItems: T[]) => Promise<void>;
  deleteAllItems: () => Promise<void>;
  retrieveItems: () => Promise<void>;
}

export function useSimpleCrudStorage<T>(
  storage: SimpleStorage<T>
): UseSimpleCrudStorageResult<T> {
  const [items, setItems] = useState<T[]>([]);

  const retrieveItems = async () => {
    const retrievedItems = await storage.list();
    setItems(retrievedItems);
  };

  useEffect(() => {
    retrieveItems();
  }, []);

  const createItem = async (...newItems: T[]) => {
    await storage.create(...newItems);
    await retrieveItems();
  };

  const deleteAllItems = async () => {
    await storage.deleteAll();
    await retrieveItems();
  };

  return { items, createItem, deleteAllItems, retrieveItems };
}

interface UseCrudStorageResult<K, T extends Identifiable<K>>
  extends UseSimpleCrudStorageResult<T> {
  updateItem: (key: K, item: T) => Promise<void>;
  deleteItem: (key: K) => Promise<void>;
}

export function useCrudStorage<K, T extends Identifiable<K>>(
  storage: CrudStorage<K, T>
): UseCrudStorageResult<K, T> {
  const { items, createItem, deleteAllItems, retrieveItems } =
    useSimpleCrudStorage<T>(storage);

  const deleteItem = async (key: K) => {
    await storage.delete(key);
    await retrieveItems();
  };

  const updateItem = async (key: K, item: T) => {
    await storage.update(key, item);
    await retrieveItems();
  };

  return {
    items,
    createItem,
    deleteItem,
    updateItem,
    deleteAllItems,
    retrieveItems,
  };
}
