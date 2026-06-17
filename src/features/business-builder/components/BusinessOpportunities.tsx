import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const opportunities = [
  { id: "opt-1", title: "Starter grants", meta: "Funding, local programs, accelerators", desc: "Discover active $5k-$25k micro-grants optimized for new founders." },
  { id: "opt-2", title: "Procurement readiness", meta: "Capability statements, SAM prep, certifications", desc: "Step-by-step checklist to become vendor-ready for local government contracts." },
  { id: "opt-3", title: "Revenue systems", meta: "Packaging offers, pricing, client workflow", desc: "Tools to structure your pricing tiers and automate customer intake seamlessly." },
];

export function BusinessOpportunities() {
  const [activeOpt, setActiveOpt] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Growth Tracks</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {opportunities.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveOpt(activeOpt === item.id ? null : item.id)}
            className={`rounded-xl border p-5 cursor-pointer transition-colors ${activeOpt === item.id ? 'border-amber-500 bg-amber-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              {activeOpt === item.id && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
            </div>
            <p className="mt-1 text-sm text-slate-600 font-medium">{item.meta}</p>
            {activeOpt === item.id && (
              <div className="mt-4 pt-4 border-t border-amber-200/50">
                <p className="text-sm text-slate-700">{item.desc}</p>
                <button className="mt-3 flex items-center text-sm font-bold text-amber-600 hover:text-amber-700">
                  Explore Track <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
