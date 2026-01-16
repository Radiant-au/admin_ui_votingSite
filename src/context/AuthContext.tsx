import { createContext, useContext, useMemo, useState } from "react";
import { apiJson, clearToken, getToken, setToken } from "@/api/apiClient";
import { jwtDecode } from "jwt-decode";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: { username: string; role: string } | null;
};

type AdminLoginResponse = { token: string };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with token from localStorage
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const login = async (username: string, password: string): Promise<void> => {
    const { token: newToken } = await apiJson<AdminLoginResponse>(
      "/auth/Alogin",
      { username, password },
      { auth: false }
    );
  
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    clearToken();
    setTokenState(null); // Update state to trigger re-render
  };

  const user = useMemo(() => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode<{ username: string; role: string }>(token);
      return decodedToken;
    } catch (error) {
      console.error("Failed to decode token:", error);
      clearToken();
      setTokenState(null);
      return null;
    }
  }, [token]);

  const value: AuthContextValue = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      user,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};