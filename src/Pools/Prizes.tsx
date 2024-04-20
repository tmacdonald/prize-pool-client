import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Prize } from "../services/prizes";
import { usePrizeStorage } from "./hooks";

interface PrizesProps {
  poolId: string;
}

const combinations = (array: string[]): string[][] => {
  return array.reduce<string[][]>(
    (acc, curr) => [...acc, ...acc.map((r) => [...r, curr])],
    [[]]
  );
};

const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];

const numPrizes = 100;

export const Prizes = ({ poolId }: PrizesProps) => {
  const { prizes, createPrizes, updatePrize, deleteAllPrizes } =
    usePrizeStorage(poolId!);

  const handleAddPrizes = () => {
    const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];
    const restrictionCombinations = combinations(possibleRestrictions);

    const newPrizes = new Array(numPrizes).fill(0).map((x, i) => {
      const freeFromRestrictions =
        Math.random() < 0.2
          ? restrictionCombinations[
              Math.floor(Math.random() * restrictionCombinations.length)
            ]
          : undefined;
      return {
        id: i + 1,
        freeFromRestrictions,
      };
    });

    createPrizes(...newPrizes);
  };

  const handleRemoveAllPrizes = () => {
    deleteAllPrizes();
  };

  const handleChangeRestrictions = (
    prize: Prize,
    newRestrictions: string[]
  ) => {
    const newPrize = { ...prize, freeFromRestrictions: newRestrictions };
    updatePrize(newPrize.id, newPrize);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Prize</TableCell>
              <TableCell>Free From Restrictions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prizes.map((prize, i) => (
              <TableRow key={prize.id}>
                <TableCell>{prize.id}</TableCell>
                <TableCell>
                  <ToggleButtonGroup
                    value={prize.freeFromRestrictions}
                    onChange={(
                      _event: React.MouseEvent<HTMLElement>,
                      newRestrictions: string[]
                    ) => handleChangeRestrictions(prize, newRestrictions)}
                    aria-label="text formatting"
                  >
                    {possibleRestrictions.map((restriction) => (
                      <ToggleButton
                        key={`${prize.id}:${restriction}`}
                        value={restriction}
                        aria-label={restriction}
                      >
                        {restriction}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key={"add"}
          icon={<AddIcon />}
          tooltipTitle={"add"}
          onClick={handleAddPrizes}
        />
        <SpeedDialAction
          key={"remove"}
          icon={<ClearIcon />}
          tooltipTitle={"remove"}
          onClick={handleRemoveAllPrizes}
        />
      </SpeedDial>
    </>
  );
};
