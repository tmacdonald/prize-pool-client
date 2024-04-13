import { createMatches } from "../services/match";

describe("createMatches", () => {
  it("should return an empty array if given empty arrays", () => {
    const matches = createMatches([], []);
    expect(matches).toEqual([]);
  });
});
