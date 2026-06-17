import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Compass, Zap, Handshake, Newspaper, Calendar, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const wizardSteps = [
    {
      question: "What is your primary goal today?",
      options: [
         { label: "Build Wealth & Credit", route: "/financial-literacy" },
         { label: "Start/Grow a Business", route: "/business-builder" },
         { label: "Understand Housing Rights", route: "/fair-housing" },
         { label: "Find Legal Support", route: "/legal-empowerment" },
      ]
    },
    {
      question: "How much time do you have right now?",
      options: [
         { label: "Just 5 minutes (Quick Actions)", next: true },
         { label: "15+ minutes (Deep Dive & Docs)", next: true },
         { label: "I need immediate AI assistance", next: true }
      ]
    },
    {
      question: "Are you working independently or with a community?",
      options: [
         { label: "Solo founder/individual", next: true },
         { label: "With partners / co-founders", next: true },
         { label: "Looking for a community circle", route: "/blockchain-identity" }
      ]
    },
    {
      question: "Great. Should we save your progress to the Vault?",
      options: [
         { label: "Yes, track my stats securely", route: "/user-account" },
         { label: "Not right now", route: "/tools" }
      ]
    }
  ];

  const handleWizardChoice = (option: any) => {
    if (option.route && docRoute(option.route)) return;
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(prev => prev + 1);
    }
  };

  const docRoute = (path: string) => {
    setShowWizard(false);
    navigate(path);
    return true;
  };

  return (
    <div className="p-6 lg:p-10 relative">
      <div className="mb-10 rounded-2xl bg-slate-900 p-8 border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome, {user?.displayName || "Guest"}
          </h1>
          <p className="text-lg text-slate-400 max-w-lg">
            Your centralized operating system for wealth creation, housing protection, and legal sovereignty is fully operational.
          </p>
        </div>
        <button 
          onClick={() => { setWizardStep(0); setShowWizard(true); }}
          className="hidden sm:block relative z-10 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors"
        >
          Start Here Wizard
        </button>
      </div>

      <SectionHeader 
        title="Start Exploring" 
        description="Quick access to core modules and community updates." 
      />

      <Grid className="mb-12">
        <Link to="/financial-literacy" className="block"><Card title="Quick Access Tiles" description="Shortcuts to money, housing, business, justice." icon={Zap} /></Link>
        <div onClick={() => { setWizardStep(0); setShowWizard(true); }} className="block cursor-pointer"><Card title="Start Here Wizard" description="Asks 4 guiding questions to route you to the right pillar." icon={Compass} /></div>
        <Link to="/community" className="block"><Card title="Community News" description="Curated articles, events, and community wins." icon={Newspaper} /></Link>
        <Link to="/community" className="block"><Card title="Featured Black‑Owned Partners" description="Rotating spotlight of community businesses." icon={Handshake} /></Link>
        <Card title="Mission & Vision" description="Platform values, long‑term goals, and community commitments." icon={Handshake} />
        <Card title="Events" description="Workshops, webinars, and local meetups." icon={Calendar} />
      </Grid>

      {/* Wizard ModalOverlay */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
             <div className="flex justify-between items-center p-6 border-b border-slate-100">
               <div className="flex items-center gap-2 text-indigo-600">
                 <Compass className="w-5 h-5" />
                 <h2 className="font-bold text-lg">Onboarding Wizard</h2>
               </div>
               <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-8">
                <div className="flex gap-2 mb-8">
                  {wizardSteps.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= wizardStep ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                  ))}
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-6">
                  {wizardSteps[wizardStep].question}
                </h3>
                
                <div className="space-y-3">
                  {wizardSteps[wizardStep].options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleWizardChoice(opt)}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 font-medium text-slate-700 transition flex justify-between items-center group"
                    >
                      {opt.label}
                      <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
