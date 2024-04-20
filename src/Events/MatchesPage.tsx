import { useParams } from "react-router";
import { Matches } from "./Matches";

export const MatchesPage = () => {
  const { eventId } = useParams();

  return <Matches eventId={eventId!} />;
};
