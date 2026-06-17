import React, { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { SectionHeader, Grid, Card } from "@/src/components/ui/LayoutBlocks";
import { FileDown, Mail, Calendar, Users, FileText, Video, Lock } from "lucide-react";

export default function WorkspaceHub() {
  const { user, getOAuthToken, signInWithGoogle } = useAuth();
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkspaceData();
    }
  }, [user]);

  const fetchWorkspaceData = async () => {
    const token = getOAuthToken();
    if (!token) {
      setError("Please sign in again to authorize Google Workspace access.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch Drive Files
      const driveRes = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=3", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (driveRes.ok) {
        const driveData = await driveRes.json();
        setDriveFiles(driveData.files || []);
      }

      // Fetch Gmail Threads
      const mailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&labelIds=UNREAD&maxResults=3", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (mailRes.ok) {
        const mailData = await mailRes.json();
        const msgIds = mailData.messages || [];
        
        const detailedMessages = await Promise.all(msgIds.map(async (m: any) => {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (detailRes.ok) {
            const detail = await detailRes.json();
            const subjectHeader = detail.payload?.headers?.find((h: any) => h.name === 'Subject');
            return { id: m.id, subject: subjectHeader ? subjectHeader.value : '(No Subject)' };
          }
          return { id: m.id, subject: 'Unknown' };
        }));
        setMessages(detailedMessages);
      }

      // Fetch Calendar Events
      const calRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=3&timeMin=" + (new Date()).toISOString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (calRes.ok) {
        const calData = await calRes.json();
        setEvents(calData.items || []);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch workspace data. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center h-full text-center">
        <Lock className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Workspace</h2>
        <p className="text-slate-500 max-w-md mb-6">
          Sign in and authorize access to display your Docs, Drive, Gmail, and Calendar right inside the EmpowerOS platform.
        </p>
        <button
          onClick={signInWithGoogle}
          className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-slate-900 transition-colors hover:bg-amber-600"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 flex flex-col gap-10">
      <SectionHeader 
        title="Workspace Hub" 
        description="Your connected Google Workspace apps unified in one dashboard." 
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={signInWithGoogle} className="text-sm font-bold underline">Re-authorize</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileDown className="w-5 h-5 text-blue-500" /> Recent Files</h3>
          </div>
          {loading ? <div className="animate-pulse flex flex-col gap-3"><div className="h-4 bg-slate-100 rounded w-full"></div></div> : (
            <ul className="space-y-3">
              {driveFiles.map(f => (
                <li key={f.id} className="text-sm text-slate-600 border-b border-slate-100 pb-2 truncate">{f.name}</li>
              ))}
              {driveFiles.length === 0 && <li className="text-sm text-slate-500">No recent files found.</li>}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Mail className="w-5 h-5 text-red-500" /> Unread Mail</h3>
          </div>
          {loading ? <div className="animate-pulse flex flex-col gap-3"><div className="h-4 bg-slate-100 rounded w-full"></div></div> : (
            <ul className="space-y-3">
              {messages.map((m, i) => (
                <li key={m.id || i} className="text-sm text-slate-600 border-b border-slate-100 pb-2 truncate">
                  <span className="font-medium text-slate-800">Mail:</span> {m.subject || `Message: ${m.id}`}
                </li>
              ))}
              {messages.length === 0 && <li className="text-sm text-slate-500">No recent mail found.</li>}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-green-500" /> Upcoming Events</h3>
          </div>
          {loading ? <div className="animate-pulse flex flex-col gap-3"><div className="h-4 bg-slate-100 rounded w-full"></div></div> : (
            <ul className="space-y-3">
              {events.map(e => (
                <li key={e.id} className="text-sm text-slate-600 border-b border-slate-100 pb-2 truncate">{e.summary || 'Busy'}</li>
              ))}
              {events.length === 0 && <li className="text-sm text-slate-500">No upcoming events.</li>}
            </ul>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2 mt-4">Workspace Actions</h2>
      <Grid>
        <Card title="Start Google Meet" description="Generate a secure video link for networking meetings." icon={Video} />
        <Card title="Create Business Doc" description="Draft a new Google Doc using AI coach templates." icon={FileText} />
        <Card title="Sync Contacts" description="Import and verify contacts from your Google network." icon={Users} />
      </Grid>
    </div>
  );
}
