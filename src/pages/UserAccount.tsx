import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { LayoutDashboard, Bookmark, WalletCards, FolderClosed, Bell, Settings, ExternalLink, ArrowRight, BarChart2, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UserAccount() {
  const { user, getToken } = useAuth();
  const [savedResources, setSavedResources] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ACTION_NAMES: Record<string, string> = {
    budgeting: "50/30/20 Budgeting",
//... (kept actions identical)
    debt: "Debt Payoff Plan",
    emergency: "Emergency Fund Setup",
    investing: "Investment Goals",
    pitch: "Pitch Deck Review",
    grant: "Grant Finder",
    cdfi: "CDFI Locator",
    investor: "Investor Match",
    expungement: "Clear Your Record",
    defense: "Know Your Rights",
    tenant: "Tenant Defense",
    search: "Case Law Search",
    llc: "Start your LLC",
    docs: "Build core documents",
    funding: "Find funding",
    grow: "Grow strategically",
    directories: "Explore directories",
    events: "Browse events",
    stories: "Read community stories",
    partner: "Find partner organizations"
  };

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const token = await getToken();
        if (!token) return;
        
        const res = await fetch("/api/user/dashboard-summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedResources(data.vault || []);
          
          const formattedStats = (data.stats || []).map((s: any) => ({
            name: formatSectionName(s.section),
            interactions: s.interactions
          }));
          setStats(formattedStats);
          
          setProgress(data.progress || []);
          setBlockchainInfo(data.blockchain);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, getToken]);

  const formatSectionName = (key: string) => {
    const names: Record<string, string> = {
      "fair_housing": "Fair Housing",
      "community_culture": "Community",
      "business": "Business",
      "legal": "Legal",
      "wealth": "Wealth",
      "financial": "Financial"
    };
    return names[key] || key;
  };

  return (
    <div className="p-6 lg:p-10">
      <SectionHeader 
        title="User Account" 
        description="Manage your profile, secure your documents, and track your progress." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <FolderClosed className="text-amber-500 h-6 w-6" />
              Document Vault & Saved Resources
            </h2>
            
            {loading ? (
              <div className="text-slate-400">Loading saved items...</div>
            ) : savedResources.length === 0 ? (
              <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                <Bookmark className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Your vault is empty</p>
                <p className="text-sm text-slate-500 mt-1">Bookmark resources or save AI advice to see them here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedResources.map((res: any) => (
                  <div key={res.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col sm:flex-row gap-4 justify-between sm:items-center group hover:border-slate-600 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{res.type}</span>
                      </div>
                      <h3 className="font-bold text-white mb-1">{res.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{res.description}</p>
                    </div>
                    {res.url !== "#" && res.type !== "ai_snippet" && (
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <BarChart2 className="text-indigo-400 h-6 w-6" />
              Activity Statistics
            </h2>
            {loading ? (
              <div className="text-slate-400">Loading stats...</div>
            ) : stats.length === 0 ? (
              <p className="text-slate-400">Interact with quick actions across the platform to build your activity profile.</p>
            ) : (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: '#334155', opacity: 0.4}} 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="interactions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <CheckCircle className="text-green-400 h-6 w-6" />
              Module Progress
            </h2>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-slate-800 rounded-xl"></div>
                <div className="h-20 bg-slate-800 rounded-xl"></div>
              </div>
            ) : progress.length === 0 ? (
              <p className="text-slate-400">Complete tools to see your progress here.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  progress.reduce((acc: any, p: any) => {
                    const mod = p.module;
                    if (!acc[mod]) acc[mod] = [];
                    acc[mod].push(p);
                    return acc;
                  }, {})
                ).map(([mod, items]: [string, any]) => (
                  <div key={mod} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-slate-200 capitalize mb-2">{mod} Module</h3>
                    <div className="space-y-2">
                       {items.map((item: any) => (
                         <div key={item.actionId} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-400">{ACTION_NAMES[item.actionId] || item.actionId}</span>
                            {item.status === 'completed' ? (
                               <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded">Completed</span>
                            ) : (
                               <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">Started (Step {item.stepReached})</span>
                            )}
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-400" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link to="/workspace" className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
                <span className="font-medium text-slate-300 group-hover:text-white">Workspace Sync</span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
              </Link>
              <Link to="/blockchain" className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
                <span className="font-medium text-slate-300 group-hover:text-white">Identity Credentials</span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
              </Link>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 opacity-50 cursor-not-allowed">
                <span className="font-medium text-slate-500">Notifications</span>
                <Bell className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 opacity-50 cursor-not-allowed">
                <span className="font-medium text-slate-500">Profile Settings</span>
                <Settings className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>
          
          {blockchainInfo && (blockchainInfo.credentials?.length > 0 || blockchainInfo.circles?.length > 0) && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-emerald-400" />
                Web3 Identity
              </h3>
              <div className="space-y-4">
                {blockchainInfo.credentials?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Credentials</h4>
                    <div className="space-y-2">
                       {blockchainInfo.credentials.map((cred: any) => (
                         <div key={cred.id} className="p-3 bg-slate-800 rounded border border-slate-700 text-sm flex justify-between">
                            <span className="text-slate-300">{cred.type}</span>
                            <span className="text-emerald-400 font-mono text-xs" title={cred.hash}>{cred.hash.substring(0,8)}...</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
                {blockchainInfo.circles?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Lending Circles</h4>
                    <div className="space-y-2">
                       {blockchainInfo.circles.map((circle: any) => (
                         <div key={circle.id} className="p-3 bg-slate-800 rounded border border-slate-700 text-sm flex justify-between">
                            <span className="text-slate-300">{circle.name}</span>
                            <span className="text-slate-400">Pool: ${circle.poolSize}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
