import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { Database, BrainCircuit, CheckCircle, ShieldAlert, BarChart3, Users, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/AuthContext";

export default function AdminPanel() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"users" | "resources">("users");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch("/api/admin/system/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error("Unauthorized to access admin panel");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [getToken]);

  if (error) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[50vh]">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader 
        title="Admin Panel" 
        description="System management, content moderation, and operational oversight." 
      />

      <div className="flex gap-4 border-b border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab("users")}
          className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'users' ? 'text-amber-500 border-amber-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          User Directory
        </button>
        <button 
          onClick={() => setActiveTab("resources")}
          className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'resources' ? 'text-amber-500 border-amber-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
        >
          Resource Database
        </button>
      </div>

      {activeTab === "users" && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 animate-in fade-in">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            System Users
          </h3>
          {loading ? (
            <div className="text-slate-400">Loading user database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400">
                  <tr>
                    <th className="p-3 font-medium rounded-tl-lg">ID</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Role</th>
                    <th className="p-3 font-medium rounded-tr-lg">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="p-3 text-slate-500 font-mono text-xs">{u.id}</td>
                      <td className="p-3 text-slate-300 font-medium">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-300'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-slate-500 text-center py-4">No users found.</p>}
            </div>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <ResourceEditor />
      )}

      <Grid className="opacity-50">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
           <BrainCircuit className="h-6 w-6 text-slate-500 mb-2" />
           <h3 className="font-bold text-slate-400">AI Model Updates</h3>
           <p className="text-sm text-slate-500">Feature frozen in developer preview.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
           <BarChart3 className="h-6 w-6 text-slate-500 mb-2" />
           <h3 className="font-bold text-slate-400">Analytics Dashboard</h3>
           <p className="text-sm text-slate-500">Feature frozen in developer preview.</p>
        </div>
      </Grid>
    </div>
  );
}

function ResourceEditor() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", url: "", description: "", section: "financial_literacy" });
  const { getToken } = useAuth();
  
  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/resources", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setResources(d);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [getToken]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      await fetch("/api/admin/resources", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      setIsAdding(false);
      setFormData({ title: "", url: "", description: "", section: "financial_literacy" });
      fetchResources();
    } catch(err) {
      console.error(err);
      alert("Failed to save resource");
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-400" />
          Content Resource Database
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg text-sm flex items-center gap-2"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAdding ? "Cancel" : "Add Resource"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-amber-500/30">
          <h4 className="font-bold text-white mb-4">Add New Resource</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
            <input type="text" placeholder="URL" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" />
            <input type="text" placeholder="Description (2-3 sentences)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm col-span-2" />
            <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm">
              <option value="financial">Financial</option>
              <option value="business">Business</option>
              <option value="legal">Legal</option>
              <option value="housing">Housing</option>
              <option value="community">Community</option>
              <option value="capital">Capital</option>
            </select>
          </div>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.url || !formData.description}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded"
          >
            Save Entry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400">Loading DB entries...</div>
      ) : (
        <div className="space-y-2">
          {resources.slice(0, 50).map(r => (
            <div key={r.id} className="p-3 border border-slate-800 rounded bg-slate-800/50 flex justify-between items-center group">
              <div>
                <h4 className="font-bold text-white text-sm">[{r.section.toUpperCase()}] {r.title}</h4>
                <p className="text-xs text-slate-400 font-mono">{r.url}</p>
              </div>
              <button disabled className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded cursor-not-allowed">Edit (Coming Soon)</button>
            </div>
          ))}
          <p className="text-xs tracking-wider uppercase text-slate-500 mt-4 pt-4 border-t border-slate-800 text-center">
            Showing up to 50 rows (Edit functionality upcoming)
          </p>
        </div>
      )}
    </div>
  );
}
