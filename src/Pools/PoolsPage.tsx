import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCrudStorage } from "../services/hooks";
import { poolStorage } from "../services/pools";

const List = styled.ul``;

const ListItem = styled.li``;

const Button = styled.button``;

export const PoolsPage = () => {
  const { items: pools, deleteItem: deletePool } = useCrudStorage(poolStorage);

  return (
    <List>
      {pools.map((pool) => (
        <ListItem key={pool.id}>
          <Link to={`/pools/${pool.id}`}>{pool.name}</Link>{" "}
          <Button onClick={() => deletePool(pool.id)}>x</Button>
        </ListItem>
      ))}
    </List>
  );
};
