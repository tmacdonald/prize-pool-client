import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { differenceWith } from "lodash";
import { useParams } from "react-router";
import { useMatchStorage, usePrizeStorage } from "./hooks";
import { Chip } from "@mui/material";

export const PrizeStatsPage = () => {
  const { eventId } = useParams();
  const { prizes } = usePrizeStorage(eventId!);
  const { matches } = useMatchStorage(eventId!);
  const won = new Set(matches.map((match) => match.prizeId));
  //const { ballots } = useBallotStorage(eventId!);
  //const ballotsGroupedByPrize = groupBy(ballots, "prizeId");

  // prizes that haven't been won
  const unmatchedPrizes = differenceWith(
    prizes,
    [...won],
    (prize, prizeId) => prize.id === prizeId
  );

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Prize</TableCell>
            <TableCell>Free from restrictions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unmatchedPrizes.map((prize) => (
            <TableRow key={prize.id}>
              <TableCell>{prize.id}</TableCell>
              <TableCell>
                {prize.freeFromRestrictions?.map((restriction) => (
                  <Chip
                    key={`${prize.id}-${restriction}`}
                    label={restriction}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
