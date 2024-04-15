import {
  orderBy,
  groupBy,
  range,
  shuffle as lodashShuffle,
  differenceWith,
  uniq,
  zip,
  partition,
  difference,
} from "lodash";
import { Ballot } from "./BallotStorage";
import { Prize } from "./prizes";

export interface Match {
  participantId: number;
  prizeId: number;
}

interface PrizeWithBallot extends Prize {
  ballots: Ballot[];
}

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

interface MatchingOptions {
  additionalFilter: (prize: Prize, ballots: Ballot[]) => Ballot[];
  shuffle: <T>(items: T[]) => T[];
}

interface MatchingResults {
  matches: Match[];
  remainingPrizes: number[];
  remainingParticipants: number[];
}

export function createMatches(
  prizes: Prize[],
  ballots: Ballot[],
  options?: MatchingOptions
): MatchingResults {
  const shuffle = options?.shuffle ?? lodashShuffle;

  const matches: Match[] = [];
  const won = new Set<number>();
  const winners = new Set<number>();

  const ballotsGroupedByPrize = groupBy(ballots, (ballot) => ballot.prizeId);

  const prizesWithBallots = prizes.map((prize) => ({
    ...prize,
    ballots: ballotsGroupedByPrize[prize.id] || [],
  }));

  //const [prizesFreeFromRestrictions, otherPrizes] = partition(prizesWithBallots, prize => prize.freeFromRestrictions?.length !== 0);

  const popularPrizes = orderBy(
    prizesWithBallots,
    (prize) => prize.ballots.length,
    ["desc"]
  );

  popularPrizes.forEach((prize) => {
    const eligibleBallots = prize.ballots.filter(
      (ballot) => !winners.has(ballot.participantId)
    );

    const [winningBallot] = shuffle(eligibleBallots);
    if (winningBallot) {
      const { id: prizeId } = prize;
      const { participantId } = winningBallot;
      winners.add(participantId);
      won.add(prizeId);
      matches.push({
        prizeId,
        participantId,
      });
    }
  });

  // Look for prizes that haven't been won and match them with participants who haven't won
  const remainingPrizes = shuffle(
    differenceWith(uniq(prizesWithBallots.map((prize) => prize.id)), [...won])
  );
  const remainingParticipants = shuffle(
    differenceWith(uniq(ballots.map((ballot) => ballot.participantId)), [
      ...winners,
    ])
  );

  zip(remainingPrizes, remainingParticipants).forEach(
    ([prizeId, participantId]) => {
      if (!!prizeId && !!participantId) {
        winners.add(participantId);
        won.add(prizeId);
        matches.push({
          prizeId,
          participantId,
        });
      }
    }
  );

  const allPrizeIds = prizes.map((prize) => prize.id);
  const allParticipantIds = ballots.map((ballot) => ballot.participantId);

  return {
    matches,
    remainingPrizes: difference(allPrizeIds, [...won]),
    remainingParticipants: difference(allParticipantIds, [...winners]),
  };
}
