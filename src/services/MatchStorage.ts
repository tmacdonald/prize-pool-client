import { SimpleLocalStorage } from "./CrudStorage";

export interface Match {
  participantId: number;
  prizeId: number;
}

const getMatchStorage = (poolId: string) => {
  return new SimpleLocalStorage<Match>(`${poolId}:matches`);
};

export { getMatchStorage };
