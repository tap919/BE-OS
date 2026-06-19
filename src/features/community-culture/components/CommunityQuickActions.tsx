// src/features/community-culture/components/CommunityQuickActions.tsx
import React, { useState } from "react";
import { Store, Calendar, BookOpen, Handshake, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "directories",
    title: "Explore directories",
    description: "Find Black-owned businesses, banks, media, and support ecosystems.",
    icon: Store,
    steps: ["Select Category", "Filter by State", "View Directory"]
  },
  {
    id: "events",
    title: "Browse events",
    description: "Discover workshops, local meetups, and virtual learning sessions.",
    icon: Calendar,
    steps: ["Set Location", "Pick Interests", "See Events"]
  },
  {
    id: "stories",
    title: "Read community stories",
    description: "See wins, interviews, and examples from across the ecosystem.",
    icon: BookOpen,
    steps: ["Select Topic", "Read Highlights", "Save Favorites"]
  },
  {
    id: "partner",
    title: "Find partner organizations",
    description: "Connect with vetted collaborators and aligned nonprofits.",
    icon: Handshake,
    steps: ["Search Profile", "Match Needs", "Connect"]
  },
];

export function CommunityQuickActions() {
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const { getToken } = useAuth();
  
  const activeAction = actions.find(a => a.id === activeActionId);

  const openAction = async (id: string) => {
    setActiveActionId(id);
    setStep(0);
    try {
      const token = await getToken();
      if (token) {
        await fetch(`/api/stats/community_culture`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error("Failed to log interaction", e);
    }
  };

  const closeAction = () => {
    setActiveActionId(null);
    setStep(0);
  };

  const renderStepContent = () => {
    if (!activeAction) return null;

    if (activeAction.id === "directories") {
      if (step === 0) {
        return (
          <div className="grid grid-cols-1 gap-2">
            {["Black-owned Banks", "Tech Startups", "Creative Agencies", "Legal Services"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="directoryType" value={type} />
                <span className="font-medium text-slate-700 text-sm">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Filter by State</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>All States</option>
              <option>New York</option>
              <option>California</option>
              <option>Texas</option>
              <option>Georgia</option>
              <option>Illinois</option>
            </select>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="space-y-3">
             <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
               <h4 className="font-bold text-sm text-slate-800">Greenwood</h4>
               <p className="text-xs text-slate-600 mb-2">Digital banking for the Black and Latino community.</p>
               <a href="#" className="text-indigo-600 font-bold text-xs">Visit Website &rarr;</a>
             </div>
             <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
               <h4 className="font-bold text-sm text-slate-800">Citizens Trust Bank</h4>
               <p className="text-xs text-slate-600 mb-2">Founded in 1921, providing commercial banking services.</p>
               <a href="#" className="text-indigo-600 font-bold text-xs">Visit Website &rarr;</a>
             </div>
           </div>
         );
      }
    }

    if (activeAction.id === "events") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Enter Zip Code or City</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Atlanta, GA" />
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="grid grid-cols-2 gap-2">
            {["Networking", "Tech", "Arts", "Financial", "Legal", "Health"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="checkbox" value={type} />
                <span className="font-medium text-slate-700 text-xs">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="space-y-3">
             <div className="p-3 border border-slate-200 rounded-lg bg-white flex flex-col gap-2 shadow-sm">
               <div className="flex justify-between items-start">
                 <h4 className="font-bold text-sm text-slate-800">Black Tech Week 2026</h4>
                 <span className="bg-indigo-100 text-indigo-800 text-[10px] uppercase px-2 py-1 rounded font-bold">Tech</span>
               </div>
               <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Jul 14 - 16 • Cincinnati, OH</p>
               <button className="text-xs font-medium text-indigo-600 text-left mt-1">RSVP Now &rarr;</button>
             </div>
           </div>
         );
      }
    }

    if (activeAction.id === "stories") {
      if (step === 0) {
        return (
          <div className="grid grid-cols-1 gap-2">
            {["Founder Journeys", "Legal Triumphs", "Homeownership Wins", "Community Organizing"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="storyTopic" value={type} />
                <span className="font-medium text-slate-700 text-sm">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 1) {
        return (
           <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
             <h4 className="font-bold text-slate-800 text-sm mb-2">How Sarah secured a $50k non-dilutive grant</h4>
             <p className="text-sm text-slate-600 line-clamp-4">"It started with getting the basic LLC documents correct. After applying through the systemic funding portal... I realized the key was narrative alignment with the grant's core impact statement. Here is the exact template I used..."</p>
           </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <Store className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Story Saved to Vault</h3>
             <p className="text-sm text-slate-500 mb-4">You can access this and other saved stories in your User Account.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "partner") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What is your organization type?</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>Non-profit (501c3)</option>
              <option>For-profit LLC</option>
              <option>Community Group</option>
              <option>Individual</option>
            </select>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What are you looking for?</label>
            <div className="grid grid-cols-1 gap-2">
              {["Mentorship", "Co-founders", "Legal Support", "Distribution Partners"].map(type => (
                <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" value={type} />
                  <span className="font-medium text-slate-700 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
             <h4 className="font-bold text-indigo-900 text-sm mb-2">Match Found: LegalTech for Justice</h4>
             <p className="text-xs text-indigo-700 mb-4">A 501c3 organization specializing in pro-bono digital defense documents.</p>
             <button className="w-full py-2 bg-indigo-600 text-white rounded text-sm font-medium">Request Introduction</button>
           </div>
         );
      }
    }

    // Fallback
    const ActionIcon = activeAction.icon as React.ElementType;
    
    return (
      <div className="text-center py-8">
        <ActionIcon className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
        <h3 className="font-bold text-slate-700 text-lg">{activeAction.steps[step]}</h3>
        <p className="text-sm text-slate-500 mt-2">Unhandled step {step} for {activeAction.id}</p>
      </div>
    );
  };

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
              key={action.id}
              onClick={() => openAction(action.id)}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md group"
            >
              <div className="mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900">{action.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2 md:line-clamp-none">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Modal Overlay */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                {React.createElement(activeAction.icon, { className: "w-5 h-5 text-indigo-600" })}
                <h3 className="font-bold text-slate-800">{activeAction.title}</h3>
              </div>
              <button onClick={closeAction} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-slate-100/50">
              {activeAction.steps.map((s, i) => (
                <div key={s} className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 ${i === step ? 'border-indigo-500 text-indigo-700' : i < step ? 'border-green-500 text-green-600' : 'border-transparent text-slate-400'}`}>
                  {s}
                </div>
              ))}
            </div>

            <div className="p-6 h-[300px] overflow-y-auto">
              {renderStepContent()}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button 
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              {step < activeAction.steps.length - 1 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => { alert("Action completed."); closeAction(); }}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center gap-1"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const IconComponent = ({ icon: Icon, className }: { icon: any, className?: string }) => {
  return <Icon className={className} />;
};
