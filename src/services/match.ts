import { orderBy, groupBy, range, shuffle, differenceWith, uniq, zip, partition } from "lodash";
import { Ballot } from "./ballots";
import { Prize } from "./prizes";

export interface Match {
  participantId: number;
  prizeId: number;
  name: string;
  group: string;
}

interface PrizeWithBallot extends Prize {
  ballots: Ballot[];
}

const matches: Match[] = [];

// function matchPrizesFreeFromRestrictions(prizes: PrizeWithBallot[], won: Set<number>, winners: Set<number>): Match[] {
//   const orderedPrizes = orderBy(prizes, prize => prize.freeFromRestrictions?.length, ['asc']);

//   popularPrizes.forEach(prize => {
//     const shuffledBallots = shuffle(prize.ballots);
//     for (let i = 0; i < shuffledBallots.length; i++) {
//       const potentialWinningBallot = shuffledBallots[i];
//       const { participantId, name, group } = potentialWinningBallot;
//       if (!winners.has(participantId)) {
//         winners.add(participantId);
//         won.add(prize.id);
//         matches.push({ prizeId: prize.id, participantId: participantId, name, group });
//         break;
//       }
//     }
//   });
  
// }

export function createMatches(prizes: Prize[], ballots: Ballot[]): Match[] {
  const won = new Set<number>();
  const winners = new Set<number>();

  const ballotsGroupedByPrize = groupBy(ballots, ballot => ballot.prizeId);

  const prizesWithBallots = prizes.map(prize => ({
    ...prize,
    ballots: ballotsGroupedByPrize[prize.id] || [],
  }));

  //const [prizesFreeFromRestrictions, otherPrizes] = partition(prizesWithBallots, prize => prize.freeFromRestrictions?.length !== 0);


  const popularPrizes = orderBy(prizesWithBallots, prize => prize.ballots.length, ['desc']);
  
  popularPrizes.forEach(prize => {
    const shuffledBallots = shuffle(prize.ballots);
    for (let i = 0; i < shuffledBallots.length; i++) {
      const potentialWinningBallot = shuffledBallots[i];
      const { participantId, name, group } = potentialWinningBallot;
      if (!winners.has(participantId)) {
        winners.add(participantId);
        won.add(prize.id);
        matches.push({ prizeId: prize.id, participantId: participantId, name, group });
        break;
      }
    }
  });

  // Look for prizes that haven't been won and match them with participants who haven't won
  const remainingPrizes = shuffle(differenceWith(uniq(prizesWithBallots.map(prize => prize.id)), [...won]));
  const remainingParticipants = shuffle(differenceWith(uniq(ballots.map(ballot => ballot.participantId)), [...winners]));

  zip(remainingPrizes, remainingParticipants).forEach(([prizeId, participantId]) => {
    if (!!prizeId && !!participantId) {
      matches.push({ prizeId, participantId, name: 'TODO', group: 'TODO' });
    }
    
  });

  return matches;
}