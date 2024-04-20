import { useParams } from "react-router";
import { Ballots } from "./Ballots";

export const BallotsPage = () => {
  const { eventId } = useParams();

  return <Ballots eventId={eventId!} />;
};
