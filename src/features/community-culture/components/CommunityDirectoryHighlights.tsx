import React from "react";
import { ArrowRight } from "lucide-react";

const directories = [
  "Black-owned businesses.",
  "Community banks and lenders.",
  "Media, newsletters, and advocacy groups.",
  "Support organizations and local ecosystems.",
];

export function CommunityDirectoryHighlights() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Directory Highlights</h2>
      <p className="mt-1 text-sm text-slate-500">
        Browse verified local, national, and digital partners within our ecosystem.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {directories.map((item) => (
          <button
            key={item}
            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
          >
            <span>{item}</span>
            <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-900" />
          </button>
        ))}
      </div>
    </section>
  );
}
