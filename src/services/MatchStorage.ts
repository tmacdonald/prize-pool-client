import { SimpleLocalStorage } from "./CrudStorage";

export interface Match {
  participantId: string;
  prizeId: number;
  name: string;
  group?: string;
  basedOnPreference: boolean;
}

const getMatchStorage = (eventId: string) => {
  return new SimpleLocalStorage<Match>(`${eventId}:matches`);
};

export { getMatchStorage };
