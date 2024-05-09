import { Button, Container, TextField } from "@mui/material";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useBallotStorage } from "./hooks";
import { useState } from "react";
import { Ballot } from "../services/BallotStorage";
// import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

// type FilmOptionType = {
//   inputValue?: string;
//   title: string;
//   year: number;
// };

// const top100Films: readonly FilmOptionType[] = [
//   { title: "The Shawshank Redemption", year: 1994 },
//   { title: "The Godfather", year: 1972 },
//   { title: "The Godfather: Part II", year: 1974 },
//   { title: "The Dark Knight", year: 2008 },
//   { title: "12 Angry Men", year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: "Pulp Fiction", year: 1994 },
// ];

export const ManualBallotPage = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const prizeId = parseInt(searchParams.get("prizeId") ?? "0", 10);

  const { createBallots } = useBallotStorage(eventId!);

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const participantId = await digestMessage(`${name}/${group}`);

    const ballot: Ballot = {
      participantId,
      name,
      group,
      prizeId,
      ticketId: "1",
    };
    createBallots(ballot);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {/* <Autocomplete
          id="name"
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={name}
          onChange={(e, newValue) => {
            console.log(e, newValue);
          }}
          options={top100Films}
          freeSolo={true}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.title;
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          renderInput={(params) => <TextField {...params} label="Name" />}
        /> */}
        <TextField
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="group"
          label="Group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </form>
    </Container>
  );
};
