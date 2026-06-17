import React from "react";
import { Briefcase, FileText, BadgeDollarSign, Target } from "lucide-react";

const actions = [
  {
    title: "Start your LLC",
    description: "Understand registration, EIN setup, banking, and compliance basics.",
    icon: Briefcase,
  },
  {
    title: "Build core documents",
    description: "Prepare contracts, invoices, pricing sheets, and capability statements.",
    icon: FileText,
  },
  {
    title: "Find funding",
    description: "Browse grants, procurement opportunities, and accelerator programs.",
    icon: BadgeDollarSign,
  },
  {
    title: "Grow strategically",
    description: "Get help with marketing, pricing, offers, and operations.",
    icon: Target,
  },
];

export function BusinessQuickActions() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
        <p className="text-sm text-slate-500 mt-1">
          Start with the most common entrepreneurship workflows.
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
