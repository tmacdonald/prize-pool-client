import { Button, Chip } from "@mui/material";
import styled from "styled-components";

interface IProps {
  value: number;
  onChange: (newValue: number) => void;
  minPrizeId: number;
  maxPrizeId: number;
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;

  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 10px;
  align-items: center;
  justify-items: center;
`;

export const PrizeControls = ({
  value,
  onChange,
  minPrizeId,
  maxPrizeId,
}: IProps) => {
  function decrementPrize() {
    onChange(Math.max(minPrizeId, value - 1));
  }

  function incrementPrize() {
    onChange(Math.min(maxPrizeId, value + 1));
  }

  return (
    <Wrapper>
      <Button variant={"contained"} onClick={decrementPrize}>
        &lt;
      </Button>
      <Chip label={`Prize ${value}`} />
      <Button variant={"contained"} onClick={incrementPrize}>
        &gt;
      </Button>
    </Wrapper>
  );
};
