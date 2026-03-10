import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  auth,
  loginWithEmailPassword,
  registerWithEmailPassword,
  logoutUser,
  signInWithGoogle
} from "@/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserCredential } from "firebase/auth";

type User = {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // ✅ Load session from sessionStorage or Firebase
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    const storedEmail = sessionStorage.getItem("user_email");
    const storedName = sessionStorage.getItem("user_name");

    if (storedUserId && storedEmail && storedName) {
      const currentUser: User = {
        id: storedUserId,
        email: storedEmail,
        name: storedName,
      };
      setUser(currentUser);
      setIsLoading(false);
      return;
    }

    // ✅ Fallback to Firebase user session
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const currentUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
        };
        setUser(currentUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ Login function
  const login = async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
      throw error;
    }
  };

  // ✅ Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      await registerWithEmailPassword(email, password, name);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Could not create account",
      });
      throw error;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await logoutUser();

      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("user_email");
      sessionStorage.removeItem("user_name");

      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Could not log out",
      });
      throw error;
    }
  };

  // ✅ Google Sign-In
  const googleSignIn = async (): Promise<UserCredential> => {
    try {
      const result = await signInWithGoogle();

      toast({
        title: "Logged in with Google",
        description: "Welcome!",
      });

      return result;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In failed",
        description: error.message || "Could not log in with Google",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
