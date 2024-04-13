import { useMemo } from "react";
import { useCrudStorage } from "../services/hooks";
import { Prize, getPrizeStorage } from "../services/prizes";

interface PrizesProps {
  poolId: string;
}

export const Prizes = ({ poolId }: PrizesProps) => {
  const prizeStorage = useMemo(() => getPrizeStorage(poolId!), [poolId]);
  const {
    items: prizes,
    createItem: createPrizes,
    deleteAllItems: deleteAllPrizes,
  } = useCrudStorage(prizeStorage);

  const handleAddPrizes = () => {
    const newPrizes = new Array(5).fill(0).map((_, i) => {
      const prize: Prize = {
        id: i + 1,
      };
      return prize;
    });

    createPrizes(newPrizes);
  };

  const handleRemoveAllPrizes = () => {
    deleteAllPrizes();
  };

  return (
    <>
      <ul>
        {prizes.map((prize) => (
          <li key={prize.id}>{prize.id}</li>
        ))}
      </ul>
      <button onClick={handleAddPrizes}>Add some prizes</button>
      <button onClick={handleRemoveAllPrizes}>Remove all prizes</button>
    </>
  );
};
