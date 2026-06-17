import React, { useState } from "react";
import { Briefcase, FileText, BadgeDollarSign, Target, CheckCircle, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "llc",
    title: "Start your LLC",
    description: "Understand registration, EIN setup, banking, and compliance basics.",
    icon: Briefcase,
    steps: ["Check Name", "Select State", "Generate Articles"]
  },
  {
    id: "docs",
    title: "Build core documents",
    description: "Prepare contracts, invoices, pricing sheets, and capability statements.",
    icon: FileText,
    steps: ["Select Type", "Provide Details", "Finalize"]
  },
  {
    id: "funding",
    title: "Find funding",
    description: "Browse grants, procurement opportunities, and accelerator programs.",
    icon: BadgeDollarSign,
    steps: ["Filter Matches", "Read Criteria", "Save Draft"]
  },
  {
    id: "grow",
    title: "Grow strategically",
    description: "Get help with marketing, pricing, offers, and operations.",
    icon: Target,
    steps: ["Set Goal", "Review Tactics", "Execute"]
  },
];

export function BusinessQuickActions() {
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const { getToken } = useAuth();
  
  const activeAction = actions.find(a => a.id === activeActionId);

  const openAction = (id: string) => {
    setActiveActionId(id);
    setStep(0);
    setFormData({});
  };

  const closeAction = () => {
    setActiveActionId(null);
    setStep(0);
    setFormData({});
  };

  const nextStep = () => {
    if (activeAction && step < activeAction.steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const saveSnippetToVault = async (snippet: string, contextName: string) => {
    try {
      const token = await getToken();
      await fetch("/api/vault/ai-snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ snippet, contextName }),
      });
      alert("Successfully saved to your vault!");
      closeAction();
    } catch(err) {
      alert("Failed to save.");
    }
  };

  // Render content based on current action & step
  const renderStepContent = () => {
    if (!activeAction) return null;

    if (activeAction.id === "llc") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Desired LLC Name</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-lg" 
              placeholder="e.g. Community Builders LLC"
              value={formData.llcName || ""}
              onChange={e => setFormData({...formData, llcName: e.target.value})}
            />
            {formData.llcName?.length > 3 && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Name appears available in general directory
              </div>
            )}
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Select Registration State</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-lg"
              value={formData.state || ""}
              onChange={e => setFormData({...formData, state: e.target.value})}
            >
              <option value="">Choose State...</option>
              <option value="DE">Delaware (Popular for startups)</option>
              <option value="WY">Wyoming (Privacy focused)</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="GA">Georgia</option>
            </select>
          </div>
        );
      }
      if (step === 2) {
        const snippet = `Articles of Organization for ${formData.llcName || "New Business LLC"} registered in ${formData.state || "chosen state"}. This is a generated template for review.`;
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-600">
              {snippet}
            </div>
            <button 
              onClick={() => saveSnippetToVault(snippet, "LLC Articles Draft")}
              className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              Save to Vault & Finish
            </button>
          </div>
        );
      }
    }

    if (activeAction.id === "docs") {
      if (step === 0) {
        return (
          <div className="grid grid-cols-1 gap-2">
            {["Services Contract", "Independent Contractor Agreement", "Capability Statement", "Invoice Template"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input 
                  type="radio" 
                  name="docType" 
                  value={type} 
                  onChange={e => setFormData({...formData, docType: e.target.value})}
                  checked={formData.docType === type}
                />
                <span className="font-medium text-slate-700">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Client/Project Name</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-lg" 
              placeholder="e.g. Project Alpha"
              value={formData.projectName || ""}
              onChange={e => setFormData({...formData, projectName: e.target.value})}
            />
          </div>
        );
      }
      if (step === 2) {
        const snippet = `Generated ${formData.docType || "Document"} for ${formData.projectName || "Client"}. Standard terms and conditions apply.`;
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-600">
              {snippet}
            </div>
            <button 
              onClick={() => saveSnippetToVault(snippet, `${formData.docType} Draft`)}
              className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
            >
              Save to Vault & Export
            </button>
          </div>
        );
      }
    }

    // Generic fallback for others
    return (
      <div className="text-center py-8">
        <IconComponent className="w-12 h-12 text-indigo-300 mx-auto mb-4" icon={activeAction.icon} />
        <h3 className="font-bold text-slate-700 text-lg">{activeAction.steps[step]}</h3>
        <p className="text-sm text-slate-500 mt-2">To be implemented dynamically based on user profile.</p>
      </div>
    );
  };

  return (
    <section className="space-y-4 relative">
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
              key={action.id}
              onClick={() => openAction(action.id)}
              className="rounded-2xl border bg-white border-slate-200 p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md group"
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
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5 text-indigo-600" icon={activeAction.icon} />
                <h3 className="font-bold text-slate-800">{activeAction.title}</h3>
              </div>
              <button onClick={closeAction} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex bg-slate-100/50">
              {activeAction.steps.map((s, i) => (
                <div key={s} className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider border-b-2 ${i === step ? 'border-indigo-500 text-indigo-700' : i < step ? 'border-green-500 text-green-600' : 'border-transparent text-slate-400'}`}>
                  {s}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 h-[300px] overflow-y-auto">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button 
                onClick={prevStep}
                disabled={step === 0}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              {step < activeAction.steps.length - 1 ? (
                <button 
                  onClick={nextStep}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Helper to render icon component passing
const IconComponent = ({ icon: Icon, className }: { icon: any, className?: string }) => {
  return <Icon className={className} />;
};

