import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { groupBy, range } from "lodash";
import styled from "styled-components";
import { useDelegatedBallotStorage } from "../hooks";

const Prizes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 12px 0;
`;

export function DelegatedDisplayPage() {
  const { ballots } = useDelegatedBallotStorage();
  const ballotsGroupedByPrize = groupBy(ballots, "prizeId");
  const start = Math.min(
    ...Object.keys(ballotsGroupedByPrize).map((key) => parseInt(key, 10))
  );
  const end =
    1 +
    Math.max(
      ...Object.keys(ballotsGroupedByPrize).map((key) => parseInt(key, 10))
    );

  if (ballots.length === 0) {
    return null;
  }

  return (
    <Container>
      <Prizes>
        {range(start, end).map((prize) => {
          const prizeBallots = ballotsGroupedByPrize[prize];
          return (
            <Card key={prize} sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Prize {prize}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {`${prizeBallots.length} tickets scanned`}
                </Typography>
              </CardContent>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Advanced
                </AccordionSummary>
                <AccordionDetails>
                  <pre>{JSON.stringify(prizeBallots, null, 2)}</pre>
                </AccordionDetails>
              </Accordion>
            </Card>
          );
        })}
      </Prizes>
    </Container>
  );
}
