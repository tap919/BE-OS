// src/features/community-culture/components/CommunityQuickActions.tsx
import React from "react";
import { Store, Calendar, BookOpen, Handshake } from "lucide-react";

const actions = [
  {
    title: "Explore directories",
    description: "Find Black-owned businesses, banks, media, and support ecosystems.",
    icon: Store,
  },
  {
    title: "Browse events",
    description: "Discover workshops, local meetups, and virtual learning sessions.",
    icon: Calendar,
  },
  {
    title: "Read community stories",
    description: "See wins, interviews, and examples from across the ecosystem.",
    icon: BookOpen,
  },
  {
    title: "Find partner organizations",
    description: "Connect with vetted collaborators and aligned nonprofits.",
    icon: Handshake,
  },
];

export function CommunityQuickActions() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
        <p className="text-sm text-slate-500 mt-1">
          Discover people, programs, organizations, and stories worth following.
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
