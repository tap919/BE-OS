import React from "react";
import { ResourceList, type Resource } from "@/src/components/ui/ResourceList";
import { FeatureLoadingState } from "./FeatureLoadingState";
import { FeatureErrorState } from "./FeatureErrorState";
import { FeatureEmptyState } from "./FeatureEmptyState";
import type { LoadState } from "../hooks/useAuthedResources";

interface FeatureResourceSectionProps {
  title?: string;
  description?: string;
  emptyTitle: string;
  emptyDescription: string;
  resources: Resource[];
  state: LoadState;
  error: string | null;
}

export function FeatureResourceSection({
  title = "Core Modules & Guides",
  description = "Foundational reading, rights guides, and advocacy resources.",
  emptyTitle,
  emptyDescription,
  resources,
  state,
  error,
}: FeatureResourceSectionProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {state === "loading" && <FeatureLoadingState />}
      {state === "error" && <FeatureErrorState message={error || "Unknown error."} />}
      {state === "empty" && <FeatureEmptyState title={emptyTitle} description={emptyDescription} />}
      {state === "ready" && <ResourceList resources={resources} />}
    </section>
  );
}
