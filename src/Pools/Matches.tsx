import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generateMatches } from "../services/match";
import { useBallotStorage, useMatchStorage, usePrizeStorage } from "./hooks";

interface MatchesProps {
  poolId: string;
}

export const Matches = ({ poolId }: MatchesProps) => {
  const { prizes } = usePrizeStorage(poolId!);
  const { ballots } = useBallotStorage(poolId!);
  const { matches, createMatches } = useMatchStorage(poolId!);

  const handleCreateMatches = () => {
    const { matches: generatedMatches } = generateMatches(prizes, ballots);

    createMatches(...generatedMatches);
  };

  if (matches.length === 0) {
    return (
      <div>
        No matches <button onClick={handleCreateMatches}>Create matches</button>
      </div>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Prize</TableCell>
              <TableCell>Participant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={`${match.prizeId}:${match.participantId}`}>
                <TableCell>{match.prizeId}</TableCell>
                <TableCell>{match.participantId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
