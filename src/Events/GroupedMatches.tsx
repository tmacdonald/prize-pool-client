// import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generateMatches } from "../services/MatchingEngine";
import { useBallotStorage, useMatchStorage, usePrizeStorage } from "./hooks";
import {
  Container,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Add, Clear, Download, MobileScreenShare } from "@mui/icons-material";
import { groupBy } from "lodash";
import { Match } from "../services/MatchStorage";
import { Fragment } from "react/jsx-runtime";

interface MatchesProps {
  eventId: string;
  showOnlyUnmatched?: boolean;
}

export const GroupedMatches = ({
  eventId,
  showOnlyUnmatched = false,
}: MatchesProps) => {
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

  const handleDownload = () => {
    navigator.clipboard.writeText(JSON.stringify(matches));
  };

  const handleShare = () => {
    navigator.share({ text: JSON.stringify(matches) });
  };

  const filteredMatches = showOnlyUnmatched
    ? matches.filter((match) => match.basedOnPreference === false)
    : matches;
  const groupedMatches = groupBy(filteredMatches, "group");

  const matchTables = Object.entries(groupedMatches).map(
    ([group, groupMatches]) => (
      <Fragment key={group}>
        <Container>
          <h2>{group}</h2>
        </Container>
        <MatchesTable matches={groupMatches} />
        {/* <Container fixed>
          <QRCodeSVG size={256} value={JSON.stringify(groupMatches)} />
        </Container> */}
        {/* <pre>{JSON.stringify(groupMatches, null, 2)}</pre> */}
      </Fragment>
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
          key={"download"}
          icon={<Download />}
          tooltipTitle={"download"}
          onClick={handleDownload}
        />
        <SpeedDialAction
          key={"share"}
          icon={<MobileScreenShare />}
          tooltipTitle={"share"}
          onClick={handleShare}
        />
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
          <TableCell>Cake</TableCell>
          <TableCell>Participant</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={`${match.prizeId}:${match.participantId}`}>
            <TableCell>{match.prizeId}</TableCell>
            <TableCell>{match.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
