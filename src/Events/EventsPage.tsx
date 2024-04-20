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
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useCrudStorage } from "../services/hooks";
import { eventStorage } from "../services/events";

export const EventsPage = () => {
  const { items: events, deleteItem: deleteEvent } =
    useCrudStorage(eventStorage);

  if (events.length === 0) {
    return (
      <Container>
        <Typography>
          There are no events.{" "}
          <Link to={"/events/new"}>Create a new event</Link>
        </Typography>
      </Container>
    );
  }

  return (
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
  );
};
