import React, { useState } from "react";
import { Scale, BookOpen, Shield, Search, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "expungement",
    title: "Clear Your Record",
    description: "Eligibility checks and workflow for post-conviction relief.",
    icon: Scale,
    steps: ["Eligibility Check", "Gather Documents", "Generate Petition"]
  },
  {
    id: "defense",
    title: "Know Your Rights",
    description: "What to do during traffic stops or police interactions.",
    icon: Shield,
    steps: ["Select Scenario", "Review Rights", "Save Pocket Guide"]
  },
  {
    id: "tenant",
    title: "Tenant Defense",
    description: "Respond to eviction notices or unlawful rent hikes.",
    icon: BookOpen,
    steps: ["State Law Check", "Review Notice", "Generate Response"]
  },
  {
    id: "search",
    title: "Case Law Search",
    description: "Find legal precedents related to your situation.",
    icon: Search,
    steps: ["Enter Keywords", "Filter by State", "Review Cases"]
  }
];

export function LegalQuickActions() {
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const { getToken } = useAuth();

  const openAction = async (id: string) => {
    setActiveActionId(id);
    setStep(0);
    
    // Log the interaction
    try {
      const token = await getToken();
      if (token) {
        await fetch("/api/stats/legal", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeAction = () => {
    setActiveActionId(null);
    setStep(0);
  };

  const nextStep = () => setStep((s) => s + 1);

  const activeAction = actions.find(a => a.id === activeActionId);

  const renderStepContent = () => {
    if (!activeAction) return null;

    if (activeAction.id === "expungement") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What state was the conviction in?</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>New York</option>
              <option>California</option>
              <option>Illinois</option>
              <option>Georgia</option>
            </select>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Has it been at least 3 years since completion of sentence?</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2"><input type="radio" name="time" /> Yes</label>
               <label className="flex items-center gap-2"><input type="radio" name="time" /> No</label>
            </div>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">You may be eligible</h3>
             <p className="text-sm text-slate-500 mb-4">We've saved the required forms to your Vault.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "defense") {
      if (step === 0) {
        return (
          <div className="space-y-2">
            {["Traffic Stop", "Street Stop / Stop and Frisk", "At Your Home", "Arrested"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="scenario" value={type} />
                <span className="font-medium text-slate-700 text-sm">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 1) {
        return (
           <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-900">
             <h4 className="font-bold mb-2">Key Rights: Traffic Stop</h4>
             <ul className="list-disc pl-5 space-y-1">
               <li>Keep hands visible on the wheel.</li>
               <li>You have the right to remain silent ("I choose to remain silent").</li>
               <li>You can refuse a search ("I do not consent to a search of my vehicle").</li>
               <li>Ask "Am I free to go?" If yes, calmly leave.</li>
             </ul>
           </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Pocket Guide Saved</h3>
             <p className="text-sm text-slate-500 mb-4">Access it offline from your User Vault anytime.</p>
           </div>
         );
      }
    }
    
    if (activeAction.id === "tenant") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What state are you renting in?</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>New York</option>
              <option>California</option>
              <option>Texas</option>
              <option>Georgia</option>
            </select>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What kind of notice did you receive?</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>Pay Rent or Quit</option>
              <option>Cure or Quit (Lease Violation)</option>
              <option>Unconditional Quit</option>
              <option>Rent Increase Notice</option>
            </select>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Response Generated</h3>
             <p className="text-sm text-slate-500 mb-4">A standard legal response letter has been generated in your Vault.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "search") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Enter keywords (e.g., "wrongful termination", "tenant rights")</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Enter keywords..." />
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Filter by Jurisdiction</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>Federal Supreme Court</option>
              <option>Federal Circuit Court</option>
              <option>State Supreme Court</option>
            </select>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
             <h4 className="font-bold mb-2">Search Results:</h4>
             <ul className="list-disc pl-5 space-y-2">
               <li><span className="font-bold">Smith v. Doe (2018):</span> Established precedent for...</li>
               <li><span className="font-bold">State v. Johnson (2020):</span> Clarified the meaning of...</li>
             </ul>
           </div>
         );
      }
    }

    return (
      <div className="text-center py-6">
         <Search className="w-10 h-10 text-indigo-300 mx-auto mb-4" />
         <h4 className="font-bold text-slate-700">Connecting Database</h4>
         <p className="text-sm text-slate-500 mt-2">This feature is running in test mode.</p>
      </div>
    );
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Legal Action Modules</h2>
        <p className="text-sm text-slate-500 mt-1">
          Interactive tools to understand your rights and take informed action.
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
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{action.description}</p>
            </button>
          );
        })}
      </div>

      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <activeAction.icon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">{activeAction.title}</h3>
              </div>
              <button onClick={closeAction} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                {activeAction.steps.map((s, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-indigo-600" : "bg-slate-100"}`} />
                ))}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Step {step + 1}</h4>
                <p className="font-medium text-slate-800 mb-4">{activeAction.steps[step]}</p>
                {renderStepContent()}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                {step < activeAction.steps.length - 1 ? (
                  <button onClick={nextStep} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Continue &rarr;
                  </button>
                ) : (
                  <button onClick={closeAction} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Finish & Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
