import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { differenceWith } from "lodash";
import { useParams } from "react-router";
import { useMatchStorage, useParticipantStorage } from "./hooks";
import { Chip } from "@mui/material";

export const ParticipantStatsPage = () => {
  const { eventId } = useParams();
  const { participants } = useParticipantStorage(eventId!);
  const { matches } = useMatchStorage(eventId!);
  const winners = new Set(matches.map((m) => `${m.name}-${m.group}`));

  // participants who haven't won
  let remainingParticipants = differenceWith(
    participants,
    [...winners],
    (p, participantId) => `${p.name}-${p.group}` === participantId
  );

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Homeroom</TableCell>
            <TableCell>Restrictions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {remainingParticipants.map((participant) => (
            <TableRow key={participant.name}>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.group}</TableCell>
              <TableCell>
                {participant.restrictions?.map((restriction) => (
                  <Chip label={restriction} />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
