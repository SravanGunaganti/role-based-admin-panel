import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { IUser } from "../types";

interface AuthContextShape {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hideLabels: boolean;
  handleLabels: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideLabels, setHideLabels] = useState(false);
  const handleLabels = (value: boolean) => {
    setHideLabels(value);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    console.log(JSON.parse(u!)?.role, t);
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: jwt, ...userObj } = res.data;
    setToken(jwt);
    setUser(userObj as IUser);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hideLabels,
        handleLabels,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
