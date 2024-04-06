import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface IConfig {
  fps: number;
  qrbox?: {
    width: number;
    height: number;
  };
  aspectRatio?: any;
  disableFlip?: boolean;
}

interface IProps {
  config: IConfig;
  verbose?: boolean;
  onScan: QrcodeSuccessCallback;
  onError: QrcodeErrorCallback;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (newConfig: IConfig): Html5QrcodeScannerConfig => {
    let config: Html5QrcodeScannerConfig = {
      fps: newConfig.fps
    };
    if (newConfig.fps) {
        config.fps = newConfig.fps;
    }
    if (newConfig.qrbox) {
        config.qrbox = newConfig.qrbox;
    }
    if (newConfig.aspectRatio) {
        config.aspectRatio = newConfig.aspectRatio;
    }
    if (newConfig.disableFlip !== undefined) {
        config.disableFlip = newConfig.disableFlip;
    }
    return config;
};



const Html5QrcodePlugin = ({ config: propsConfig, verbose = false, onScan, onError } : IProps) => {

    useEffect(() => {
        // when component mounts
        const config = createConfig(propsConfig);
        verbose = verbose === true;
        // Suceess callback is required.
        if (!(onScan)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(onScan, onError);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;