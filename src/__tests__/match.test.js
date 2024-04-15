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

describe("createMatches", () => {
  it("should return an empty array if given empty arrays", () => {
    const matches = createMatches([], []);
    expect(matches).toEqual({
      matches: [],
      remainingPrizes: [],
      remainingParticipants: [],
    });
  });

  it("should match if there is a single prize and a single ticket", () => {
    const prizes = [{ id: 1 }];
    const ballots = [createBallot(1, 2, 1)];

    const matches = createMatches(prizes, ballots);
    expect(matches).toEqual({
      matches: [{ prizeId: 1, participantId: 2 }],
      remainingPrizes: [],
      remainingParticipants: [],
    });
  });

  describe("identity shuffle function", () => {
    it("should match the first ballot", () => {
      const prizes = [{ id: 1 }];
      const ballots = [createBallot(1, 2, 1), createBallot(1, 3, 1)];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([{ prizeId: 1, participantId: 2 }]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([3]);
    });

    it("should match two prizes to two ballots", () => {
      const prizes = [{ id: 1 }, { id: 2 }];
      const ballots = [createBallot(2, 3, 1), createBallot(1, 4, 1)];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 4 },
        { prizeId: 2, participantId: 3 },
      ]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([]);
    });

    it("should match a remaining prize to a remaining participant", () => {
      const prizes = [{ id: 1 }, { id: 2 }];
      const ballots = [createBallot(1, 3, 1), createBallot(1, 4, 1)];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 3 },
        { prizeId: 2, participantId: 4 },
      ]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([]);
    });

    it("should match two prizes to three participants", () => {
      const prizes = [{ id: 1 }, { id: 2 }];
      const ballots = [
        createBallot(1, 3, 1),
        createBallot(1, 4, 1),
        createBallot(1, 5, 1),
      ];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 3 },
        { prizeId: 2, participantId: 4 },
      ]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([5]);
    });

    it("should match three prizes to two participants", () => {
      const prizes = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ballots = [createBallot(1, 4, 1), createBallot(1, 5, 1)];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 4 },
        { prizeId: 2, participantId: 5 },
      ]);
      expect(remainingPrizes).toEqual([3]);
      expect(remainingParticipants).toEqual([]);
    });
  });
});
