import React from "react";

const stories = [
  "Business growth milestones.",
  "Homeownership wins and lessons.",
  "Community partnerships and impact.",
];

export function CommunityStoriesPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Stories & Wins</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {stories.map((item) => (
          <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
