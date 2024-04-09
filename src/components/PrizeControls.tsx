import styled from "styled-components";

interface IProps {
  value: number;
  onChange: (newValue: number) => void;
  minPrizeId: number;
  maxPrizeId: number;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 10px;
  align-items: center;
  justify-items: center;
`;

const Button = styled.button`
  border: none;
  background: black;
  color: white;
  block-size: 40px;
  inline-size: 40px;
  border-radius: 20px;
`;

const Prize = styled.div`
  background: black;
  color: white;
  block-size: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding-inline: 20px;
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
      <Button onClick={decrementPrize}>&lt;</Button>
      <Prize>{value}</Prize>
      <Button onClick={incrementPrize}>&gt;</Button>
    </Wrapper>
  );
};
