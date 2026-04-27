import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const hasToken = Boolean(localStorage.getItem("tg_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasToken);

  useEffect(() => {
    if (!hasToken) {
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        localStorage.removeItem("tg_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [hasToken]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const { token, user: loggedInUser } = res.data.data;
    localStorage.setItem("tg_token", token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/api/auth/register", { name, email, password });
    const { token, user: newUser } = res.data.data;
    localStorage.setItem("tg_token", token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("tg_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
