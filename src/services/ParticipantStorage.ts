import { SimpleLocalStorage } from "./CrudStorage";

export interface Participant {
  name: string;
  group?: string;

  restrictions?: string[];
}

const getParticipantStorage = (eventId: string) => {
  return new SimpleLocalStorage<Participant>(`${eventId}:participants`);
};

export { getParticipantStorage };
