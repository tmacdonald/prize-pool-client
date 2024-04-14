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
    const ballots = [createBallot(1, 2, 1, "A")];

    const matches = createMatches(prizes, ballots);
    expect(matches).toEqual({
      matches: [{ prizeId: 1, participantId: 2, name: "A" }],
      remainingPrizes: [],
      remainingParticipants: [],
    });
  });

  describe("identity shuffle function", () => {
    it("should match the first ballot", () => {
      const prizes = [{ id: 1 }];
      const ballots = [createBallot(1, 2, 1, "A"), createBallot(1, 3, 1, "B")];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([{ prizeId: 1, participantId: 2, name: "A" }]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([3]);
    });

    it("should match two prizes to two ballots", () => {
      const prizes = [{ id: 1 }, { id: 2 }];
      const ballots = [createBallot(2, 3, 1, "A"), createBallot(1, 4, 1, "B")];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 4, name: "B" },
        { prizeId: 2, participantId: 3, name: "A" },
      ]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([]);
    });

    it("should match a remaining prize to a remaining participant", () => {
      const prizes = [{ id: 1 }, { id: 2 }];
      const ballots = [createBallot(1, 3, 1, "A"), createBallot(1, 4, 1, "B")];

      const { matches, remainingPrizes, remainingParticipants } = createMatches(
        prizes,
        ballots,
        { shuffle: (x) => x }
      );
      expect(matches).toEqual([
        { prizeId: 1, participantId: 3, name: "A" },
        { prizeId: 2, participantId: 4, name: "B" },
      ]);
      expect(remainingPrizes).toEqual([]);
      expect(remainingParticipants).toEqual([]);
    });
  });
});
