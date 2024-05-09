import { Snackbar } from "@mui/material";
import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { intersection, keyBy } from "lodash";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Html5QrcodePlugin from "../../components/Html5QrCodePlugin";
import { PrizeControls } from "../../components/PrizeControls";
import { Match } from "../../services/MatchStorage";
import { Ticket } from "../../services/api";
import { useBeep, useEvent, useMatchStorage, usePrizeStorage } from "../hooks";

export function CapturePage() {
  const { eventId } = useParams();
  const { item: event } = useEvent(eventId!);

  const { matches, createMatches } = useMatchStorage(eventId!);
  const { prizes } = usePrizeStorage(eventId!);
  const prizeLookup = keyBy(prizes, "id");

  const [prizeId, setPrizeId] = useState<number>(1);
  const [ticket, setTicket] = useState<
    [Ticket | undefined, Ticket | undefined]
  >([undefined, undefined]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const playBeep = useBeep();

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
          setTicket([newTicket, newTicket]);

          // has participant won?
          const prizeWon = matches.some((match) => match.prizeId === prizeId);
          const participantWon = matches.some(
            (match) => match.participantId === newTicket.childId
          );

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

          const prize = prizeLookup[prizeId];
          console.log(
            newTicket.restrictions,
            intersection(
              prize.freeFromRestrictions ?? [],
              newTicket.restrictions ?? []
            )
          );
          if (
            (newTicket.restrictions?.length ?? 0) > 0 &&
            intersection(
              prize.freeFromRestrictions ?? [],
              newTicket.restrictions ?? []
            ).length !== (newTicket.restrictions?.length ?? 0)
          ) {
            setSnackbarMessage(
              "Cake has allergens not allowed for participant"
            );
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

          await createMatches(match);
          playBeep();

          setSnackbarMessage("Match!");
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
