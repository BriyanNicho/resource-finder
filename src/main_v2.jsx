import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// DEBUG: Verify JS Execution
console.log('Main V2 is executing - APP WITH ERROR BOUNDARY');

class DebugErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, background: '#fee', color: '#c00' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <DebugErrorBoundary>
            <App />
        </DebugErrorBoundary>
    </StrictMode>,
)
