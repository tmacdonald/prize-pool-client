import { useMemo } from "react";
import { useParams } from "react-router";

import { useCrudStorage, useItem } from "../services/hooks";
import { Pool, poolStorage } from "../services/pools";
import { Prize, getPrizeStorage } from "../services/prizes";
import { Ballots } from "./Ballots";

const usePool = (key: string): Pool | undefined =>
  useItem<Pool>(poolStorage, key);

export const PoolPage = () => {
  const { poolId } = useParams();
  const pool = usePool(poolId!);
  const prizeStorage = useMemo(() => getPrizeStorage(poolId!), [poolId]);
  const {
    items: prizes,
    createItem: createPrizes,
    deleteAllItems: deleteAllPrizes,
  } = useCrudStorage(prizeStorage);

  const handleAddPrizes = () => {
    const newPrizes = new Array(5).fill(0).map((_, i) => {
      return {
        id: `${i + 1}`,
      } as Prize;
    });

    createPrizes(newPrizes);
  };

  const handleRemoveAllPrizes = () => {
    deleteAllPrizes();
  };

  if (!pool) {
    return null;
  }

  return (
    <>
      <h1>{pool.name}</h1>
      <ul>
        {prizes.map((prize) => (
          <li key={prize.id}>{prize.id}</li>
        ))}
      </ul>
      <button onClick={handleAddPrizes}>Add some prizes</button>
      <button onClick={handleRemoveAllPrizes}>Remove all prizes</button>

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
