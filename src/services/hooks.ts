import { useEffect, useState } from "react";
import { CrudStorage } from "./CrudStorage";
import { Identifiable } from "./pools";

export function useList<T extends Identifiable>(storage: CrudStorage<string, T>): T[] {
  const { items } = useCrudStorage(storage);
  return items;
}

interface UseCrudStorageResult<T extends Identifiable> {
  items: T[];
  createItem: (newItem: T) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}

export function useCrudStorage<T extends Identifiable>(storage: CrudStorage<string, T>): UseCrudStorageResult<T> {
  const [items, setItems] = useState<T[]>([]);

  const retrieveItems = async () => {
    const retrievedItems = await storage.list();
    setItems(retrievedItems);
  }

  useEffect(() => {
    retrieveItems();
  }, []);

  const createItem = async (newItem: T) => {
    await storage.create(newItem);
    await retrieveItems();
  }

  const deleteItem = async(key: string) => {
    await storage.delete(key);
    await retrieveItems();
  }

  return { items, createItem, deleteItem };
}