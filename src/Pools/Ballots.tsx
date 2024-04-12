import { useMemo } from "react";
import { Ballot, getBallotStorage } from "../services/ballots";
import { useCrudStorage } from "../services/hooks";

interface BallotsProps {
  poolId: string;
}

export const Ballots = ({ poolId }: BallotsProps) => {
  const ballotStorage = useMemo(() => getBallotStorage(poolId), [poolId]);
  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useCrudStorage(ballotStorage);

  const handleAddBallots = () => {
    const newBallots = new Array(5).fill(0).map((_, i) => {
      const ballot: Ballot = {
        id: `${i + 1}`,
        participantId: 1,
        ticketId: i + 1,
        prizeId: 1,
        name: "Tim",
        group: "EF2A",
      };
      return ballot;
    });

    createBallots(newBallots);
  };

  const handleRemoveAllBallots = () => {
    deleteAllBallots();
  };

  return (
    <>
      <ul>
        {ballots.map((ballot) => (
          <li key={ballot.id}>{ballot.participantId}</li>
        ))}
      </ul>
      <button onClick={handleAddBallots}>Add some ballots</button>
      <button onClick={handleRemoveAllBallots}>Remove all ballots</button>
    </>
  );
};
