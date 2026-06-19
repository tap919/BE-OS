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
    // Restore cached oauth token from session storage if it exists
    const storedOauthToken = sessionStorage.getItem("google_oauth_token");
    if (storedOauthToken) {
      cachedAccessTokenRef.current = storedOauthToken;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Sync user to SQLite DB
        try {
          const token = await currentUser.getIdToken();
          await fetch("/api/users/sync", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Failed to sync user to database:", err);
        }
      } else {
        setUser(null);
        cachedAccessTokenRef.current = null;
        sessionStorage.removeItem("google_oauth_token");
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
        sessionStorage.setItem("google_oauth_token", credential.accessToken);
      }
      setUser(result.user);
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      if (error.code === 'auth/network-request-failed') {
        alert("Sign in failed due to a network error. If you are in an embedded preview, please pop out the app into a new tab using the button in the top right, or disable your adblocker/tracking protection.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Ignored
      } else {
        alert(`Sign in error: ${error.message}`);
      }
    } finally {
      isSigningInRef.current = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      cachedAccessTokenRef.current = null;
      sessionStorage.removeItem("google_oauth_token");
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
