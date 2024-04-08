interface IProps {
  value: number;
  onChange: (newValue: number) => void;
  minPrizeId: number;
  maxPrizeId: number;
}

export const PrizeControls = ({ value, onChange, minPrizeId, maxPrizeId }: IProps) => {
  function decrementPrize() {
    onChange(Math.max(minPrizeId, value - 1));
  }

  function incrementPrize() {
    onChange(Math.min(maxPrizeId, value + 1));
  }

  return (
    <div>
      <button onClick={decrementPrize}>&lt;</button>
      <span>{value}</span>
      <button onClick={incrementPrize}>&gt;</button>
    </div>
  )
}