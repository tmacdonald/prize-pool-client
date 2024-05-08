import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { useEffect, useMemo, useState } from "react";
import Html5QrcodePlugin from "../../components/Html5QrCodePlugin";
import { PrizeControls } from "../../components/PrizeControls";
import { Ticket } from "../../services/api";
import { Snackbar } from "@mui/material";
import { useEvent, useMatchStorage, usePrizeStorage } from "../hooks";
import { useParams } from "react-router";
import { Match } from "../../services/MatchStorage";
import beep from "../../assets/654321__gronkjaer__correctch_new.mp3";

export function CapturePage() {
  const { eventId } = useParams();
  const event = useEvent(eventId!);

  const { matches, createMatches } = useMatchStorage(eventId!);
  const { prizes } = usePrizeStorage(eventId!);

  const [prizeId, setPrizeId] = useState<number>(1);
  const [ticket, setTicket] = useState<
    [Ticket | undefined, Ticket | undefined]
  >([undefined, undefined]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const audio = useMemo(() => new Audio(beep), []);

  const handleScan = (decodedText: string) => {
    console.log(decodedText);
    try {
      const newTicket = JSON.parse(decodedText) as Ticket;
      setTicket(([ticketBefore]) => [newTicket, ticketBefore]);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(`${error}`);
      setSnackbarOpen(true);
    }
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
      console.log({ newTicket, previousTicket });
      if (!!newTicket) {
        if (
          !previousTicket ||
          !(
            previousTicket.childId === newTicket.childId &&
            previousTicket.ticketId === newTicket.ticketId
          )
        ) {
          console.log("processing ticket");

          // has participant won?
          const prizeWon = matches.some((match) => match.prizeId === prizeId);
          const participantWon = matches.some(
            (match) => match.participantId === newTicket.childId
          );

          console.log({ prizeWon, participantWon });

          if (prizeWon) {
            setSnackbarMessage("Cake has already been won");
            setSnackbarOpen(true);
            return;
          }

          if (participantWon) {
            setSnackbarMessage("Participant has already won a cake");
            setSnackbarOpen(true);
            return;
          }

          const match: Match = {
            prizeId,
            participantId: newTicket.childId,
            name: newTicket.name,
            group: newTicket.group,
            basedOnPreference: false,
          };

          audio.play();
          await createMatches(match);

          setSnackbarMessage("Match!");
          setSnackbarOpen(true);

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

  if (!event) {
    return;
  }

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
          minPrizeId={1}
          maxPrizeId={prizes.length}
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
