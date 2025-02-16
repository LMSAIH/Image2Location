import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: object | null;
  setUser: (user: object | null) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  refreshAuth: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<object | null>(null);

  const refreshAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8000/verify", {
        withCredentials: true,
      });

      console.log(response.data)
      if (response && response.data) {
        const data = response.data;
        setUser(data.user);
        
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);