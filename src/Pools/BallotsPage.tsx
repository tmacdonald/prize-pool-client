import { useParams } from "react-router";
import { Ballots } from "./Ballots";

export const BallotsPage = () => {
  const { poolId } = useParams();

  return <Ballots poolId={poolId!} />;
};
