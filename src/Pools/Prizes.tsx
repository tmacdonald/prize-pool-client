import { useMemo } from "react";
import { useCrudStorage } from "../services/hooks";
import { Prize, getPrizeStorage } from "../services/prizes";
import { usePrizeStorage } from "./hooks";

interface PrizesProps {
  poolId: string;
}

const combinations = (array: string[]): string[][] => {
  return array.reduce<string[][]>(
    (acc, curr) => [...acc, ...acc.map((r) => [...r, curr])],
    [[]]
  );
};

const numPrizes = 100;

export const Prizes = ({ poolId }: PrizesProps) => {
  const { prizes, createPrizes, deleteAllPrizes } = usePrizeStorage(poolId!);

  const handleAddPrizes = () => {
    const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];
    const restrictionCombinations = combinations(possibleRestrictions);

    const newPrizes = new Array(numPrizes).fill(0).map((x, i) => {
      const freeFromRestrictions =
        Math.random() < 0.2
          ? restrictionCombinations[
              Math.floor(Math.random() * restrictionCombinations.length)
            ]
          : undefined;
      return {
        id: i + 1,
        freeFromRestrictions,
      };
    });

    createPrizes(...newPrizes);
  };

  const handleRemoveAllPrizes = () => {
    deleteAllPrizes();
  };

  return (
    <>
      <ul>
        {prizes.map((prize) => (
          <li key={prize.id}>
            {prize.id}
            {prize.freeFromRestrictions?.join(",")}
          </li>
        ))}
      </ul>
      <button onClick={handleAddPrizes}>Add some prizes</button>
      <button onClick={handleRemoveAllPrizes}>Remove all prizes</button>
    </>
  );
};
