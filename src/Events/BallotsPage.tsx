import { Chip, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import { getBallotStorage } from "../services/BallotStorage";
import { useCrudStorage, useSimpleCrudStorage } from "../services/hooks";
import { getPrizeStorage } from "../services/PrizeStorage";
import { useEvent } from "./hooks";
import {
  AddToPhotos,
  Clear,
  Download,
  MobileScreenShare,
  Upload,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router";

const numGroups = 10;
const numParticipants = 100;
const numBallotsPerParticipant = 10;

export const BallotsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const ballotStorage = useMemo(() => getBallotStorage(eventId!), [eventId]);
  const prizeStorage = useMemo(() => getPrizeStorage(eventId!), [eventId]);

  const { item: event } = useEvent(eventId!);
  const possibleRestrictions = event?.availableRestrictions ?? [];

  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useSimpleCrudStorage(ballotStorage);

  const { items: prizes } = useCrudStorage(prizeStorage);

  const handleAddBallots = () => {
    const groups = new Array(numGroups)
      .fill(0)
      .map((_x, i) => `Group ${i + 1}`);
    const participants = new Array(numParticipants).fill(0).map((_x, i) => {
      const restrictions =
        Math.random() < 0.2
          ? [
              possibleRestrictions[
                Math.floor(Math.random() * possibleRestrictions.length)
              ],
            ]
          : undefined;
      return {
        participantId: `${i + 1}`,
        name: `Participant ${i + 1}`,
        group: groups[Math.floor(Math.random() * groups.length)],
        restrictions,
      };
    });

    const newBallots = participants.flatMap((participant) => {
      return new Array(numBallotsPerParticipant).fill(0).map((_x, i) => {
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        return {
          prizeId: prize.id,
          ...participant,
          ticketId: `${i + 1}`,
        };
      });
    });

    createBallots(...newBallots);
  };

  const handleRemoveAllBallots = () => {
    deleteAllBallots();
  };

  const handleDownload = () => {
    navigator.clipboard.writeText(JSON.stringify(ballots));
  };

  const handleShare = () => {
    navigator.share({ text: JSON.stringify(ballots) });
  };

  const handleImport = () => {
    navigate("./import");
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Participant</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Prize</TableCell>
                <TableCell>Restrictions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ballots.map((ballot, i) => (
                <TableRow key={i}>
                  <TableCell>{ballot.name}</TableCell>
                  <TableCell>{ballot.group}</TableCell>
                  <TableCell>{ballot.prizeId}</TableCell>
                  <TableCell>
                    {ballot.restrictions?.map((restriction) => (
                      <Chip label={restriction} />
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key={"export"}
          icon={<Download />}
          tooltipTitle={"export"}
          onClick={handleDownload}
        />
        <SpeedDialAction
          key={"import"}
          icon={<Upload />}
          tooltipTitle={"import"}
          onClick={handleImport}
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
          onClick={handleRemoveAllBallots}
        />
        <SpeedDialAction
          key={"add-examples"}
          icon={<AddToPhotos />}
          tooltipTitle={"add examples"}
          onClick={handleAddBallots}
        />
      </SpeedDial>
    </>
  );
};
