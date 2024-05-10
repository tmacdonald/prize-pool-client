import BallotIcon from "@mui/icons-material/Ballot";
import CakeIcon from "@mui/icons-material/Cake";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import CameraIcon from "@mui/icons-material/Camera";
import {
  Container,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useEvent } from "./hooks";
import { Groups, Key, Person, QueryStats } from "@mui/icons-material";

export const EventPage = () => {
  const { eventId } = useParams();
  const { item: event } = useEvent(eventId!);

  if (!event) {
    return null;
  }

  return (
    <>
      <Container>
        <h1>{event.name}</h1>
        <Paper>
          <MenuList>
            <MenuItem component={Link} to={"./restrictions"}>
              <ListItemIcon>
                <Key fontSize="small" />
              </ListItemIcon>
              <ListItemText>Restrictions</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to={"./prizes"}>
              <ListItemIcon>
                <CakeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Prizes</ListItemText>
            </MenuItem>
            {/* <MenuItem component={Link} to={"./capture"}>
              <ListItemIcon>
                <CameraIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Capture Ballots</ListItemText>
            </MenuItem> */}
            {/* <MenuItem component={Link} to={"./ballots"}>
              <ListItemIcon>
                <BallotIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ballots</ListItemText>
            </MenuItem> */}
            <MenuItem component={Link} to={"./planb/capture"}>
              <ListItemIcon>
                <CameraIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Capture</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to={"./matches"}>
              <ListItemIcon>
                <JoinInnerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Matches</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to={"./participants"}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Participants</ListItemText>
            </MenuItem>
            {/* <MenuItem component={Link} to={"./teams"}>
              <ListItemIcon>
                <Groups fontSize="small" />
              </ListItemIcon>
              <ListItemText>Teams</ListItemText>
            </MenuItem> */}

            <Divider />
            <MenuItem component={Link} to={"./prizes/stats"}>
              <ListItemIcon>
                <QueryStats fontSize="small" />
              </ListItemIcon>
              <ListItemText>Prize Stats</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to={"./participants/stats"}>
              <ListItemIcon>
                <QueryStats fontSize="small" />
              </ListItemIcon>
              <ListItemText>Participant Stats</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Container>
    </>
  );
};
