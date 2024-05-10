import { useParams } from "react-router";
import { Matches } from "./Matches";
import { Container, Switch } from "@mui/material";
import { GroupedMatches } from "./GroupedMatches";
import { useState } from "react";

export const MatchesPage = () => {
  const { eventId } = useParams();
  const [grouped, setGrouped] = useState(false);

  return (
    <Container>
      <Switch value={grouped} onChange={(_e, checked) => setGrouped(checked)} />{" "}
      Grouped
      {!grouped && <Matches eventId={eventId!} />}
      {grouped && <GroupedMatches eventId={eventId!} />}
    </Container>
  );

  return <Matches eventId={eventId!} />;
};
