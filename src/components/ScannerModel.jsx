import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const ScannerModel = ({ barcodeScannerValue }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasPermission(true);
        stream.getTracks().forEach((track) => track.stop()); 
      } catch (error) {
        setHasPermission(false);
        console.error("Permission denied:", error);
      }
    };

    checkPermissions();
  }, []);

  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      detectedCodes.forEach((code) => {
        console.log("Scanned Code Raw Value:", code.rawValue);
        barcodeScannerValue(code.rawValue);
      });
    }
  };

  const onError = (error) => {
    console.error("Error scanning:", error);
    if (error.name === "NotAllowedError") {
      console.error("Permission to access the camera was denied.");
    } else if (error.name === "NotFoundError") {
      console.error("No camera was found.");
    } else {
      console.error("An unknown error occurred:", error);
    }
  };

  if (hasPermission === null) {
    return <div>Loading...</div>; 
  }

  if (hasPermission === false) {
    return (
      <div>
        Camera permission denied. Please allow camera access to scan the
        barcode.
      </div>
    );
  }

  const barcodeFormats = [
    "code_128",
    "code_39",
    "code_93",
    "codabar",
    "ean_13",
    "ean_8",
    "upc_a",
    "upc_e",
    "itf",
  ];

  const scannerStyles = {
    container: {
      width: "100%",
      maxWidth: "640px", // For desktop screens
      height: "auto",
    },
    video: {
      width: "100%",
      height: "auto",
    },
  };

  return (
    <div className="w-full flex justify-center">
      <Scanner
        formats={barcodeFormats}
        onScan={handleScan}
        onError={onError}
        className="w-full max-w-lg"
        styles={scannerStyles}
      />
    </div>
  );
};

export default ScannerModel;
