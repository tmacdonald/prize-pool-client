import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { useEffect, useState } from "react";
import Html5QrcodePlugin from "../../components/Html5QrCodePlugin";
import { PrizeControls } from "../../components/PrizeControls";
import { Ballot } from "../../services/BallotStorage";
import { Ticket } from "../../services/api";
import { Snackbar } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDelegatedBallotStorage } from "../hooks";

export function DelegatedCapturePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const start = parseInt(searchParams.get("start") ?? "1", 10);
  const end = parseInt(searchParams.get("end") ?? "1", 10);

  const { createBallots } = useDelegatedBallotStorage();

  const [prizeId, setPrizeId] = useState<number>(start);
  const [ticket, setTicket] = useState<
    [Ticket | undefined, Ticket | undefined]
  >([undefined, undefined]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleScan = (decodedText: string) => {
    console.log(decodedText);
    try {
      setTicket(([ticketBefore]) => [
        JSON.parse(decodedText) as Ticket,
        ticketBefore,
      ]);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(`${error}`);
      setSnackbarOpen(true);
    }
  };

  const handleComplete = () => {
    navigate("../delegated/display");
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
            previousTicket.childId === newTicket.childId &&
            previousTicket.ticketId === newTicket.ticketId
          )
        ) {
          const ballot: Ballot = {
            prizeId,
            participantId: newTicket.childId,
            ticketId: newTicket.ticketId,
            name: newTicket.name,
            group: newTicket.group,
            restrictions: newTicket.restrictions,
          };
          await createBallots(ballot);
          setTicket([newTicket, newTicket]);

          setSnackbarMessage("Created ballot");
          setSnackbarOpen(true);
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
        <Html5QrcodePlugin
          config={{ fps: 10, qrbox: { width: 250, height: 250 } }}
          onScan={handleScan}
          onError={handleError}
        />
        <PrizeControls
          value={prizeId}
          onChange={setPrizeId}
          minPrizeId={start}
          maxPrizeId={end}
          onComplete={handleComplete}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </div>
    </>
  );
}
