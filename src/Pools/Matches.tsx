import { useMemo } from "react";
import { getMatchStorage } from "../services/MatchStorage";
import { useSimpleCrudStorage } from "../services/hooks";
import { useBallotStorage, useMatchStorage, usePrizeStorage } from "./hooks";
import { generateMatches } from "../services/match";

interface MatchesProps {
  poolId: string;
}

export const Matches = ({ poolId }: MatchesProps) => {
  const { prizes } = usePrizeStorage(poolId!);
  const { ballots } = useBallotStorage(poolId!);
  const { matches, createMatches } = useMatchStorage(poolId!);

  const handleCreateMatches = () => {
    const {
      matches: generatedMatches,
      remainingPrizes,
      remainingParticipants,
    } = generateMatches(prizes, ballots);

    createMatches(...generatedMatches);
  };

  if (matches.length === 0) {
    return (
      <div>
        No matches <button onClick={handleCreateMatches}>Create matches</button>
      </div>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Participant Id</th>
            <th>Prize</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, i) => (
            <tr key={i}>
              <td>{match.participantId}</td>
              <td>{match.prizeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
