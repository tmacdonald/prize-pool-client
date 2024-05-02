import { useParams } from "react-router";
import { Prizes } from "./Prizes";

export const PrizesPage = () => {
  const { eventId } = useParams();

  return <Prizes eventId={eventId!} />;
};
