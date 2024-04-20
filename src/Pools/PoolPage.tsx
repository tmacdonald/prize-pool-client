import {
  Container,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { usePool } from "./hooks";
import { ContentCopy, ContentCut, ContentPaste } from "@mui/icons-material";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import BallotIcon from "@mui/icons-material/Ballot";
import CakeIcon from "@mui/icons-material/Cake";

export const PoolPage = () => {
  const { poolId } = useParams();
  const pool = usePool(poolId!);

  if (!pool) {
    return null;
  }

  return (
    <>
      <Container>
        <h1>{pool.name}</h1>
        <Paper>
          <MenuList>
            <MenuItem component={Link} to={"./prizes"}>
              <ListItemIcon>
                <CakeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Prizes</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘X
            </Typography> */}
            </MenuItem>
            <MenuItem component={Link} to={"./ballots"}>
              <ListItemIcon>
                <BallotIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ballots</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘C
            </Typography> */}
            </MenuItem>
            <MenuItem component={Link} to={"./matches"}>
              <ListItemIcon>
                <JoinInnerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Matches</ListItemText>
              {/* <Typography variant="body2" color="text.secondary">
              ⌘X
            </Typography> */}
            </MenuItem>
          </MenuList>
        </Paper>
      </Container>
    </>
  );
};

// const useBallots = (poolId: string) => {
//   const [ballots, setBallots] = useState<Ballot[]>([]);

//   useEffect(() => {
//     const loadBallots = async () => {
//       const retrievedBallots = await getBallots(poolId);
//       setBallots(retrievedBallots);
//     };

//     loadBallots();
//   }, [poolId]);

//   return ballots;
// };

// const useMatches = (poolId: string) => {
//   const [matches, setMatches] = useState<Match[]>([]);

//   useEffect(() => {
//     const loadMatches = async () => {
//       const retrievedMatches = await getMatches(poolId);
//       setMatches(retrievedMatches);
//     };

//     loadMatches();
//   }, [poolId]);

//   return matches;
// };

// export const Pool = () => {
//   const { poolId } = useParams();
//   const ballots = useBallots(poolId!);
//   const matches = useMatches(poolId!);

//   const handleMatchClick = async () => {
//     await createMatches(poolId!);
//   };

//   return (
//     <>
//       <BallotTable ballots={ballots} />
//       <button onClick={handleMatchClick}>Create matches</button>
//       <MatchTable matches={matches} />
//     </>
//   );
// };

// interface IBallotTableProps {
//   ballots: Ballot[];
// }

// const BallotTable = ({ ballots }: IBallotTableProps) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Participant</th>
//           <th>Cake</th>
//         </tr>
//       </thead>
//       <tbody>
//         {ballots.map((ballot) => (
//           <tr key={`${ballot.participantId}:${ballot.ticketId}`}>
//             <td>{ballot.name}</td>
//             <td>{ballot.prizeId}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// interface IMatchTableProps {
//   matches: Match[];
// }

// const MatchTable = ({ matches }: IMatchTableProps) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Participant</th>
//           <th>Cake</th>
//         </tr>
//       </thead>
//       <tbody>
//         {matches.map((match) => (
//           <tr key={`${match.participantId}:${match.prizeId}`}>
//             <td>{match.name}</td>
//             <td>{match.prizeId}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };
