"use client";

import {
  Component,
  Suspense,
  type ComponentType,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export interface QueryErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback: ComponentType<QueryErrorFallbackProps>;
}

interface ClientQueryBoundaryProps {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback: ComponentType<QueryErrorFallbackProps>;
}

interface InnerErrorBoundaryProps extends QueryErrorBoundaryProps {
  onReset: () => void;
}

interface InnerErrorBoundaryState {
  error: unknown;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

class InnerErrorBoundary extends Component<
  InnerErrorBoundaryProps,
  InnerErrorBoundaryState
> {
  state: InnerErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): InnerErrorBoundaryState {
    return { error };
  }

  resetErrorBoundary = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      const Fallback = this.props.fallback;

      return (
        <Fallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <InnerErrorBoundary fallback={fallback} onReset={reset}>
      {children}
    </InnerErrorBoundary>
  );
}

export function ClientQueryBoundary({
  children,
  loadingFallback,
  errorFallback,
}: ClientQueryBoundaryProps) {
  const isMounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!isMounted) {
    return loadingFallback;
  }

  return (
    <QueryErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </QueryErrorBoundary>
  );
}
