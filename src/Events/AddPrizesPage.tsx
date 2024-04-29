import {
  Button,
  Container as ContainerBase,
  Slider,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePrizeStorage } from "./hooks";

const Container = styled(ContainerBase)(
  ({ theme }) => `
  margin-block-start: ${theme.spacing(4)};
`
);

export const AddPrizesPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { prizes, createPrizes } = usePrizeStorage(eventId!);
  const [numPrizes, setNumPrizes] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPrizes = new Array(numPrizes).fill(0).map((_x, i) => {
      return {
        id: prizes.length + i + 1,
      };
    });

    createPrizes(...newPrizes);
    navigate(`/events/${eventId!}/prizes`);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Slider
          defaultValue={10}
          valueLabelDisplay="auto"
          value={numPrizes}
          onChange={(_e, value) =>
            setNumPrizes(typeof value === "number" ? value : value[0])
          }
        />
        <Button variant={"contained"} type={"submit"}>
          Create
        </Button>
      </form>
    </Container>
  );
};
