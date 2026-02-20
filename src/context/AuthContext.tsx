import React, { createContext, useContext, useEffect, useState } from "react";
import { checkSession, setAuthToken, getLoginUrl } from "@/lib/api";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // If no backend URL is configured, skip auth and allow preview
    if (!BACKEND_URL) {
      console.warn("[Auth] No VITE_BACKEND_URL set — running in preview mode without authentication.");
      setAuthToken("preview-mode");
      setState({ isAuthenticated: true, isLoading: false });
      return;
    }

    const verify = async () => {
      const result = await checkSession();
      if (result?.token) {
        setAuthToken(result.token);
        setState({ isAuthenticated: true, isLoading: false });
      } else {
        setState({ isAuthenticated: false, isLoading: false });
        window.location.href = getLoginUrl();
      }
    };
    verify();
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="font-display text-lg text-muted-foreground">Verifying session…</p>
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
