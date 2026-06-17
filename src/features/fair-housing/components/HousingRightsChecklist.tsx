// src/features/fair-housing/components/HousingRightsChecklist.tsx
import React from "react";

const checklist = [
  "Lease and fee transparency.",
  "Notice requirements before eviction or non-renewal.",
  "Repair responsibilities and habitability standards.",
  "Fair housing protections and discrimination red flags.",
  "Mortgage, appraisal, and closing document review.",
];

export function HousingRightsChecklist() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rights Checklist</h2>
      <p className="mt-1 text-sm text-slate-500">
        Use this as a first-pass framework before asking the coach or contacting an advocate.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {checklist.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
