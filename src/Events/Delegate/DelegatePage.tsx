import { useParams } from "react-router";
import { useEvent, usePrizeStorage } from "../hooks";
import { useState } from "react";
import { Button, Container, Link, TextField } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";

const Root = styled(Container)`
  padding: 12px;
`;

const Ranges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-block-end: 12px;
`;

interface Range {
  start: number;
  end: number;
}

export const DelegatePage = () => {
  const { eventId } = useParams();
  const { item: event } = useEvent(eventId!);
  const { prizes } = usePrizeStorage(eventId!);

  const [numberOfDelegates, setNumberOfDelegates] = useState<
    string | undefined
  >(undefined);

  const [ranges, setRanges] = useState<Range[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedNumberOfDelegates = parseInt(numberOfDelegates ?? "0", 10);
    const quotient = Math.floor(prizes.length / parsedNumberOfDelegates);
    const remainder = prizes.length % parsedNumberOfDelegates;

    let newRanges: Range[] = [];
    let sum = 0;
    for (let i = 1; i <= parsedNumberOfDelegates; i++) {
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
    <Root>
      <Form onSubmit={handleSubmit}>
        <TextField
          id="numberOfDelegates"
          label="Number of teams"
          value={numberOfDelegates}
          onChange={(e) => setNumberOfDelegates(e.target.value)}
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </Form>

      <Link component={RouterLink} to="./capture">
        Capture from teams
      </Link>

      <Ranges>
        {ranges.map(({ start, end }, i) => (
          <div>
            <h2>Team {i + 1}</h2>
            <QRCodeSVG
              size={128}
              value={`https://prize-pool.netlify.app/delegated/capture?start=${start}&end=${end}`}
            />
          </div>
        ))}
      </Ranges>
    </Root>
  );
};
