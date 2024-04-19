import { useItem } from "../services/hooks";
import { Pool, poolStorage } from "../services/pools";

export const usePool = (key: string): Pool | undefined =>
  useItem<string, Pool>(poolStorage, key);
