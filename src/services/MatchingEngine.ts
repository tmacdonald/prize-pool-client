import {
  difference,
  differenceWith,
  groupBy,
  intersection,
  orderBy as lodashOrderBy,
  shuffle as lodashShuffle,
  partition,
} from "lodash";
import { Ballot } from "./BallotStorage";
import { Prize } from "./PrizeStorage";
import { Match } from "./MatchStorage";

interface PrizeWithBallot extends Prize {
  ballots: Ballot[];
}

interface MatchingOptions {
  orderBy?: (items: PrizeWithBallot[]) => PrizeWithBallot[];
  isPrizeEligibleForBallot?: (prize: Prize, ballot: Ballot) => boolean;
  shuffle?: (items: Ballot[]) => Ballot[];
}

interface MatchingResults {
  matches: Match[];
  remainingPrizes: number[];
  remainingParticipants: string[];
}

export function generateMatches(
  prizes: Prize[],
  ballots: Ballot[],
  options?: MatchingOptions
): MatchingResults {
  const [prizesFreeFromRestrictions, otherPrizes] = partition(
    prizes,
    (prize) => (prize.freeFromRestrictions?.length ?? 0) !== 0
  );
  const [ballotsWithRestrictions, otherBallots] = partition(
    ballots,
    (ballot) => (ballot.restrictions?.length ?? 0) !== 0
  );

  const {
    matches: restrictedMatches,
    remainingPrizes: remainingPrizesFreeFromRestrictions,
    remainingParticipants: remainingParticipantsWithRestrictions,
  } = createMatchesWithRestrictions(
    prizesFreeFromRestrictions,
    ballotsWithRestrictions,
    options
  );
  const {
    matches: otherMatches,
    remainingPrizes: otherRemainingPrizes,
    remainingParticipants: otherRemainingParticipants,
  } = createCustomMatches(otherPrizes, otherBallots, options);

  // TODO possibly match other remaining participants to remaining prizes free from restrictions

  return {
    matches: [...restrictedMatches, ...otherMatches],
    remainingPrizes: [
      ...remainingPrizesFreeFromRestrictions,
      ...otherRemainingPrizes,
    ],
    remainingParticipants: [
      ...remainingParticipantsWithRestrictions,
      ...otherRemainingParticipants,
    ],
  };
}

export function createMatchesWithRestrictions(
  prizes: Prize[],
  ballots: Ballot[],
  options?: MatchingOptions
): MatchingResults {
  const modifiedOptions: MatchingOptions = {
    ...options,
    orderBy: (prizes) =>
      lodashOrderBy(
        prizes,
        (prize) => prize.freeFromRestrictions?.length ?? 0,
        ["asc"]
      ),
    isPrizeEligibleForBallot: (prize, ballot) =>
      intersection(prize.freeFromRestrictions ?? [], ballot.restrictions ?? [])
        .length === (ballot.restrictions?.length ?? 0),
  };

  return createCustomMatches(prizes, ballots, modifiedOptions);
}

function createCustomMatches(
  prizes: Prize[],
  ballots: Ballot[],
  options?: MatchingOptions
): MatchingResults {
  const orderBy =
    options?.orderBy ??
    ((prizes) =>
      lodashOrderBy(prizes, (prize) => prize.ballots.length, ["desc"]));
  const shuffle = options?.shuffle ?? lodashShuffle;
  const isPrizeEligibleForBallot =
    options?.isPrizeEligibleForBallot ?? ((_prize, _ballot) => true);

  const matches: Match[] = [];
  const won = new Set<number>();
  const winners = new Set<string>();

  const ballotsGroupedByPrize = groupBy(ballots, (ballot) => ballot.prizeId);

  const prizesWithBallots = prizes.map((prize) => ({
    ...prize,
    ballots: ballotsGroupedByPrize[prize.id] || [],
  }));

  const orderedPrizes = orderBy(prizesWithBallots);

  orderedPrizes.forEach((prize) => {
    let eligibleBallots = prize.ballots
      .filter((ballot) => !winners.has(ballot.participantId))
      .filter((ballot) => isPrizeEligibleForBallot(prize, ballot));

    const [winningBallot] = shuffle(eligibleBallots);
    if (winningBallot) {
      const { id: prizeId } = prize;
      const { participantId, name, group } = winningBallot;
      winners.add(participantId);
      won.add(prizeId);
      matches.push({
        id: window.crypto.randomUUID(),
        prizeId,
        participantId,
        name,
        group,
        basedOnPreference: true,
      });
    }
  });

  // Look for prizes that haven't been won and match them with ballots of participants who haven't won
  const remainingPrizes = differenceWith(
    orderedPrizes,
    [...won],
    (prize, prizeId) => prize.id === prizeId
  );

  let remainingBallots = differenceWith(
    ballots,
    [...winners],
    (ballot, participantId) => ballot.participantId === participantId
  );

  remainingPrizes.forEach((prize) => {
    const eligibleBallots = remainingBallots.filter((ballot) =>
      isPrizeEligibleForBallot(prize, ballot)
    );
    const [winningBallot] = shuffle(eligibleBallots);
    if (winningBallot) {
      const { id: prizeId } = prize;
      const { participantId, name, group } = winningBallot;
      winners.add(participantId);
      won.add(prizeId);
      matches.push({
        id: window.crypto.randomUUID(),
        prizeId,
        participantId,
        name,
        group,
        basedOnPreference: false,
      });
      // Remove any ballots for that participant
      remainingBallots = remainingBallots.filter(
        (ballot) => ballot.participantId !== winningBallot.participantId
      );
    }
  });

  const allPrizeIds = prizes.map((prize) => prize.id);
  const allParticipantIds = new Set(
    ballots.map((ballot) => ballot.participantId)
  );

  return {
    matches,
    remainingPrizes: difference(allPrizeIds, [...won]),
    remainingParticipants: difference([...allParticipantIds], [...winners]),
  };
}
