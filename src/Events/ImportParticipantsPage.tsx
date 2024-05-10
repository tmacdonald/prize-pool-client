import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useParticipantStorage } from "./hooks";
import { Participant } from "../services/ParticipantStorage";
import { reverse } from "lodash";

export const ImportParticipantsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { createParticipants } = useParticipantStorage(eventId!);
  const [data, setData] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const participants = JSON.parse(data) as Participant[];
    const modifiedParticipants = participants.map((p) => {
      return {
        ...p,
        name: reverse(p.name.split(",").map((s) => s.trim())).join(" "),
      };
    });

    await createParticipants(...modifiedParticipants);
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
