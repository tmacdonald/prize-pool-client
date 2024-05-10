import {
  Button,
  Container as ContainerBase,
  TextField,
  styled,
} from "@mui/material";
import { range } from "lodash";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import sc from "styled-components";
import { usePrizeStorage } from "./hooks";

const Container = styled(ContainerBase)(
  ({ theme }) => `
  margin-block-start: ${theme.spacing(4)};
`
);

const Form = sc.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AddPrizesPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { createPrizes } = usePrizeStorage(eventId!);
  const [numPrizes, setNumPrizes] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPrizes = range(1, parseInt(numPrizes, 10) + 1).map((x) => {
      return {
        id: `${prefix}${x}`,
      };
    });

    createPrizes(...newPrizes);
    navigate(`/events/${eventId!}/prizes`);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <TextField
          value={numPrizes}
          onChange={(e) => setNumPrizes(e.target.value)}
          label={"Number of cakes"}
        />
        <TextField
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          label={"Prefix"}
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </Form>
    </Container>
  );
};
