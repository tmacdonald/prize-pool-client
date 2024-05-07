import { useState } from "react";
import { eventStorage } from "../services/EventStorage";
import { useNavigate } from "react-router";
import { useCrudStorage } from "../services/hooks";
import { Button, Container, TextField } from "@mui/material";

export const NewEventPage = () => {
  const { createItem } = useCrudStorage(eventStorage);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = name.toLocaleLowerCase().replace(/\s+/g, "-");
    await createItem({ id, name });
    navigate("/events");
  };

  return (
    <Container>
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
