import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("botTripUser"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("botTripToken")));

  const logout = useCallback(() => {
    localStorage.removeItem("botTripToken");
    localStorage.removeItem("botTripUser");
    setUser(null);
    setLoading(false);
  }, []);

  const saveSession = useCallback((data) => {
    localStorage.setItem("botTripToken", data.token);
    localStorage.setItem("botTripUser", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("botTripToken");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("botTripUser", JSON.stringify(data.user));
      })
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  useEffect(() => {
    window.addEventListener("bot-trip-unauthorized", logout);
    return () => window.removeEventListener("bot-trip-unauthorized", logout);
  }, [logout]);

  const value = useMemo(
    () => ({ user, setUser, loading, saveSession, logout }),
    [user, loading, saveSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
