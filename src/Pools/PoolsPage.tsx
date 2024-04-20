import styled from "styled-components";
import { useCrudStorage } from "../services/hooks";
import { poolStorage } from "../services/pools";
import CakeIcon from "@mui/icons-material/Cake";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

export const PoolsPage = () => {
  const { items: pools, deleteItem: deletePool } = useCrudStorage(poolStorage);

  return (
    <List>
      {pools.map((pool) => (
        <ListItemButton component={Link} key={pool.id} to={`/pools/${pool.id}`}>
          <ListItemAvatar>
            <Avatar>
              <CakeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={pool.name} />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => deletePool(pool.id)}
              edge="end"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
          {/* <Link to={`/pools/${pool.id}`}>{pool.name}</Link> */}
          {/* <Button onClick={() => deletePool(pool.id)}>x</Button> */}
        </ListItemButton>
      ))}
    </List>
  );
};
