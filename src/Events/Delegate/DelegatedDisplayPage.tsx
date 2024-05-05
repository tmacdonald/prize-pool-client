import { groupBy, range } from "lodash";
import { useDelegatedBallotStorage } from "../hooks";
import { QRCodeSVG } from "qrcode.react";
import { Container } from "@mui/material";
import styled from "styled-components";

const QRCodeContainer = styled.div`
  margin-bottom: 30vh;
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
      {range(start, end).map((prize, i) => {
        const prizeBallots = ballotsGroupedByPrize[prize];
        return (
          <QRCodeContainer>
            <h2>Prize {prize}</h2>
            <QRCodeSVG value={JSON.stringify(prizeBallots)} />
          </QRCodeContainer>
        );
      })}
    </Container>
  );
}
