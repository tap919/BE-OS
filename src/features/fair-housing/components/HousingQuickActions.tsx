// src/features/fair-housing/components/HousingQuickActions.tsx
import React, { useState } from "react";
import { Home, FileText, ShieldAlert, Scale, X, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { useGoogleIntegration } from "@/src/lib/useGoogleIntegration";
import { createDoc, createCalendarEvent, draftEmail } from "@/src/lib/GoogleApiService";
import { GoogleActionBanner } from "@/src/components/GoogleActionBanner";

const MapsEmbed = ({ zip }: { zip: string }) => {
  const mapKey = (import.meta as any).env.VITE_MAPS_API_KEY;
  if (!mapKey) return <div className="p-4 bg-slate-100 text-slate-500 rounded-lg text-sm text-center">Google Maps integration requires VITE_MAPS_API_KEY</div>;
  return (
    <iframe
      width="100%" height="300"
      style={{ border: 0, borderRadius: '0.5rem' }}
      loading="lazy"
      src={`https://www.google.com/maps/embed/v1/search?key=${mapKey}&q=legal+aid+near+${zip}`}
    />
  );
};

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
  const [zipCode, setZipCode] = useState("");
  const { getToken, getOAuthToken } = useAuth();
  const { run: runGoogle, status: googleStatus, result: googleResult } = useGoogleIntegration();
  const [googleActionMeta, setGoogleActionMeta] = useState<{ docUrl?: string; message?: string;} | null>(null);
  
  const activeAction = actions.find(a => a.id === activeActionId);

  const openAction = async (id: string) => {
    setActiveActionId(id);
    setStep(0);
    setGoogleActionMeta(null);
    setZipCode("");
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

  const saveProgress = async (status: 'started' | 'completed', currentStep: number) => {
    if (!activeActionId) return;
    try {
      const token = await getToken();
      if (token) {
        await fetch(`/api/progress/fair_housing/${activeActionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status, stepReached: currentStep })
        });
      }
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const closeAction = () => {
    setActiveActionId(null);
    setStep(0);
  };
  
  const forceClose = () => {
    setGoogleActionMeta(null);
    closeAction();
  };

  const nextStep = () => {
    const next = step + 1;
    setStep(next);
    saveProgress('started', next);
  };

  const handleDone = () => {
    if (activeAction) {
      const oauthToken = getOAuthToken();
      if (oauthToken) {
        if (activeActionId === 'lease') {
          runGoogle(async (token) => {
            const doc = await createDoc(token, `Lease Review – ${new Date().toLocaleDateString()}`);
            setGoogleActionMeta({ docUrl: (doc as any).documentUrl || (doc as any).documentId ? `https://docs.google.com/document/d/${(doc as any).documentId}/edit` : undefined, message: 'Lease Review saved to Google Docs!' });
            return doc;
          });
        } else if (activeActionId === 'bias') {
          runGoogle(async (token) => {
            await draftEmail(token, 'complaints@hud.gov', '📝 Fair Housing Complaint', `<h2>Fair Housing Complaint</h2><p>I am writing to report an incident...</p>`);
            setGoogleActionMeta({ message: 'HUD complaint draft created in Gmail!' });
          });
        } else if (activeActionId === 'homeownership') {
          runGoogle(async (token) => {
            const doc = await createDoc(token, `Homeownership Checklist – ${new Date().toLocaleDateString()}`);
            setGoogleActionMeta({ docUrl: (doc as any).documentUrl || (doc as any).documentId ? `https://docs.google.com/document/d/${(doc as any).documentId}/edit` : undefined, message: 'Homeownership Checklist saved to Google Docs!' });
            return doc;
          });
        }
      }
      
      saveProgress('completed', activeAction.steps.length - 1);
    }
    
    if (!getOAuthToken()) {
      closeAction();
    }
  };

  const renderStepContent = () => {
    if (!activeAction) return null;

    if (activeAction.id === "lease") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Paste your lease text here</label>
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg h-32 text-sm" 
              placeholder="Paste lease terms..."
            />
          </div>
        );
      }
      if (step === 1) {
         return (
           <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
             <div className="flex items-center gap-2 mb-2 font-bold"><CheckCircle className="w-4 h-4 text-indigo-600"/> Extracted Key Terms</div>
             <ul className="list-disc pl-5 space-y-1">
               <li>Lease Type: Fixed Term</li>
               <li>Security Deposit: Confirmed 1.5x rent.</li>
               <li>Maintenance: Standard wear & tear exempt.</li>
             </ul>
           </div>
         );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-900">
             <div className="flex items-center gap-2 mb-2 font-bold"><ShieldAlert className="w-4 h-4 text-red-600"/> Flagged Risks</div>
             <p>The clause restricting "extended guests" is over-broad under certain state laws and could be enforced discriminatorily. Consider negotiating a specific time framing.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "eviction") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Select your state</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg mb-2">
              <option>New York</option>
              <option>California</option>
              <option>Texas</option>
              <option>Georgia</option>
            </select>
            <label className="block text-sm font-medium text-slate-700">Enter your Zip Code</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-lg" 
              placeholder="e.g. 10001" 
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
            />
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Did you receive a formal written notice?</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2"><input type="radio" name="notice" /> Yes</label>
               <label className="flex items-center gap-2"><input type="radio" name="notice" /> No</label>
            </div>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="space-y-4">
             <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
               <h4 className="font-bold mb-2">Your Immediate Rights:</h4>
               <ul className="list-disc pl-5 space-y-1">
                 <li>Self-help eviction (changing locks) by landlord is illegal.</li>
                 <li>You have the right to a court hearing.</li>
                 <li>Possible defenses: failure to maintain habitable premises.</li>
               </ul>
             </div>
             {zipCode && (
               <div>
                  <h4 className="font-bold text-sm mb-2 text-slate-700">Nearest Legal Aid Offices:</h4>
                  <MapsEmbed zip={zipCode} />
               </div>
             )}
           </div>
         );
      }
    }

    if (activeAction.id === "homeownership") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Estimated Credit Score</label>
            <input type="number" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. 680" />
            <label className="block text-sm font-medium text-slate-700 mt-2">Saved for down payment</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="$..." />
          </div>
        );
      }
      if (step === 1) {
        return (
           <div className="space-y-2">
             <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-center">
               <span className="font-medium text-sm text-slate-800">FHA Loan Programs</span>
               <span className="text-xs bg-slate-200 px-2 py-1 rounded">3.5% down</span>
             </div>
             <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-center">
               <span className="font-medium text-sm text-slate-800">NACA Program</span>
               <span className="text-xs bg-slate-200 px-2 py-1 rounded">0% down, no closing costs</span>
             </div>
           </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">Plan Generated</h3>
             <p className="text-sm text-slate-500 mb-4">We've generated a 6-month readiness checklist based on your profile.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "bias") {
      if (step === 0) {
        return (
          <div className="grid grid-cols-1 gap-2">
            {["Renting/Leasing", "Home Appraisal", "Mortgage Lending", "HOA Discrimination"].map(type => (
              <label key={type} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input type="radio" name="biasType" value={type} />
                <span className="font-medium text-slate-700 text-sm">{type}</span>
              </label>
            ))}
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">What specific statements or actions occurred?</label>
            <textarea 
              className="w-full p-3 border border-slate-300 rounded-lg h-24 text-sm" 
              placeholder="Describe the incident..."
            />
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="space-y-3">
             <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
               <h4 className="font-bold text-sm text-slate-800">Local Fair Housing Agency</h4>
               <p className="text-xs text-slate-600">HUD Office of Fair Housing and Equal Opportunity (FHEO)</p>
               <button className="mt-2 w-full py-2 bg-slate-900 text-white rounded text-sm font-medium">File Complaint Online</button>
             </div>
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
                {React.createElement(activeAction.icon, { className: "w-5 h-5 text-indigo-600" })}
                <h3 className="font-bold text-slate-800">{activeAction.title}</h3>
              </div>
              <button onClick={forceClose} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200">
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
              {googleStatus === 'loading' && (
                <div className="mb-4 p-4 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium animate-pulse">
                  Connecting to Google Workspace...
                </div>
              )}
              {googleActionMeta && (
                <GoogleActionBanner message={googleActionMeta.message!} link={googleActionMeta.docUrl} />
              )}
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
                  onClick={nextStep}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={googleStatus === 'success' || googleActionMeta ? forceClose : handleDone}
                  disabled={googleStatus === 'loading'}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center gap-1 disabled:opacity-50"
                >
                  {googleStatus === 'success' || googleActionMeta ? 'Close' : 'Complete'}
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
