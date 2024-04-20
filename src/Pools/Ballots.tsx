import { useMemo } from "react";
import { Ballot, getBallotStorage } from "../services/BallotStorage";
import { useCrudStorage, useSimpleCrudStorage } from "../services/hooks";
import { getPrizeStorage } from "../services/prizes";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, Fab } from "@mui/material";

interface BallotsProps {
  poolId: string;
}

const numParticipants = 100;
const numBallotsPerParticipant = 10;
const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];

export const Ballots = ({ poolId }: BallotsProps) => {
  const ballotStorage = useMemo(() => getBallotStorage(poolId), [poolId]);
  const prizeStorage = useMemo(() => getPrizeStorage(poolId!), [poolId]);

  const {
    items: ballots,
    createItem: createBallots,
    deleteAllItems: deleteAllBallots,
  } = useSimpleCrudStorage(ballotStorage);

  const { items: prizes } = useCrudStorage(prizeStorage);

  const handleAddBallots = () => {
    const participants = new Array(numParticipants).fill(0).map((x, i) => {
      const restrictions =
        Math.random() < 0.2
          ? [
              possibleRestrictions[
                Math.floor(Math.random() * possibleRestrictions.length)
              ],
            ]
          : undefined;
      return {
        participantId: i + 1,
        name: `Participant ${i + 1}`,
        restrictions,
      };
    });

    const newBallots = participants.flatMap((participant) => {
      return new Array(numBallotsPerParticipant).fill(0).map((x, i) => {
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        return {
          prizeId: prize.id,
          ...participant,
          ticketId: i + 1,
        };
      });
    });

    createBallots(...newBallots);
  };

  const handleRemoveAllBallots = () => {
    deleteAllBallots();
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Participant</TableCell>
                <TableCell>Prize</TableCell>
                <TableCell>Restrictions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ballots.map((ballot, i) => (
                <TableRow key={i}>
                  <TableCell>{ballot.name}</TableCell>
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
      <button onClick={handleAddBallots}>Add some ballots</button>
      <button onClick={handleRemoveAllBallots}>Remove all ballots</button>
    </>
  );
};
