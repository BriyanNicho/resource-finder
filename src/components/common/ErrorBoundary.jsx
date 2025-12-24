import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-lg text-center bg-primary">
                    <div className="p-xl bg-card rounded-xl border border-primary shadow-xl max-w-md w-full">
                        <div className="flex justify-center mb-md text-danger">
                            <AlertTriangle size={48} />
                        </div>
                        <h2 className="text-xl font-bold mb-sm text-primary">Oops! Terjadi Kesalahan</h2>
                        <p className="text-secondary mb-lg">
                            Gagal memuat halaman. Ini mungkin masalah koneksi internet.
                        </p>
                        <div className="p-md bg-elevated rounded-md mb-lg text-left overflow-auto max-h-32 text-xs font-mono text-tertiary">
                            {this.state.error?.toString()}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary w-full"
                        >
                            <RefreshCw size={18} />
                            Muat Ulang Halaman
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
