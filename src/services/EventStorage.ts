import { Identifiable, LocalStorage } from "./CrudStorage";

export interface Event extends Identifiable<string> {
  name: string;
  availableRestrictions?: string[];
}

class EventStorage extends LocalStorage<string, Event> {}

const eventStorage = new EventStorage("events");

export { eventStorage };
