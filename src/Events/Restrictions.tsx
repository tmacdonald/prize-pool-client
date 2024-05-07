import { Box, Button, Chip, Container, TextField } from "@mui/material";
import { useState } from "react";
import { Event } from "../services/EventStorage";
import { saveEvent, useEvent } from "./hooks";

interface RestrictionsProps {
  eventId: string;
}

export const Restrictions = ({ eventId }: RestrictionsProps) => {
  const [name, setName] = useState<string>("");
  const { item: event, refetch } = useEvent(eventId);

  const restrictions = event?.availableRestrictions ?? [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEvent: Event = {
      ...event!,
      availableRestrictions: [...restrictions, name],
    };

    setName("");

    await saveEvent(eventId, newEvent);
    refetch();
  };

  const handleDelete = async (index: number) => {
    const newRestrictions = [
      ...restrictions.slice(0, index),
      ...restrictions.slice(index + 1),
    ];
    const newEvent: Event = {
      ...event!,
      availableRestrictions: newRestrictions,
    };

    await saveEvent(eventId, newEvent);
    refetch();
  };

  return (
    <Container>
      <Box sx={{ padding: "10px" }}>
        {restrictions.map((restriction, i) => (
          <Chip
            key={restriction}
            label={restriction}
            onDelete={() => handleDelete(i)}
          />
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </form>
    </Container>
  );
};
