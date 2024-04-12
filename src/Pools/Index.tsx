import { type Pool, poolStorage } from "../services/pools";
import styled from "styled-components";
import { useCrudStorage, useList } from "../services/hooks";
import { Link } from "react-router-dom";

const List = styled.ul``;

const ListItem = styled.li``;

const Button = styled.button``;

export const Index = () => {
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
