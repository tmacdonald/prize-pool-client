import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import Html5QrcodePlugin from "../components/Html5QrCodePlugin";
import { PrizeControls } from "../components/PrizeControls";
import { Ballot, getBallotStorage } from "../services/BallotStorage";
import { Ticket } from "../services/api";
import { useSimpleCrudStorage } from "../services/hooks";
import { usePool } from "./hooks";

const numPrizes = 5;

export function CapturePage() {
  const { poolId } = useParams();
  const pool = usePool(poolId!);

  const ballotStorage = useMemo(() => getBallotStorage(poolId!), [poolId]);
  const { createItem: createBallot } = useSimpleCrudStorage(ballotStorage);

  const [prizeId, setPrizeId] = useState<number>(1);
  const [ticket, setTicket] = useState<
    [Ticket | undefined, Ticket | undefined]
  >([undefined, undefined]);

  const handleScan = (decodedText: string) => {
    setTicket(([ticketBefore]) => [
      JSON.parse(decodedText) as Ticket,
      ticketBefore,
    ]);
  };

  /**
   * You may be wondering about this useEffect
   * The issue that I ran into was that, once the QR code scanner has been set up, the onScan function
   * can't easily be changed, but I needed to update the prizeId without regenerating the onScan function
   */
  useEffect(() => {
    const submitTicket = async () => {
      /**
       * This was another interesting case where I wanted to make sure the ticket was changing
       * before submitting another API request. I needed to store the previous ticket and the new ticket
       * and verify that we weren't changing the logic. This could be done with a deep equals but I didn't
       * want to bring in a new library
       */
      const [newTicket, previousTicket] = ticket;
      if (!!newTicket) {
        if (
          !previousTicket ||
          !(
            previousTicket.participantId === newTicket.participantId &&
            previousTicket.ticketId === newTicket.ticketId
          )
        ) {
          const ballot: Ballot = {
            prizeId,
            participantId: newTicket.participantId,
            ticketId: newTicket.ticketId,
            name: newTicket.name,
            group: newTicket.homeroom,
          };
          await createBallot(ballot);
          setTicket([newTicket, newTicket]);
        }
      }
    };

    submitTicket();
  }, [prizeId, ticket]);

  const handleError: QrcodeErrorCallback = (
    errorMessage: string,
    error: Html5QrcodeError
  ) => {
    if (error.type !== 0) {
      console.error(errorMessage, error);
    }
  };

  if (!pool) {
    return;
  }

  return (
    <>
      <div>
        <PrizeControls
          value={prizeId}
          onChange={setPrizeId}
          minPrizeId={1}
          maxPrizeId={numPrizes}
        />
        <Html5QrcodePlugin
          config={{ fps: 10, qrbox: { width: 250, height: 250 } }}
          onScan={handleScan}
          onError={handleError}
        />
      </div>
    </>
  );
}
