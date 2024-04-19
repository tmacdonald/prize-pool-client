import { useMemo } from "react";
import { getMatchStorage } from "../services/MatchStorage";
import { useSimpleCrudStorage } from "../services/hooks";

interface MatchesProps {
  poolId: string;
}

export const Matches = ({ poolId }: MatchesProps) => {
  const matchStorage = useMemo(() => getMatchStorage(poolId), [poolId]);
  const { items: matches } = useSimpleCrudStorage(matchStorage);

  if (matches.length === 0) {
    return <div>No matches</div>;
  }

  return (
    <>
      <ul>
        {matches.map((match, i) => (
          <li key={i}>{match.participantId}</li>
        ))}
      </ul>
    </>
  );
};
