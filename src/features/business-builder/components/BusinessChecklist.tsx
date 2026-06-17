import React, { useState } from "react";
import { Check } from "lucide-react";

const initialChecklist = [
  { id: "legal", label: "Choose a legal structure and register the business." },
  { id: "ein", label: "Apply for an EIN and open a business bank account." },
  { id: "bookkeeping", label: "Set up bookkeeping, pricing, and invoicing workflows." },
  { id: "contracts", label: "Prepare standard contracts and proposal templates." },
  { id: "grants", label: "Review grants, certifications, and federal contracting readiness." },
];

export function BusinessChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Business Launch Checklist</h2>
      <p className="mt-1 text-sm text-slate-500">
        Use this as a first-pass roadmap before diving into deeper guides or coaching. Track your progress below.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {initialChecklist.map((item) => {
          const isChecked = checkedItems[item.id] || false;
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                isChecked 
                  ? "border-green-200 bg-green-50" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              }`}
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                isChecked ? "border-green-600 bg-green-600 text-white" : "border-slate-300 bg-white"
              }`}>
                {isChecked && <Check className="h-3.5 w-3.5" />}
              </div>
              <span className={`text-sm ${isChecked ? "text-green-900 font-medium" : "text-slate-700"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
