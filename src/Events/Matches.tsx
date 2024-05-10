import { Add, Clear } from "@mui/icons-material";
import {
  Button,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generateMatches } from "../services/MatchingEngine";
import {
  useBallotStorage,
  useMatchStorage,
  useParticipantStorage,
  usePrizeStorage,
} from "./hooks";
import { generateMatchesForParticipants } from "../services/PlanBMatchingEngine";

interface MatchesProps {
  eventId: string;
  showOnlyUnmatched?: boolean;
}

export const Matches = ({
  eventId,
  showOnlyUnmatched = false,
}: MatchesProps) => {
  const { participants } = useParticipantStorage(eventId!);
  const { prizes } = usePrizeStorage(eventId!);
  const { ballots } = useBallotStorage(eventId!);
  const { matches, createMatches, deleteMatch, deleteAllMatches } =
    useMatchStorage(eventId!);

  const handleCreateMatches = async () => {
    const { matches: generatedMatches } = generateMatches(prizes, ballots);

    await deleteAllMatches();
    await createMatches(...generatedMatches);
  };

  const handleGenerateRemainingMatches = async () => {
    console.log({ matches, prizes, participants });

    const { matches: generatedMatches } = generateMatchesForParticipants(
      matches,
      prizes,
      participants
    );

    await createMatches(...generatedMatches);
  };

  const handleRemoveAllMatches = () => {
    deleteAllMatches();
  };

  const handleDelete = (matchId: string) => {
    deleteMatch(matchId);
  };

  const filteredMatches = showOnlyUnmatched
    ? matches.filter((match) => match.basedOnPreference === false)
    : matches;

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Prize</TableCell>
              <TableCell>Participant</TableCell>
              <TableCell>Group</TableCell>
              {/* <TableCell>Based on Preference</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>{match.prizeId}</TableCell>
                <TableCell>{match.name}</TableCell>
                <TableCell>{match.group}</TableCell>
                {/* <TableCell>
                  <Checkbox checked={match.basedOnPreference} readOnly={true} />
                </TableCell> */}
                <TableCell>
                  <Button onClick={() => handleDelete(match.id)}>Delete</Button>
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
        <SpeedDialAction
          key={"generate-remaining-matches"}
          icon={<Add />}
          tooltipTitle={"generate remaining matches"}
          onClick={handleGenerateRemainingMatches}
        />
      </SpeedDial>
    </>
  );
};
