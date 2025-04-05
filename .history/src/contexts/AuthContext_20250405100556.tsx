import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: any;
  setUser: (user: any) => void;
  networkId: string | null;  // Add networkId to the context type
  setNetworkId: (networkId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(sessionStorage.getItem('accessToken') || null);
  const [user, setUser] = useState<any>(JSON.parse(sessionStorage.getItem('user') || 'null'));

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
