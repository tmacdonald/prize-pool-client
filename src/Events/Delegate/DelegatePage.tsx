import { useParams } from "react-router";
import { useEvent, usePrizeStorage } from "../hooks";
import { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

interface Range {
  start: number;
  end: number;
}

export const DelegatePage = () => {
  const { eventId } = useParams();
  const { item: event } = useEvent(eventId!);
  const { prizes } = usePrizeStorage(eventId!);

  const [numberOfDelegates, setNumberOfDelegates] = useState<number>(0);

  const [ranges, setRanges] = useState<Range[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quotient = Math.floor(prizes.length / numberOfDelegates);
    const remainder = prizes.length % numberOfDelegates;
    console.log(quotient, remainder);

    let newRanges: Range[] = [];
    let sum = 0;
    for (let i = 1; i <= numberOfDelegates; i++) {
      const amount = quotient + (i <= remainder ? 1 : 0);
      newRanges.push({ start: 1 + sum, end: sum + amount });
      sum += amount;
    }
    setRanges(newRanges);
  };

  if (!event) {
    return null;
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          id="numberOfDelegates"
          label="Number of delegates"
          value={numberOfDelegates}
          onChange={(e) => setNumberOfDelegates(parseInt(e.target.value, 10))}
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </form>

      {ranges.map(({ start, end }, i) => (
        <div>
          <h2>Team {i + 1}</h2>
          <QRCodeSVG
            size={128}
            value={`https://prize-pool.netlify.app/delegate/capture?start=${start}&end=${end}`}
          />
        </div>
      ))}
    </Container>
  );
};
