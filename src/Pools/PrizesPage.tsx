import { useParams } from "react-router";
import { Prizes } from "./Prizes";

export const PrizesPage = () => {
  const { poolId } = useParams();

  return <Prizes poolId={poolId!} />;
};
