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
  verify:()=>Promise<void>;
  authChecked: boolean;
}

const AuthContext = createContext<AuthContextShape>({} as AuthContextShape);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideLabels, setHideLabels] = useState(false);
  const [authChecked, setAuthChecked]= useState(false);
  const handleLabels = (value: boolean) => {
    setHideLabels(value);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      verify();
      setToken(t);
    }else{
      logout();
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try{
    const res = await api.post("/auth/login", { email, password });
    const { token: jwt, ...userObj } = res.data;
    setToken(jwt);
    setUser(userObj as IUser);
    localStorage.setItem("token", jwt);
    return userObj;
    }catch(e:any){
      throw new Error(
        e.response?.data?.message || "Failed To Login"
      );
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const verify =async()=>{
    try {
      const res = await api.get("/auth/verify");
      const {name,email,role} = res.data.user;
      setUser({name,email,role} as IUser);
      setAuthChecked(true);
      console.log(res.data.user);
      return res.data;
    } catch (error:any) {
      logout();
      setAuthChecked(false);
      console.error(error.response?.data?.message);
    }

  }

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
        verify,
        authChecked     
      }}>
      {children}
    </AuthContext.Provider>
  );
};
