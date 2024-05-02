import CakeIcon from "@mui/icons-material/Cake";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Container,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useCrudStorage } from "../services/hooks";
import { eventStorage } from "../services/events";
import { Add } from "@mui/icons-material";

export const EventsPage = () => {
  const navigate = useNavigate();
  const { items: events, deleteItem: deleteEvent } =
    useCrudStorage(eventStorage);

  if (events.length === 0) {
    return (
      <Container>
        <Typography>There are no events. </Typography>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            key={"add"}
            icon={<Add />}
            tooltipTitle={"add examples"}
            onClick={() => navigate("/events/new")}
          />
        </SpeedDial>
      </Container>
    );
  }

  return (
    <>
      <List>
        {events.map((event) => (
          <ListItemButton
            component={Link}
            key={event.id}
            to={`/events/${event.id}`}
          >
            <ListItemAvatar>
              <Avatar>
                <CakeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={event.name} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => deleteEvent(event.id)}
                edge="end"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemButton>
        ))}
      </List>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key={"add"}
          icon={<Add />}
          tooltipTitle={"add examples"}
          onClick={() => navigate("/events/new")}
        />
      </SpeedDial>
    </>
  );
};
