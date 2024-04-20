import { useState } from "react";
import { eventStorage } from "../services/events";
import { useNavigate } from "react-router";
import { useCrudStorage } from "../services/hooks";
import { Button, Container, TextField } from "@mui/material";

export const NewEventPage = () => {
  const { createItem } = useCrudStorage(eventStorage);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = name.toLocaleLowerCase().replace(/\s+/, "-");
    await createItem({ id, name });
    navigate("/events");
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {/* <label htmlFor={"key"}>Key</label>
      <input
        type={"text"}
        name={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      /> */}
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
