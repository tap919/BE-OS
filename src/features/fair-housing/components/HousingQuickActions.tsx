// src/features/fair-housing/components/HousingQuickActions.tsx
import React from "react";
import { Home, FileText, ShieldAlert, Scale } from "lucide-react";

const actions = [
  {
    title: "Review a lease",
    description: "Understand key clauses, fees, repairs, and termination language.",
    icon: FileText,
  },
  {
    title: "Check eviction rights",
    description: "Learn what notice, timeline, and process may apply to your situation.",
    icon: ShieldAlert,
  },
  {
    title: "Prepare for homeownership",
    description: "Get organized for budgeting, mortgages, inspections, and closing.",
    icon: Home,
  },
  {
    title: "Report housing bias",
    description: "Identify discrimination or appraisal bias and gather documentation.",
    icon: Scale,
  },
];

export function HousingQuickActions() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
        <p className="text-sm text-slate-500 mt-1">
          Start with the most common housing questions and protections.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="mb-4 text-slate-900">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900">{action.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
