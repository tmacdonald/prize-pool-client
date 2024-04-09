import styled from "styled-components";

interface IProps {
  notifications: string[];
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  padding-inline: 20px;
`;

const ListItem = styled.li`
  min-height: 40px;
  background: black;
  color: white;
  block-size: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 20px;
  margin-block-end: 5px;
`;

export const Notifications = ({ notifications }: IProps) => {
  return (
    <List>
      {notifications.map((notification) => {
        const parsed = JSON.parse(notification);
        return (
          <ListItem>{`${parsed.name} bid on prize ${parsed.prizeId}`}</ListItem>
        );
      })}
    </List>
  );
};
