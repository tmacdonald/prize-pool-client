import { Chip, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useParams } from "react-router";
import { useParticipantStorage } from "./hooks";
import { Clear, Download, Upload } from "@mui/icons-material";

export const ParticipantsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { participants, deleteAllParticipants } = useParticipantStorage(
    eventId!
  );

  const handleDownload = () => {
    navigator.clipboard.writeText(JSON.stringify(participants));
  };

  const handleImport = () => {
    navigate("./import");
  };

  const handleRemoveAllParticipants = () => {
    deleteAllParticipants();
  };

  return (
    <>
      <Paper>
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
              {participants.map((participant) => (
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
          key={"remove"}
          icon={<Clear />}
          tooltipTitle={"remove"}
          onClick={handleRemoveAllParticipants}
        />
      </SpeedDial>
    </>
  );
};
