import { useState, useEffect } from 'react'
import './App.css'
import Html5QrcodePlugin from './components/Html5QrCodePlugin';
import { Html5QrcodeResult, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';

function App() {
  const handleScan: QrcodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
    console.log({ decodedText, result });
  }

  const handleError: QrcodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
    if (error.type !== 0) {
      console.error(errorMessage, error);
    }
    
  }

  return (
    <>
      <div>
        <Html5QrcodePlugin config={{ fps: 10 }} onScan={handleScan} onError={handleError} />
      </div>
    </>
  )
}

export default App
