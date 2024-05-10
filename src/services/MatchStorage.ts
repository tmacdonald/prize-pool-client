import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Match extends Identifiable<string> {
  participantId: string;
  prizeId: string;
  name: string;
  group?: string;
  basedOnPreference: boolean;
}

const getMatchStorage = (eventId: string) => {
  return new LocalStorage<string, Match>(`${eventId}:matches`);
};

export { getMatchStorage };
