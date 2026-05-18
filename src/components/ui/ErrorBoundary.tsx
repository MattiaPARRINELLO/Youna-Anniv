import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-darkest flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="font-display text-2xl text-gold mb-4">Oups...</h1>
            <p className="text-cream/60 mb-4">Quelque chose s'est mal passé.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gold/20 text-gold rounded-full hover:bg-gold/30 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}