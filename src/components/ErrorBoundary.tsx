import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background text-on-surface">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold mb-4">Something went wrong.</h2>
            <p className="mb-2">Please reload the page or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-primary text-black rounded-full font-bold"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}
