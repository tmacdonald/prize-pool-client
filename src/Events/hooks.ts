import { useMemo } from "react";
import {
  UseItemResult,
  useCrudStorage,
  useItem,
  useSimpleCrudStorage,
} from "../services/hooks";
import { Event, eventStorage } from "../services/EventStorage";
import { getPrizeStorage } from "../services/PrizeStorage";
import { getMatchStorage } from "../services/MatchStorage";
import {
  getBallotStorage,
  getDelegatedBallotStorage,
} from "../services/BallotStorage";
import beep from "../assets/654321__gronkjaer__correctch_new.mp3";
import { getParticipantStorage } from "../services/ParticipantStorage";

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
    deleteItem: deletePrize,
    deleteAllItems: deleteAllPrizes,
  } = useCrudStorage(prizeStorage);

  return { prizes, createPrizes, updatePrize, deletePrize, deleteAllPrizes };
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

export const useDelegatedBallotStorage = () => {
  const ballotStorage = useMemo(() => getDelegatedBallotStorage(), []);
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
    deleteItem: deleteMatch,
    deleteAllItems: deleteAllMatches,
  } = useCrudStorage(matchStorage);

  return { matches, createMatches, deleteMatch, deleteAllMatches };
};

export const useParticipantStorage = (eventId: string) => {
  const participantStorage = useMemo(
    () => getParticipantStorage(eventId),
    [eventId]
  );
  const {
    items: participants,
    createItem: createParticipants,
    deleteAllItems: deleteAllParticipants,
  } = useSimpleCrudStorage(participantStorage);

  return { participants, createParticipants, deleteAllParticipants };
};

export const useBeep = () => {
  const audio = useMemo(() => new Audio(beep), []);
  return () => audio.play();
};
