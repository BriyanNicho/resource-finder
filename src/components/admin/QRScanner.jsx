import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import './QRScanner.css'; // We'll create this CSS next

const QRScanner = ({ onScan, onClose }) => {
    const scannerRef = useRef(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        // Initialize scanner
        // "reader" is the ID of the HTML element
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Success callback
                onScan(decodedText);
                scanner.clear(); // Stop scanning on success
            },
            (errorMessage) => {
                // Error callback (optional, valid errors happen when no QR code found)
                // We typically ignore frame errors unless we want to debug
                // setScanError(errorMessage);
            }
        );

        scannerRef.current = scanner;

        // Cleanup function
        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear();
                } catch (e) {
                    console.error("Error clearing scanner", e);
                }
            }
        };
    }, [onScan]);

    return (
        <div className="qr-scanner-overlay">
            <div className="qr-scanner-modal">
                <div className="qr-header">
                    <div className="flex items-center gap-sm">
                        <Camera size={20} className="text-primary" />
                        <h3>Scan QR Code</h3>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="qr-body">
                    <div id="reader" width="100%"></div>
                    <p className="scanner-instruction">Arahkan kamera ke QR Code Booking</p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
