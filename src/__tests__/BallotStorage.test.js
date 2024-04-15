import { BallotStorage } from "../services/BallotStorage";
import { SimpleInMemoryStorage } from "../services/CrudStorage";

describe("BallotStorage", () => {
  const ballotStorage = new BallotStorage(new SimpleInMemoryStorage("N/A"));

  it("should start with no ballots", async () => {
    const ballots = await ballotStorage.list();
    expect(ballots).toEqual([]);
  });

  it("should list a ballot that has been created", async () => {
    const ballot = {
      prizeId: 1,
      participantId: 1,
      ticketId: 1,
    };

    await ballotStorage.create(ballot);
    const ballots = await ballotStorage.list();
    expect(ballots).toEqual([{ prizeId: 1, participantId: 1, ticketId: 1 }]);
  });
});
