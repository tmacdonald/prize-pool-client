import { QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './components/Html5QrCodePlugin';
import { Notifications } from './components/Notifications';
import { PrizeControls } from './components/PrizeControls';
import { Ticket, submitBallot } from './services/api';

const numPrizes = 5;

function App() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [prizeId, setPrizeId] = useState<number>(1);

  const handleScan: QrcodeSuccessCallback = (decodedText: string) => {
    setNotifications(existingNotifications => {
      const [lastNotification] = existingNotifications.slice(-1);
      if (!lastNotification || lastNotification !== decodedText) {
        const ticket = JSON.parse(decodedText) as Ticket;
        submitBallot(prizeId, ticket);
        return [ ...existingNotifications, decodedText ];
      }
      return existingNotifications;
    });
  }

  const handleError: QrcodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
    if (error.type !== 0) {
      console.error(errorMessage, error);
    }
    
  }

  return (
    <>
      <div>
        <PrizeControls value={prizeId} onChange={setPrizeId} minPrizeId={1} maxPrizeId={numPrizes} />
        <Html5QrcodePlugin config={{ fps: 10, qrbox: { width: 250, height: 250 } }} onScan={handleScan} onError={handleError} />
        <Notifications notifications={notifications} />
      </div>
    </>
  )
}

export default App;
