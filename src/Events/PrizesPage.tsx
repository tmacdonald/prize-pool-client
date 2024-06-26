import {
  Button,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddToPhotos, Download, MobileScreenShare } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Prize } from "../services/PrizeStorage";
import { useEvent, usePrizeStorage } from "./hooks";
import { useNavigate, useParams } from "react-router";

const combinations = (array: string[]): string[][] => {
  return array.reduce<string[][]>(
    (acc, curr) => [...acc, ...acc.map((r) => [...r, curr])],
    [[]]
  );
};

const numPrizes = 100;

export const PrizesPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { item: event } = useEvent(eventId!);
  const { prizes, createPrizes, updatePrize, deletePrize, deleteAllPrizes } =
    usePrizeStorage(eventId!);
  const possibleRestrictions = event?.availableRestrictions ?? [];

  const handleAddPrizes = () => {
    navigate(`./add`);
  };

  const handleAddExamples = () => {
    const restrictionCombinations = combinations(possibleRestrictions);

    const newPrizes = new Array(numPrizes).fill(0).map((_x, i) => {
      const freeFromRestrictions =
        Math.random() < 0.2
          ? restrictionCombinations[
              Math.floor(Math.random() * restrictionCombinations.length)
            ]
          : undefined;
      return {
        id: `${i + 1}`,
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

  const handleDownload = () => {
    navigator.clipboard.writeText(JSON.stringify(prizes));
  };

  const handleShare = () => {
    navigator.share({ text: JSON.stringify(prizes) });
  };

  const handleDelete = (prizeId: string) => {
    deletePrize(prizeId);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Cake</TableCell>
              <TableCell>Free From Restrictions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell>{prize.id}</TableCell>
                <TableCell>
                  <ToggleButtonGroup
                    color={"primary"}
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
                <TableCell>
                  <Button onClick={() => handleDelete(prize.id)}>Delete</Button>
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
          key={"download"}
          icon={<Download />}
          tooltipTitle={"download"}
          onClick={handleDownload}
        />
        <SpeedDialAction
          key={"share"}
          icon={<MobileScreenShare />}
          tooltipTitle={"share"}
          onClick={handleShare}
        />
        <SpeedDialAction
          key={"remove"}
          icon={<ClearIcon />}
          tooltipTitle={"remove"}
          onClick={handleRemoveAllPrizes}
        />
        <SpeedDialAction
          key={"add-examples"}
          icon={<AddToPhotos />}
          tooltipTitle={"add examples"}
          onClick={handleAddExamples}
        />
      </SpeedDial>
    </>
  );
};
