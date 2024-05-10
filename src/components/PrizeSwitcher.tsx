import { Button, MenuItem, Select } from "@mui/material";
// import { Link } from "react-router-dom";
import styled from "styled-components";
import { Prize } from "../services/PrizeStorage";

interface IProps {
  value: string;
  onChange: (newValue: string) => void;
  prizes: Prize[];
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

export const PrizeSwitcher = ({ value, onChange, prizes }: IProps) => {
  const prizeIndex = prizes.findIndex((p) => p.id === value);

  const previousPrize = () => {
    const previous = prizes[prizeIndex - 1].id;
    onChange(previous);
  };

  const nextPrize = () => {
    const next = prizes[prizeIndex + 1].id;
    onChange(next);
  };

  return (
    <Wrapper>
      <Button
        disabled={prizeIndex === 0}
        variant={"contained"}
        onClick={previousPrize}
      >
        &lt;
      </Button>
      <div>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {prizes.map((prize) => (
            <MenuItem key={prize.id} value={prize.id}>
              {prize.id}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button
        disabled={prizeIndex === prizes.length - 1}
        variant={"contained"}
        onClick={nextPrize}
      >
        &gt;
      </Button>
    </Wrapper>
  );
};
