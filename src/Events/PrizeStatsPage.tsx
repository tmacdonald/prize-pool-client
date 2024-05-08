import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { groupBy } from "lodash";
import { useParams } from "react-router";
import { useBallotStorage, usePrizeStorage } from "./hooks";

export const PrizeStatsPage = () => {
  const { eventId } = useParams();
  const { prizes } = usePrizeStorage(eventId!);
  const { ballots } = useBallotStorage(eventId!);
  const ballotsGroupedByPrize = groupBy(ballots, "prizeId");

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Prize</TableCell>
            <TableCell>Number of ballots</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prizes.map((prize) => (
            <TableRow key={prize.id}>
              <TableCell>{prize.id}</TableCell>
              <TableCell>
                {(ballotsGroupedByPrize[prize.id] ?? []).length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
