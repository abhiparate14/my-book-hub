import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // If no backend URL is configured, skip auth and allow preview
    if (!BACKEND_URL) {
      console.warn(
        "[Auth] No VITE_BACKEND_URL set — running in preview mode without authentication.",
      );
      setAuthToken("preview-mode");
      setState({ isAuthenticated: true, isLoading: false });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setAuthToken(token);
      setState({ isAuthenticated: true, isLoading: false });
      // Remove token from URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Redirect to backend check-session to verify or initiate SSO flow
      window.location.href = `${BACKEND_URL}/auth/check-session?redirect_uri=${
        encodeURIComponent(window.location.href)
      }`;
    }
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="font-display text-lg text-muted-foreground">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};
