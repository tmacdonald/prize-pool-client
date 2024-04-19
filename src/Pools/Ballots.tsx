import { useMemo } from "react";
import { Ballot, getBallotStorage } from "../services/BallotStorage";
import { useCrudStorage, useSimpleCrudStorage } from "../services/hooks";
import { getPrizeStorage } from "../services/prizes";

interface BallotsProps {
  poolId: string;
}

const numParticipants = 100;
const numBallotsPerParticipant = 10;
const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];

export const Ballots = ({ poolId }: BallotsProps) => {
  const ballotStorage = useMemo(() => getBallotStorage(poolId), [poolId]);
  const prizeStorage = useMemo(() => getPrizeStorage(poolId!), [poolId]);

  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useSimpleCrudStorage(ballotStorage);

  const { items: prizes } = useCrudStorage(prizeStorage);

  const handleAddBallots = () => {
    const participants = new Array(numParticipants).fill(0).map((x, i) => {
      const restrictions =
        Math.random() < 0.2
          ? [
              possibleRestrictions[
                Math.floor(Math.random() * possibleRestrictions.length)
              ],
            ]
          : undefined;
      return {
        participantId: i + 1,
        name: `Participant ${i + 1}`,
        restrictions,
      };
    });

    const newBallots = participants.flatMap((participant) => {
      return new Array(numBallotsPerParticipant).fill(0).map((x, i) => {
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        return {
          prizeId: prize.id,
          ...participant,
          ticketId: i + 1,
        };
      });
    });

    createBallots(...newBallots);
  };

  const handleRemoveAllBallots = () => {
    deleteAllBallots();
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Prize</th>
            <th>Restrictions</th>
          </tr>
        </thead>
        <tbody>
          {ballots.map((ballot, i) => (
            <tr key={i}>
              <td>{ballot.name}</td>
              <td>{ballot.prizeId}</td>
              <td>{ballot.restrictions?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddBallots}>Add some ballots</button>
      <button onClick={handleRemoveAllBallots}>Remove all ballots</button>
    </>
  );
};
