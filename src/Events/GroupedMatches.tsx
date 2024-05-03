// import Paper from "@mui/material/Paper";
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
  Container,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Add, Clear } from "@mui/icons-material";
import { groupBy } from "lodash";
import { QRCodeSVG } from "qrcode.react";
import { Match } from "../services/MatchStorage";

interface MatchesProps {
  eventId: string;
}

export const GroupedMatches = ({ eventId }: MatchesProps) => {
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

  const groupedMatches = groupBy(matches, "group");

  const matchTables = Object.entries(groupedMatches).map(
    ([group, groupMatches]) => (
      <>
        <Container>
          <h2>{group}</h2>
        </Container>
        <MatchesTable matches={groupMatches} />
        <QRCodeSVG size={256} value={JSON.stringify(groupMatches)} />
        {/* <pre>{JSON.stringify(groupMatches, null, 2)}</pre> */}
      </>
    )
  );

  return (
    <>
      <Container>
        <h1>Matches</h1>
      </Container>
      {matchTables}
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

interface IMatchesTableProps {
  matches: Match[];
}

export const MatchesTable = ({ matches }: IMatchesTableProps) => (
  <TableContainer>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Prize</TableCell>
          <TableCell>Participant</TableCell>
          <TableCell>Based on Preference</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={`${match.prizeId}:${match.participantId}`}>
            <TableCell>{match.prizeId}</TableCell>
            <TableCell>{match.name}</TableCell>
            <TableCell>
              <Checkbox checked={match.basedOnPreference} readOnly={true} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
