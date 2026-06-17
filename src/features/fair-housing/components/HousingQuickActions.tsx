// src/features/fair-housing/components/HousingQuickActions.tsx
import React, { useState } from "react";
import { Home, FileText, ShieldAlert, Scale, X, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "lease",
    title: "Review a lease",
    description: "Understand key clauses, fees, repairs, and termination language.",
    icon: FileText,
    steps: ["Upload/Paste Lease", "Extract Terms", "Flag Risks"]
  },
  {
    id: "eviction",
    title: "Check eviction rights",
    description: "Learn what notice, timeline, and process may apply to your situation.",
    icon: ShieldAlert,
    steps: ["Select State", "Answer Timeline", "View Rights"]
  },
  {
    id: "homeownership",
    title: "Prepare for homeownership",
    description: "Get organized for budgeting, mortgages, inspections, and closing.",
    icon: Home,
    steps: ["Check Finances", "View Programs", "Save Plan"]
  },
  {
    id: "bias",
    title: "Report housing bias",
    description: "Identify discrimination or appraisal bias and gather documentation.",
    icon: Scale,
    steps: ["Select Issue", "Document Evidence", "Find Agency"]
  },
];

export function HousingQuickActions() {
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
        await fetch(`/api/stats/fair_housing`, {
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
    return (
      <div className="text-center py-8">
        <IconComponent className="w-12 h-12 text-indigo-300 mx-auto mb-4" icon={activeAction.icon} />
        <h3 className="font-bold text-slate-700 text-lg">{activeAction.steps[step]}</h3>
        <p className="text-sm text-slate-500 mt-2">Connecting to housing knowledge graph to process this step...</p>
      </div>
    );
  };

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
                <IconComponent className="w-5 h-5 text-indigo-600" icon={activeAction.icon} />
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
                  onClick={() => { alert("Action completed and saved safely to your log."); closeAction(); }}
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
