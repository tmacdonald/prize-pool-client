import { Button, Container, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Ballot, getBallotStorage } from "../services/BallotStorage";
import { useSimpleCrudStorage } from "../services/hooks";

export const ImportBallotsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const ballotStorage = useMemo(() => getBallotStorage(eventId!), [eventId]);
  const [data, setData] = useState<string>("");

  const { createItem: createBallots } = useSimpleCrudStorage(ballotStorage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ballots = JSON.parse(data) as Ballot[];

    await createBallots(...ballots);
    navigate(`/events/${eventId}/ballots`);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          id="data"
          label="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Button variant={"contained"} type={"submit"}>
          Import
        </Button>
      </form>
    </Container>
  );
};
