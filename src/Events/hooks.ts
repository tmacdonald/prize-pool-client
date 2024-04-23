import { useMemo } from "react";
import {
  UseItemResult,
  useCrudStorage,
  useItem,
  useSimpleCrudStorage,
} from "../services/hooks";
import { Event, eventStorage } from "../services/events";
import { getPrizeStorage } from "../services/prizes";
import { getMatchStorage } from "../services/MatchStorage";
import { getBallotStorage } from "../services/BallotStorage";

export const useEvent = (key: string): UseItemResult<Event> =>
  useItem<string, Event>(eventStorage, key);

export const saveEvent = (key: string, event: Event): Promise<void> =>
  eventStorage.update(key, event);

export const usePrizeStorage = (eventId: string) => {
  const prizeStorage = useMemo(() => getPrizeStorage(eventId!), [eventId]);
  const {
    items: prizes,
    createItem: createPrizes,
    updateItem: updatePrize,
    deleteAllItems: deleteAllPrizes,
  } = useCrudStorage(prizeStorage);

  return { prizes, createPrizes, updatePrize, deleteAllPrizes };
};

export const useBallotStorage = (eventId: string) => {
  const ballotStorage = useMemo(() => getBallotStorage(eventId), [eventId]);
  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useSimpleCrudStorage(ballotStorage);

  return { ballots, createBallots, deleteAllBallots };
};

export const useMatchStorage = (eventId: string) => {
  const matchStorage = useMemo(() => getMatchStorage(eventId), [eventId]);
  const {
    items: matches,
    createItem: createMatches,
    deleteAllItems: deleteAllMatches,
  } = useSimpleCrudStorage(matchStorage);

  return { matches, createMatches, deleteAllMatches };
};
