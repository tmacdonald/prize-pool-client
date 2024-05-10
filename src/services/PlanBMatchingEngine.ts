import {
  difference,
  differenceWith,
  intersection,
  orderBy as lodashOrderBy,
  shuffle as lodashShuffle,
  partition,
} from "lodash";
import { Match } from "./MatchStorage";
import { Participant } from "./ParticipantStorage";
import { Prize } from "./PrizeStorage";

interface PrizeWithParticipant extends Prize {
  participants: Participant[];
}

interface MatchingOptions {
  orderBy?: (items: PrizeWithParticipant[]) => PrizeWithParticipant[];
  isPrizeEligibleForParticipant?: (
    prize: Prize,
    ballot: Participant
  ) => boolean;
  shuffle?: (items: Participant[]) => Participant[];
}

interface MatchingResults {
  matches: Match[];
  remainingPrizes: string[];
  remainingParticipants: string[];
}

export function generateMatches(
  prizes: Prize[],
  participants: Participant[],
  options?: MatchingOptions
): MatchingResults {
  const [prizesFreeFromRestrictions, otherPrizes] = partition(
    prizes,
    (prize) => (prize.freeFromRestrictions?.length ?? 0) !== 0
  );
  const [participantsWithRestrictions, otherParticipants] = partition(
    participants,
    (participant) => (participant.restrictions?.length ?? 0) !== 0
  );

  const {
    matches: restrictedMatches,
    remainingPrizes: remainingPrizesFreeFromRestrictions,
    remainingParticipants: remainingParticipantsWithRestrictions,
  } = createMatchesWithRestrictions(
    prizesFreeFromRestrictions,
    participantsWithRestrictions,
    options
  );
  const {
    matches: otherMatches,
    remainingPrizes: otherRemainingPrizes,
    remainingParticipants: otherRemainingParticipants,
  } = createCustomMatches(otherPrizes, otherParticipants, options);

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

export function generateMatchesForParticipants(
  existingMatches: Match[],
  prizes: Prize[],
  participants: Participant[]
): MatchingResults {
  const won = new Set(existingMatches.map((m) => m.prizeId));
  const winners = new Set(existingMatches.map((m) => `${m.name}-${m.group}`));

  // prizes that haven't been won
  const remainingPrizes = differenceWith(
    prizes,
    [...won],
    (prize, prizeId) => prize.id === prizeId
  );

  // participants who haven't won
  let remainingParticipants = differenceWith(
    participants,
    [...winners],
    (p, participantId) => `${p.name}-${p.group}` === participantId
  );

  console.log({ remainingPrizes, remainingParticipants });

  return generateMatches(remainingPrizes, remainingParticipants);
}

export function createMatchesWithRestrictions(
  prizes: Prize[],
  participants: Participant[],
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
    isPrizeEligibleForParticipant: (prize, participant) =>
      intersection(
        prize.freeFromRestrictions ?? [],
        participant.restrictions ?? []
      ).length === (participant.restrictions?.length ?? 0),
  };

  return createCustomMatches(prizes, participants, modifiedOptions);
}

function createCustomMatches(
  prizes: Prize[],
  participants: Participant[],
  options?: MatchingOptions
): MatchingResults {
  const shuffle = options?.shuffle ?? lodashShuffle;
  const isPrizeEligibleForParticipant =
    options?.isPrizeEligibleForParticipant ?? ((_prize, _ballot) => true);

  const matches: Match[] = [];
  const won = new Set<string>();
  const winners = new Set<string>();

  prizes.forEach((prize) => {
    const eligibleParticipants = participants.filter(
      (participant) =>
        isPrizeEligibleForParticipant(prize, participant) &&
        !winners.has(`${participant.name}-${participant.group}`)
    );
    const [winningParticipant] = shuffle(eligibleParticipants);
    if (winningParticipant) {
      const { id: prizeId } = prize;
      const { name, group } = winningParticipant;
      winners.add(`${name}-${group}`);
      won.add(prizeId);
      matches.push({
        id: window.crypto.randomUUID(),
        prizeId,
        participantId: `${name}-${group}`,
        name,
        group,
        basedOnPreference: false,
      });
    }
  });

  const allPrizeIds = prizes.map((prize) => prize.id);
  const allParticipantIds = new Set(
    participants.map(({ name, group }) => `${name}-${group}`)
  );

  return {
    matches,
    remainingPrizes: difference(allPrizeIds, [...won]),
    remainingParticipants: difference([...allParticipantIds], [...winners]),
  };
}
