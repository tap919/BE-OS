import React from "react";

const opportunities = [
  { title: "Starter grants", meta: "Funding, local programs, accelerators" },
  { title: "Procurement readiness", meta: "Capability statements, SAM prep, certifications" },
  { title: "Revenue systems", meta: "Packaging offers, pricing, client workflow" },
];

export function BusinessOpportunities() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Growth Tracks</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {opportunities.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.meta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
