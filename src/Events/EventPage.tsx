import BallotIcon from "@mui/icons-material/Ballot";
import CakeIcon from "@mui/icons-material/Cake";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import {
  Container,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useEvent } from "./hooks";

export const EventPage = () => {
  const { eventId } = useParams();
  const event = useEvent(eventId!);

  if (!event) {
    return null;
  }

  return (
    <>
      <Container>
        <h1>{event.name}</h1>
        <Paper>
          <MenuList>
            <MenuItem component={Link} to={"./prizes"}>
              <ListItemIcon>
                <CakeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Prizes</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘X
            </Typography> */}
            </MenuItem>
            <MenuItem component={Link} to={"./ballots"}>
              <ListItemIcon>
                <BallotIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ballots</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘C
            </Typography> */}
            </MenuItem>
            <MenuItem component={Link} to={"./matches"}>
              <ListItemIcon>
                <JoinInnerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Matches</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘X
            </Typography> */}
            </MenuItem>
          </MenuList>
        </Paper>
      </Container>
    </>
  );
};
