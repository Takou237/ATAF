import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ATAF] Erreur de rendu :', error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleHome = (): void => {
    window.location.assign('/');
  };

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3BAA35]">ATAF</p>
          <h1 className="mt-2 text-2xl font-bold text-[#0D2B4E]">Cette section n'a pas pu s'afficher</h1>
          <p className="mt-2 text-sm text-slate-600">
            Le reste du site reste utilisable : choisissez une autre page dans le menu, ou réessayez ci-dessous.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Si vous utilisez un traducteur automatique ou une extension de navigateur, désactivez-le pour ce site :
            ces outils modifient la page et peuvent provoquer cette erreur.
          </p>
          <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-slate-900 px-4 py-3 text-xs leading-relaxed text-slate-100">
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-md bg-[#3BAA35] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2D8A28]"
            >
              Réessayer
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Recharger la page
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
}
