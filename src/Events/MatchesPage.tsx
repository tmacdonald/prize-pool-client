import { useParams } from "react-router";
import { Matches } from "./Matches";
import { Container, FormControlLabel, Switch } from "@mui/material";
import { GroupedMatches } from "./GroupedMatches";
import { useState } from "react";

export const MatchesPage = () => {
  const { eventId } = useParams();
  const [grouped, setGrouped] = useState(false);
  const [unmatched, setUnmatched] = useState(false);

  return (
    <Container>
      <FormControlLabel
        control={
          <Switch
            value={grouped}
            onChange={(_e, checked) => setGrouped(checked)}
          />
        }
        label="Grouped"
      />
      <FormControlLabel
        control={
          <Switch
            value={unmatched}
            onChange={(_e, checked) => setUnmatched(checked)}
          />
        }
        label="Unmatched"
      />
      {!grouped && <Matches eventId={eventId!} showOnlyUnmatched={unmatched} />}
      {grouped && (
        <GroupedMatches eventId={eventId!} showOnlyUnmatched={unmatched} />
      )}
    </Container>
  );

  return <Matches eventId={eventId!} />;
};
