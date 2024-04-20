import { SimpleLocalStorage } from "./CrudStorage";

export interface Match {
  participantId: number;
  prizeId: number;
}

const getMatchStorage = (eventId: string) => {
  return new SimpleLocalStorage<Match>(`${eventId}:matches`);
};

export { getMatchStorage };
