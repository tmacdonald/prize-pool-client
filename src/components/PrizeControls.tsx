import { Button, Chip, MenuItem, Select } from "@mui/material";
import { range } from "lodash";
// import { Link } from "react-router-dom";
import styled from "styled-components";

interface IProps {
  value: number;
  onChange: (newValue: number) => void;
  minPrizeId: number;
  maxPrizeId: number;
  onComplete?: () => void;
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
  onComplete,
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
      <div>
        {/* <Chip color={"primary"} label={`Cake ${value}`} /> */}
        <Select
          value={value}
          onChange={(e) => onChange(parseInt(`${e.target.value}`, 10))}
        >
          {range(minPrizeId, maxPrizeId).map((prizeId) => (
            <MenuItem value={prizeId}>{prizeId}</MenuItem>
          ))}
        </Select>
      </div>
      {value < maxPrizeId && (
        <Button variant={"contained"} onClick={incrementPrize}>
          &gt;
        </Button>
      )}
      {value === maxPrizeId && (
        <Button variant={"contained"} onClick={onComplete}>
          Done
        </Button>
      )}
    </Wrapper>
  );
};
