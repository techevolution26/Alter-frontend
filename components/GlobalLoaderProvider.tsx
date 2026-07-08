"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface GlobalLoaderContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  resetLoading: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextValue | null>(null);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastRouteRef = useRef(`${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);

  const startLoading = useCallback(() => {
    setLoadingCount((current) => current + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((current) => Math.max(current - 1, 0));
  }, []);

  const resetLoading = useCallback(() => {
    setLoadingCount(0);
  }, []);

  useEffect(() => {
    const currentRoute = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (currentRoute !== lastRouteRef.current) {
      lastRouteRef.current = currentRoute;
      resetLoading();
    }
  }, [pathname, resetLoading, searchParams]);

  const value = useMemo(
    () => ({
      isLoading: loadingCount > 0,
      startLoading,
      stopLoading,
      resetLoading,
    }),
    [loadingCount, resetLoading, startLoading, stopLoading]
  );

  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-busy={value.isLoading}
        className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-vigil/70 backdrop-blur-sm transition-opacity duration-200 ${
          value.isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-linen shadow-lg">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-linen/30 border-t-linen" />
          <span>Loading...</span>
        </div>
      </div>
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoaderContext);

  if (!context) {
    throw new Error("useGlobalLoader must be used inside GlobalLoaderProvider");
  }

  return context;
}
