import { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import type { Resource } from "@/src/components/ui/ResourceList";

export type LoadState = "loading" | "error" | "empty" | "ready";

export function useAuthedResources(section: string) {
  const { user, getToken } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (!user) {
        setResources([]);
        setState("empty");
        setError(null);
        return;
      }

      try {
        setState("loading");
        setError(null);

        const token = await getToken();
        const res = await fetch(`/api/${section}/resources`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error(`Unable to load ${section} resources.`);

        const data: Resource[] = await res.json();
        setResources(data);
        setState(data.length ? "ready" : "empty");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setState("error");
      }
    };

    load();
    return () => controller.abort();
  }, [user, getToken, section]);

  return { resources, state, error };
}
