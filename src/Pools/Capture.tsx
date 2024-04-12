import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { useEffect, useState } from "react";
import "./App.css";
import Html5QrcodePlugin from "../components/Html5QrCodePlugin";
import { Notifications } from "../components/Notifications";
import { PrizeControls } from "../components/PrizeControls";
import { Ticket, submitBallot } from "../services/api";

const numPrizes = 5;

function CapturePage() {
  const [notifications, setNotifications] = useState<string[]>([]);
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
          await submitBallot(prizeId, newTicket);
          setTicket([newTicket, newTicket]);
          setNotifications((existingNotifications) =>
            [
              ...existingNotifications,
              JSON.stringify({ ...newTicket, prizeId }),
            ].slice(-3)
          );
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
        <Notifications notifications={notifications} />
      </div>
    </>
  );
}

export default CapturePage;
