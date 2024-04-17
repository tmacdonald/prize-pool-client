import { intersection, orderBy } from "lodash";
import { createMatches } from "../services/match";

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
  const numPrizes = 10;
  const numParticipants = 10;

  const possibleRestrictions = ["gluten", "soy", "dairy", "egg"];
  const restrictionCombinations = combinations(possibleRestrictions);
  console.log({ restrictionCombinations });

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
        ? restrictionCombinations[
            Math.floor(Math.random() * restrictionCombinations.length)
          ]
        : undefined;
    return {
      participantId: i + 1,
      name: `Participant ${i + 1}`,
      restrictions,
    };
  });

  const ballots = participants.flatMap((participant) => {
    return new Array(10).fill(0).map((x, i) => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      return {
        prizeId: prize.id,
        ...participant,
        ticketId: i + 1,
      };
    });
  });

  const { matches, remainingPrizes, remainingParticipants } = createMatches(
    prizes,
    ballots
  );

  console.table(prizes);
  console.table(participants);
  console.table(matches);
  console.log({ remainingPrizes, remainingParticipants });
});
