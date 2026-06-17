import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>; // Returns Firebase ID Token
  getOAuthToken: () => string | null; // Returns Google OAuth Access Token
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  getToken: async () => null,
  getOAuthToken: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const cachedAccessTokenRef = useRef<string | null>(null);
  const isSigningInRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        cachedAccessTokenRef.current = null;
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Add Workspace scopes
    provider.addScope("https://www.googleapis.com/auth/drive");
    provider.addScope("https://mail.google.com/");
    provider.addScope("https://www.googleapis.com/auth/calendar");
    provider.addScope("https://www.googleapis.com/auth/contacts");
    provider.addScope("https://www.googleapis.com/auth/documents");
    provider.addScope("https://www.googleapis.com/auth/meetings.space.created");

    try {
      isSigningInRef.current = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessTokenRef.current = credential.accessToken;
      }
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      isSigningInRef.current = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessTokenRef.current = null;
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const getOAuthToken = () => {
    return cachedAccessTokenRef.current;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, getToken, getOAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
