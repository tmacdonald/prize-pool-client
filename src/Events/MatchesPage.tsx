import { useParams } from "react-router";
import { Matches } from "./Matches";
import { GroupedMatches } from "./GroupedMatches";

export const MatchesPage = () => {
  const { eventId } = useParams();

  // return <Matches eventId={eventId!} />;
  return <GroupedMatches eventId={eventId!} />;
};
