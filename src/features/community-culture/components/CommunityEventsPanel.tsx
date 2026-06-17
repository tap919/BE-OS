import React from "react";

const events = [
  { title: "Local workshops", meta: "Business, housing, legal, and finance education" },
  { title: "Virtual sessions", meta: "Coaching, information sessions, office hours" },
  { title: "Community meetups", meta: "Networking, partnership, and storytelling spaces" },
];

export function CommunityEventsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Events & Workshops</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {events.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.meta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
