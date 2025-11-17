import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  whatsapp_number: string;
  full_name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (fullName: string, whatsappNumber: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    const storedUser = localStorage.getItem('whatsapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  };

  const login = async (fullName: string, whatsappNumber: string) => {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp_number', whatsappNumber)
      .maybeSingle();

    let userData: User;

    if (existingUser) {
      await supabase
        .from('users')
        .update({
          full_name: fullName,
          last_login_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);

      userData = { ...existingUser, full_name: fullName };
    } else {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          whatsapp_number: whatsappNumber,
          full_name: fullName,
          is_admin: false
        })
        .select()
        .single();

      userData = newUser!;
    }

    localStorage.setItem('whatsapp_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('whatsapp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
