import React from "react";

export function FeatureLoadingState() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="h-3 w-2/3 rounded bg-slate-100" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-20 rounded-xl bg-slate-100" />
        <div className="h-20 rounded-xl bg-slate-100" />
        <div className="h-20 rounded-xl bg-slate-100" />
        <div className="h-20 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
