import { QrcodeErrorCallback } from "html5-qrcode";
import Html5QrcodePlugin from "./components/Html5QrCodePlugin";
import { Html5QrcodeError } from "html5-qrcode/esm/core";
import { Match } from "./services/MatchStorage";
import { useState } from "react";
import { MatchesTable } from "./Events/GroupedMatches";

export const ScanPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  const handleScan = (decodedText: string) => {
    const parsedMatches = JSON.parse(decodedText) as Match[];
    setMatches(parsedMatches);
  };

  const handleError: QrcodeErrorCallback = (
    errorMessage: string,
    error: Html5QrcodeError
  ) => {
    if (error.type !== 0) {
      console.error(errorMessage, error);
    }
  };

  return (
    <div>
      <Html5QrcodePlugin
        config={{ fps: 10, qrbox: { width: 250, height: 250 } }}
        onScan={handleScan}
        onError={handleError}
      />
      <MatchesTable matches={matches} />
    </div>
  );
};
