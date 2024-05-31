import React, { createContext, useState, useEffect, ReactNode } from "react";

interface ContextProviderProps {
  children: ReactNode;
}

export interface AuthContextType {
  auth: SessionProps | null;
  setAuth: React.Dispatch<React.SetStateAction<SessionProps | null>>;
}

export interface SessionProps {
  uid: string;
  email: string;
  token: TokenData;
}

interface TokenData {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextType | null>({
  auth: null,
  setAuth: () => {},
});

const ContextProvider = ({ children }: ContextProviderProps) => {
  const [auth, setAuth] = useState<SessionProps | null>(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, ContextProvider };
