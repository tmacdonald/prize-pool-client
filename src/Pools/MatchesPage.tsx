import { useParams } from "react-router";
import { Matches } from "./Matches";

export const MatchesPage = () => {
  const { poolId } = useParams();

  return <Matches poolId={poolId!} />;
};
