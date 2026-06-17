import React from "react";

interface FeatureEmptyStateProps {
  title: string;
  description: string;
}

export function FeatureEmptyState({ title, description }: FeatureEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-left">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
    </div>
  );
}
