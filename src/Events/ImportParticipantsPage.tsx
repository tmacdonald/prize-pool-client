import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Ballot } from "../services/BallotStorage";
import { useParticipantStorage } from "./hooks";

export const ImportParticipantsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { createParticipants } = useParticipantStorage(eventId!);
  const [data, setData] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ballots = JSON.parse(data) as Ballot[];

    await createParticipants(...ballots);
    navigate(`/events/${eventId}/participants`);
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
