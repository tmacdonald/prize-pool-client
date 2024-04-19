import { useMemo } from "react";
import {
  useCrudStorage,
  useItem,
  useSimpleCrudStorage,
} from "../services/hooks";
import { Pool, poolStorage } from "../services/pools";
import { getPrizeStorage } from "../services/prizes";
import { getMatchStorage } from "../services/MatchStorage";
import { getBallotStorage } from "../services/BallotStorage";

export const usePool = (key: string): Pool | undefined =>
  useItem<string, Pool>(poolStorage, key);

export const usePrizeStorage = (poolId: string) => {
  const prizeStorage = useMemo(() => getPrizeStorage(poolId!), [poolId]);
  const {
    items: prizes,
    createItem: createPrizes,
    deleteAllItems: deleteAllPrizes,
  } = useCrudStorage(prizeStorage);

  return { prizes, createPrizes, deleteAllPrizes };
};

export const useBallotStorage = (poolId: string) => {
  const ballotStorage = useMemo(() => getBallotStorage(poolId), [poolId]);
  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useSimpleCrudStorage(ballotStorage);

  return { ballots, createBallots, deleteAllBallots };
};

export const useMatchStorage = (poolId: string) => {
  const matchStorage = useMemo(() => getMatchStorage(poolId), [poolId]);
  const {
    items: matches,
    createItem: createMatches,
    deleteAllItems: deleteAllMatches,
  } = useSimpleCrudStorage(matchStorage);

  return { matches, createMatches, deleteAllMatches };
};
