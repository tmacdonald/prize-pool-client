import { QrcodeErrorCallback } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { useParams } from "react-router-dom";
import Html5QrcodePlugin from "../../components/Html5QrCodePlugin";
import { useBallotStorage, useEvent } from "../hooks";

export function DelegateCapturePage() {
  const { eventId } = useParams();
  const { item: event } = useEvent(eventId!);
  const { createBallots } = useBallotStorage(eventId!);

  const handleScan = (decodedText: string) => {
    console.log(decodedText);
    const ballots = JSON.parse(decodedText);
    createBallots(...ballots);
  };

  const handleError: QrcodeErrorCallback = (
    errorMessage: string,
    error: Html5QrcodeError
  ) => {
    if (error.type !== 0) {
      console.error(errorMessage, error);
    }
  };

  if (!event) {
    return null;
  }

  return (
    <>
      <div>
        <Html5QrcodePlugin
          config={{ fps: 10, qrbox: { width: 250, height: 250 } }}
          onScan={handleScan}
          onError={handleError}
        />
      </div>
    </>
  );
}
