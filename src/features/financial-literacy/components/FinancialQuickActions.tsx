import React, { useState } from "react";
import { Calculator, Wallet, DollarSign, Target, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "budgeting",
    title: "50/30/20 Budgeting",
    description: "Create a simple split budget based on your income.",
    icon: Calculator,
    steps: ["Enter Income", "Calculate Split", "Save Budget"]
  },
  {
    id: "debt",
    title: "Debt Payoff Plan",
    description: "Avalanche or Snowball method calculator.",
    icon: DollarSign,
    steps: ["Enter Debts", "Choose Strategy", "View Timeline"]
  },
  {
    id: "emergency",
    title: "Emergency Fund Setup",
    description: "Determine your 3-6 month safety net.",
    icon: Wallet,
    steps: ["Monthly Expenses", "Set Target", "Create Saving Schedule"]
  },
  {
    id: "investing",
    title: "Investment Goals",
    description: "Compound interest and long-term goal setting.",
    icon: Target,
    steps: ["Current Savings", "Time Horizon", "Review Projection"]
  }
];

export function FinancialQuickActions() {
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
        await fetch("/api/stats/financial", {
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

    if (activeAction.id === "budgeting") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What is your monthly after-tax income?</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">$</span>
              <input type="number" placeholder="4000" className="w-full p-3 pl-8 border border-slate-300 rounded-lg" />
            </div>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Your 50/30/20 Target Split</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-sm text-blue-800">Needs (50%)</div>
                <div className="text-xl font-bold text-blue-900">$2,000</div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="text-sm text-purple-800">Wants (30%)</div>
                <div className="text-xl font-bold text-purple-900">$1,200</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="text-sm text-green-800">Savings & Debt (20%)</div>
                <div className="text-xl font-bold text-green-900">$800</div>
              </div>
            </div>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Budget Saved</h3>
             <p className="text-slate-600 text-sm mt-2">We have added your 50/30/20 snapshot to your Vault.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "debt") {
       if (step === 0) {
         return (
           <div className="space-y-4 text-center py-4">
             <p className="text-slate-600">Connecting to our Debt Payoff Engine...</p>
           </div>
         );
       }
       if (step === 1) {
         return (
           <div className="space-y-4 text-center py-4">
               <p className="text-slate-600">Analyzing Avalanche vs. Snowball strategies...</p>
           </div>
         );
       }
       if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Strategy Selected</h3>
             <p className="text-slate-600 text-sm mt-2">Saved to your Vault.</p>
           </div>
         );
       }
    }
    
    // Default placeholder for other steps
    if (step === activeAction.steps.length - 1) {
      return (
         <div className="text-center py-4">
           <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
           <h3 className="font-bold text-slate-800">Action Complete</h3>
         </div>
      );
    }

    return (
      <div className="py-8 text-center text-slate-500">
        <p>Connecting to financial advisory engine (Demo Mode)...</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => openAction(action.id)}
            className="flex items-start text-left p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-sm transition-all"
          >
            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 mr-4">
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{action.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {activeActionId && activeAction && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <activeAction.icon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">{activeAction.title}</h3>
              </div>
              <button onClick={closeAction} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-2 mb-8">
                {activeAction.steps.map((s, i) => (
                    <div key={i} className="flex-1">
                      <div className={`h-1.5 rounded-full w-full ${i <= step ? "bg-indigo-600" : "bg-slate-100"}`} />
                      <p className={`text-xs mt-2 font-medium text-center ${i <= step ? "text-indigo-800" : "text-slate-400"}`}>
                        {s}
                      </p>
                    </div>
                ))}
              </div>

              <div className="min-h-[150px]">
                {renderStepContent()}
              </div>

              <div className="mt-8 flex justify-end">
                {step < activeAction.steps.length - 1 ? (
                  <button 
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={closeAction}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
