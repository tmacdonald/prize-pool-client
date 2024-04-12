import { useEffect, useState } from "react";
import { CrudStorage, Identifiable } from "./CrudStorage";

export function useList<T extends Identifiable>(storage: CrudStorage<string, T>): T[] {
  const { items } = useCrudStorage(storage);
  return items;
}

export function useItem<T extends Identifiable>(storage: CrudStorage<string, T>, key: string): T | undefined {
  const [item, setItem] = useState<T | undefined>(undefined);

  useEffect(() => {
    const retrieveItem = async () => {
      const retrievedItem = await storage.get(key);
      setItem(retrievedItem);
    }
    retrieveItem();
  }, [key]);
  

  return item;
}

interface UseCrudStorageResult<T extends Identifiable> {
  items: T[];
  createItem: (newItem: T | T[]) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
  deleteAllItems: () => Promise<void>;
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

  const createItem = async (newItem: T | T[]) => {
    await storage.create(newItem);
    await retrieveItems();
  }

  const deleteItem = async(key: string) => {
    await storage.delete(key);
    await retrieveItems();
  }

  const deleteAllItems = async() => {
    await storage.deleteAll();
    await retrieveItems();
  }

  return { items, createItem, deleteItem, deleteAllItems };
}