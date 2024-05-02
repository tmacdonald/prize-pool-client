import { intersection, keyBy, orderBy } from "lodash";
import { generateMatches } from "../services/match";

function createBallot(prizeId, participantId, ticketId, name, group) {
  return {
    prizeId,
    participantId,
    ticketId,
    name,
    group,
  };
}

const combinations = (array) => {
  return array.reduce(
    (acc, curr) => [...acc, ...acc.map((r) => [...r, curr])],
    [[]]
  );
};

it("should work", () => {
  const numPrizes = 500;
  const numParticipants = 500;
  const numBallotsPerParticipant = 10;

  const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];
  const restrictionCombinations = combinations(possibleRestrictions);

  const prizes = new Array(numPrizes).fill(0).map((x, i) => {
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

  const participants = new Array(numParticipants).fill(0).map((x, i) => {
    const restrictions =
      Math.random() < 0.2
        ? [
            possibleRestrictions[
              Math.floor(Math.random() * possibleRestrictions.length)
            ],
          ]
        : undefined;
    return {
      participantId: i + 1,
      name: `Participant ${i + 1}`,
      restrictions,
    };
  });

  const ballots = participants.flatMap((participant) => {
    return new Array(numBallotsPerParticipant).fill(0).map((x, i) => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      return {
        prizeId: prize.id,
        ...participant,
        ticketId: i + 1,
      };
    });
  });

  const { matches, remainingPrizes, remainingParticipants } = generateMatches(
    prizes,
    ballots
  );

  const prizeMap = keyBy(prizes, "id");
  const participantMap = keyBy(participants, "participantId");

  const matchTable = matches.map(({ prizeId, participantId }) => {
    const prize = prizeMap[prizeId];
    const participant = participantMap[participantId];

    // const overlap = intersection(
    //   prize.freeFromRestrictions ?? [],
    //   participant.restrictions ?? []
    // );
    return {
      participant: participant.name,
      restrictions: participant.restrictions,
      prize: prize.id,
      freeFromRestrictions: prize.freeFromRestrictions,
    };
  });

  // console.table(prizes);
  // console.table(participants);
  console.table(matchTable);
  // console.table(matches);
  console.log({ remainingPrizes, remainingParticipants });
});
