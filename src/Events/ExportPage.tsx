import { useParams } from "react-router";
import {
  useBallotStorage,
  useEvent,
  useMatchStorage,
  usePrizeStorage,
} from "./hooks";
import { Button, Container } from "@mui/material";
import styled from "styled-components";

const Stack = styled.div`
  margin-block: 12px;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ExportPage = () => {
  const { eventId } = useParams();
  const event = useEvent(eventId!);

  const { prizes } = usePrizeStorage(eventId!);
  const { ballots } = useBallotStorage(eventId!);
  const { matches } = useMatchStorage(eventId!);

  const exportEvent = async () => {
    const exportedEvent = {
      ...event,
      prizes,
      ballots,
      matches,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportedEvent));
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  return (
    <Container>
      <Stack>
        <Button variant={"contained"} onClick={exportEvent}>
          Copy event to clipboard
        </Button>
      </Stack>
    </Container>
  );
};
