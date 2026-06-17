import React, { useState } from "react";
import { Bot, Loader2, Sparkles, Lock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/lib/AuthContext";

interface AICoachProps {
  title: string;
  description: string;
  context: string;
  placeholder?: string;
}

export function AICoach({ title, description, context, placeholder = "Ask me anything..." }: AICoachProps) {
  const { user, signInWithGoogle, getToken, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToVault = async () => {
    if (!response) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = await getToken();
      const res = await fetch("/api/vault/ai-snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ snippet: response, contextName: title }),
      });

      if (res.ok) {
        setSaveSuccess(true);
      } else {
        alert("Failed to save to vault");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save to vault");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setSaveSuccess(false);

    try {
      const token = await getToken();
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ requestContext: context, prompt: query }),
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error("Authentication failed. Please sign in again.");
      }

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = {};
        }
        throw new Error(errorData.error || "Failed to connect to AI Coach");
      }

      const data = await res.json();
      if (!data || typeof data.answer !== "string") {
        throw new Error("Received an unexpected response from the AI Coach.");
      }
      setResponse(data.answer);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-slate-400">{description}</p>
          </div>
        </div>

        {!user ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-slate-700 border-dashed bg-slate-800/30 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Authentication Required</h4>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Sign in with your verified account to access the AI coach and get personalized guidance.
            </p>
            <button
              onClick={signInWithGoogle}
              className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-600"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex flex-col gap-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-slate-900 transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    {isLoading ? "Thinking..." : "Ask Coach"}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-900/30 border border-red-900/50 text-red-200 text-sm">
                {error}
              </div>
            )}

            {response && (
              <div className="mt-6 p-5 sm:p-6 rounded-xl bg-slate-800 border border-slate-700">
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  {response.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">AI Generated</span>
                  <button 
                    onClick={handleSaveToVault} 
                    disabled={isSaving || saveSuccess}
                    className="text-xs font-bold text-amber-500 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save to Vault"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
