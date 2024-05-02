import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generateMatches } from "../services/match";
import { useBallotStorage, useMatchStorage, usePrizeStorage } from "./hooks";
import {
  Checkbox,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";

interface MatchesProps {
  eventId: string;
}

export const Matches = ({ eventId }: MatchesProps) => {
  const { prizes } = usePrizeStorage(eventId!);
  const { ballots } = useBallotStorage(eventId!);
  const { matches, createMatches, deleteAllMatches } = useMatchStorage(
    eventId!
  );

  const handleCreateMatches = async () => {
    const { matches: generatedMatches } = generateMatches(prizes, ballots);

    await deleteAllMatches();
    await createMatches(...generatedMatches);
  };

  const handleRemoveAllMatches = () => {
    deleteAllMatches();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Prize</TableCell>
              <TableCell>Participant</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Based on Preference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={`${match.prizeId}:${match.participantId}`}>
                <TableCell>{match.prizeId}</TableCell>
                <TableCell>{match.name}</TableCell>
                <TableCell>{match.group}</TableCell>
                <TableCell>
                  <Checkbox checked={match.basedOnPreference} readOnly={true} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key={"remove"}
          icon={<Clear />}
          tooltipTitle={"remove"}
          onClick={handleRemoveAllMatches}
        />
        <SpeedDialAction
          key={"add-examples"}
          icon={<Add />}
          tooltipTitle={"add examples"}
          onClick={handleCreateMatches}
        />
      </SpeedDial>
    </>
  );
};
