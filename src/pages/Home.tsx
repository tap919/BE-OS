import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Compass, Zap, Handshake, Newspaper, Calendar } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-10 rounded-2xl bg-slate-900 p-8 border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome, {user?.displayName || "Guest"}
          </h1>
          <p className="text-lg text-slate-400 max-w-lg">
            Your centralized operating system for wealth creation, housing protection, and legal sovereignty is fully operational.
          </p>
        </div>
        <Link 
          to="/tools"
          className="hidden sm:block relative z-10 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors"
        >
          Explore Tools
        </Link>
      </div>

      <SectionHeader 
        title="Start Exploring" 
        description="Quick access to core modules and community updates." 
      />

      <Grid className="mb-12">
        <Link to="/financial-literacy" className="block"><Card title="Quick Access Tiles" description="Shortcuts to money, housing, business, justice." icon={Zap} /></Link>
        <Link to="/tools" className="block"><Card title="Start Here Wizard" description="Asks 5–7 questions to route users to the right pillar." icon={Compass} /></Link>
        <Link to="/community" className="block"><Card title="Community News" description="Curated articles, events, and community wins." icon={Newspaper} /></Link>
        <Link to="/community" className="block"><Card title="Featured Black‑Owned Partners" description="Rotating spotlight of community businesses." icon={Handshake} /></Link>
        <Card title="Mission & Vision" description="Platform values, long‑term goals, and community commitments." icon={Handshake} />
        <Card title="Events" description="Workshops, webinars, and local meetups." icon={Calendar} />
      </Grid>
    </div>
  );
}
