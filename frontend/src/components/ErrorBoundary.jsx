
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  // Update state when a child component throws an error
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  // Log error details for debugging
  componentDidCatch(error, errorInfo) {
    console.error(
      'SmartCart AI UI Error caught:',
      error,
      errorInfo
    );
  }

  // Reset the error boundary and return to the home page
  handleReset = () => {
    this.setState(
      {
        hasError: false,
        error: null,
      },
      () => {
        window.location.href = '/';
      }
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            margin: '40px auto',
            maxWidth: '500px',
            border: '1px solid #E2E8F0',
          }}
        >
          <AlertTriangle
            size={36}
            color="#DC2626"
            style={{ marginBottom: '12px' }}
          />

          <h2 style={{ fontSize: '16px', margin: '0 0 8px' }}>
            Something went wrong
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: '#64748B',
              marginBottom: '20px',
            }}
          >
            An unhandled UI component error occurred. Our team has been
            notified.
          </p>

          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            <RefreshCw size={14} />
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
