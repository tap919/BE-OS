import React, { useState } from "react";
import { DollarSign, Landmark, Presentation, Briefcase, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

const actions = [
  {
    id: "pitch",
    title: "Pitch Deck Review",
    description: "Get AI feedback on your pitch deck.",
    icon: Presentation,
    steps: ["Upload", "Analysis", "Feedback"]
  },
  {
    id: "grant",
    title: "Grant Finder",
    description: "Match with active grants.",
    icon: DollarSign,
    steps: ["Profile", "Matching", "Results"]
  },
  {
    id: "cdfi",
    title: "CDFI Locator",
    description: "Find local CDFIs for fair lending.",
    icon: Landmark,
    steps: ["Location", "Needs", "Matches"]
  },
  {
    id: "investor",
    title: "Investor Match",
    description: "Connect with inclusive VCs.",
    icon: Briefcase,
    steps: ["Stage", "Sector", "Review"]
  }
];

import { useGoogleIntegration } from "@/src/lib/useGoogleIntegration";
import { createDoc, createCalendarEvent, draftEmail, createMeetSpace } from "@/src/lib/GoogleApiService";
import { GoogleActionBanner } from "@/src/components/GoogleActionBanner";

export function WealthQuickActions() {
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { getToken, getOAuthToken } = useAuth();
  const { run: runGoogle, status: googleStatus, result: googleResult } = useGoogleIntegration();
  const [googleActionMeta, setGoogleActionMeta] = useState<{ docUrl?: string; message?: string;} | null>(null);

  const openAction = async (id: string) => {
    setActiveActionId(id);
    setStep(0);
    setFormData({});
    setGoogleActionMeta(null);
    
    try {
      const token = await getToken();
      if (token) {
        // Log the interaction
        fetch("/api/stats/wealth", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        }).catch(e => console.error(e));

        // Fetch progress and resume if available
        const res = await fetch("/api/progress", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const allProgress = await res.json();
          const prog = allProgress.find((p: any) => p.module === 'wealth' && p.actionId === id);
          if (prog && prog.status !== 'completed') {
            setStep(prog.stepReached || 0);
            if (prog.savedData) {
               setFormData(prog.savedData);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveProgress = async (status: 'started' | 'completed', currentStep: number) => {
    if (!activeActionId) return;
    try {
      const token = await getToken();
      if (token) {
        await fetch(`/api/progress/wealth/${activeActionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status, stepReached: currentStep, savedData: formData })
        });
      }
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const closeAction = () => {
    setActiveActionId(null);
    setStep(0);
    setFormData({});
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
        if (activeActionId === 'pitch') {
          runGoogle(async (token) => {
            const doc = await createDoc(token, `Pitch Deck AI Review – ${new Date().toLocaleDateString()}`);
            setGoogleActionMeta({ docUrl: (doc as any).documentUrl || (doc as any).documentId ? `https://docs.google.com/document/d/${(doc as any).documentId}/edit` : undefined, message: 'Review structured in Google Docs!' });
            return doc;
          });
        } else if (activeActionId === 'grant') {
          runGoogle(async (token) => {
            await draftEmail(token, '', '📝 Grant Found - Apply', `<h2>Grant Opportunity</h2><p>Here is your drafted grant response based on our matches...</p>`);
            setGoogleActionMeta({ message: 'Draft email to grant officer created in Gmail!' });
          });
        } else if (activeActionId === 'cdfi' || activeActionId === 'investor') {
          runGoogle(async (token) => {
            const evDate = new Date(); 
            evDate.setDate(evDate.getDate() + 5);
            await createCalendarEvent(token, {
              summary: '👥 Meet with Match',
              description: `Discuss funding options.`,
              start: evDate.toISOString(),
              end: new Date(evDate.getTime() + 3600000).toISOString(),
            });
            setGoogleActionMeta({ message: 'Follow-up scheduled in Calendar!' });
          });
        }
      }
      saveProgress('completed', activeAction.steps.length - 1);
    }
    
    if (!getOAuthToken()) {
      closeAction();
    }
  };

  const activeAction = actions.find(a => a.id === activeActionId);

  const renderStepContent = () => {
    if (!activeAction) return null;
    
    if (activeAction.id === "pitch") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Paste your pitch deck summary</label>
            <textarea className="w-full p-3 border border-slate-300 rounded-lg h-24" placeholder="e.g. We are building a SaaS for local businesses..."></textarea>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4 text-center py-4">
            <p className="text-slate-600">Analyzing market size, clarity, and financials...</p>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
             <h4 className="font-bold mb-2">Feedback summary:</h4>
             <ul className="list-disc pl-5 space-y-1">
               <li>Strengthen the go-to-market strategy.</li>
               <li>Include a clear ask and use of funds.</li>
             </ul>
           </div>
         );
      }
    }

    if (activeAction.id === "grant") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Business Focus Area</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>Technology</option>
              <option>Social Impact</option>
              <option>Retail/E-commerce</option>
              <option>Food & Beverage</option>
            </select>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4 text-center py-4">
            <p className="text-slate-600">Searching active grants...</p>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-green-900">
             <h4 className="font-bold mb-2">Match Found:</h4>
             <p>Black Founder Start-up Grant ($10,000) - Deadline: upcoming month.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "cdfi") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Enter Zip Code</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="12345" />
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Loan Type Needed</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2"><input type="radio" name="cdfiLoan" /> Working Capital</label>
               <label className="flex items-center gap-2"><input type="radio" name="cdfiLoan" /> Equipment</label>
            </div>
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
             <h4 className="font-bold mb-2">Local CDFI Match:</h4>
             <p>Community Reinvestment Fund, USA (CRF) supports your area.</p>
           </div>
         );
      }
    }

    if (activeAction.id === "investor") {
      if (step === 0) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Fundraising Stage</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg">
              <option>Pre-Seed</option>
              <option>Seed</option>
              <option>Series A</option>
            </select>
          </div>
        );
      }
      if (step === 1) {
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Sector</label>
            <input type="text" className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Fintech" />
          </div>
        );
      }
      if (step === 2) {
         return (
           <div className="text-center py-4">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
             <h3 className="font-bold text-slate-800">List Gathered</h3>
             <p className="text-sm text-slate-500 mb-4">A curated list of inclusive VCs in your sector has been saved to your Vault.</p>
           </div>
         );
      }
    }

    // Default fallback
    if (step === activeAction.steps.length - 1) {
      return (
         <div className="text-center py-4">
           <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
           <h3 className="font-bold text-slate-800">Complete</h3>
         </div>
      );
    }
    
    return (
      <div className="py-8 text-center text-slate-500">
        <p>Connecting to {activeAction.title} engine...</p>
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
            className="flex items-start text-left p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-600 hover:shadow-sm transition-all"
          >
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 mr-4">
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
                <activeAction.icon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">{activeAction.title}</h3>
              </div>
              <button onClick={forceClose} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-2 mb-8">
                {activeAction.steps.map((s, i) => (
                  <div key={i} className="flex-1">
                    <div className={`h-1.5 rounded-full w-full ${i <= step ? "bg-emerald-600" : "bg-slate-100"}`} />
                    <p className={`text-xs mt-2 font-medium text-center ${i <= step ? "text-emerald-800" : "text-slate-400"}`}>
                      {s}
                    </p>
                  </div>
                ))}
              </div>

              <div className="min-h-[150px]">
                {googleStatus === 'loading' && (
                  <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium animate-pulse">
                    Connecting to Google Workspace...
                  </div>
                )}
                {googleActionMeta && (
                  <GoogleActionBanner message={googleActionMeta.message!} link={googleActionMeta.docUrl} />
                )}
                {renderStepContent()}
              </div>

              <div className="mt-8 flex justify-end">
                {step < activeAction.steps.length - 1 ? (
                  <button 
                    onClick={nextStep}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={googleStatus === 'success' || googleActionMeta ? forceClose : handleDone}
                    disabled={googleStatus === 'loading'}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium disabled:opacity-50"
                  >
                    {googleStatus === 'success' || googleActionMeta ? 'Close' : 'Done'}
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
