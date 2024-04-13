import { useParams } from "react-router";

import { useItem } from "../services/hooks";
import { Pool, poolStorage } from "../services/pools";
import { Ballots } from "./Ballots";
import { Prizes } from "./Prizes";

const usePool = (key: string): Pool | undefined =>
  useItem<string, Pool>(poolStorage, key);

export const PoolPage = () => {
  const { poolId } = useParams();
  const pool = usePool(poolId!);

  if (!pool) {
    return null;
  }

  return (
    <>
      <h1>{pool.name}</h1>

      <h2>Prizes</h2>
      <Prizes poolId={poolId!} />

      <h2>Ballots</h2>
      <Ballots poolId={poolId!} />
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
